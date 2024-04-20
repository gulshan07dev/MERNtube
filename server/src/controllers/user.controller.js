import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { omit } from "../utils/omit.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"
import { Types } from "mongoose";

const generateUniqueUsername = (fullName) => {
    const baseUsername = fullName.split(" ")[0].toLowerCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    return `@${baseUsername}_${randomSuffix}`;
};

const generateAccessAndRefereshTokens = async (user) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
}

// register
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;
    let avatar;
    let coverImage;
    try {
        // Check if any field is empty
        if (![fullName, email, password].every(Boolean)) {
            throw new ApiError(400, "All fields are required");
        }

        // Check if user already exists
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            throw new ApiError(400, "User already registered, please login");
        }

        // Generate a unique username for the user
        const username = generateUniqueUsername(fullName);

        // Upload avatar and coverImage if they exist
        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

        avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : undefined;
        coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : undefined;

        if(avatarLocalPath && !avatar) {
            throw new ApiError(500, "Failed to upload avatar!")
        }

        if(coverImageLocalPath && !coverImage) {
            throw new ApiError(500, "Failed to upload coverImage!")
        }

        // Save user in the database
        const user = await User.create({
            username,
            fullName,
            email,
            password,
            avatar: avatar?.url,
            coverImage: coverImage?.url,
        });

        if (!user) {
            throw new ApiError(500, "Failed to register user, try again!");
        }

        // Omit sensitive fields from the response
        const sensitiveFieldsToOmit = ['password', 'refreshToken'];
        const createdUserWithoutSensitiveFields = omit(user.toObject(), sensitiveFieldsToOmit);

        return res.status(201).json(
            new ApiResponse(200, {
                user: createdUserWithoutSensitiveFields
            },
                "User registered successfully!")
        );
    } catch (error) {
        if (avatar?.url) {
            await deleteOnCloudinary(avatar?.url)
        }
        if (coverImage?.url) {
            await deleteOnCloudinary(coverImage?.url)
        }
        throw error;
    }
});

// login
const loginUser = asyncHandler(async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    // check user exist or not with this username or email
    const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
        throw new ApiError(400,
            "User not register with this email or username, please register");
    }

    // check password
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Password is Incorrect!");
    }

    // generate access token and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user);

    // Omit sensitive fields from the response 
    const sensitiveFieldsToOmit = ['password', 'refreshToken'];
    const loggedInUserWithoutSensitiveFields = omit(user.toObject(), sensitiveFieldsToOmit);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(
            200,
            {
                user: loggedInUserWithoutSensitiveFields,
                accessToken,
                refreshToken
            },
            "User logged In Successfully!"
        ))
});

// logout
const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, {
        $unset: { refreshToken: 1 }
    }, { new: true });

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged Out successfully"))
});

// refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const clientRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!clientRefreshToken) {
        throw new ApiError(401, "Unauthorized request!");
    }

    // decode token
    const decodedToken = jwt.verify(clientRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if (!user && clientRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Unauthorized request!");
    }

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user);

    return res.
        status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(
            200,
            { accessToken, refreshToken },
            "Access token refreshed successfully!"))
});

// change user password
const changeUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "All fields are required!");
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, "oldPassword and newPassword are same!");
    }

    const user = await User.findById(req.user?._id);

    // check password
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Incorrect oldPassword!");
    }

    // save new password in db
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).
        json(new ApiResponse(200, {}, "Password changed successfully!"))
});

// change Account details
const changeAccountDetails = asyncHandler(async (req, res) => {
    const { username, fullName } = req.body;
    const updateFields = {};

    if (username) {
        updateFields.username = username;
    }

    if (fullName) {
        updateFields.fullName = fullName;
    }

    // Check if at least one field is provided
    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400,
            "At least one field (username or fullName) is required");
    }

    // fullName must be at least 3 char and less than 21 char
    if (fullName && fullName.length < 3) {
        throw new ApiError(400, "fullName must be least 3 char!");
    }
    if (fullName && fullName.length > 20) {
        throw new ApiError(400, "fullName must be less that 21 char!");
    }

    // username must be at least 3 char and less than 21 char
    if (username && username.length < 3) {
        throw new ApiError(400, "username must be least 3 char!");
    }
    if (username && username.length > 20) {
        throw new ApiError(400, "username must be less that 21 char!");
    }

    // check username already exist or not
    const isUsernameExist = await User.findOne({ username });
    if (isUsernameExist) {
        throw new ApiError(400, "Username must be unique!");
    }

    // save details in db
    const updatedUser = await User.findByIdAndUpdate(req.user?._id,
        updateFields,
        { new: true }).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError(500,
            "Failed to update user details, try again!");
    }

    return res.status(200).json(new ApiResponse(200,
        { user: updatedUser },
        "User details updated successfully!"));
});

// change user Avatar
const changeUserAvatar = asyncHandler(async (req, res) => {
    const avatarFilePath = req.file?.path;

    if (!avatarFilePath) {
        throw new ApiError(400, "Avatar is required!");
    }

    const user = await User.findById(req.user?._id)
        .select("-password -refreshToken");

    // delete previous avatar from cloudinary
    const previousAvatar = user.avatar;
    if (previousAvatar) {
        await deleteOnCloudinary(previousAvatar);
    }

    // upload new avatar on cloudinary
    const avatar = await uploadOnCloudinary(avatarFilePath);

    // save avatar in db
    user.avatar = avatar?.url
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, { user },
        "Avatar updated successfully!"
    ))
})

// change user coverImage
const changeUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageFilePath = req.file?.path;

    if (!coverImageFilePath) {
        throw new ApiError(400, "Cover Image is required!");
    }

    const user = await User.findById(req.user?._id)
        .select("-password -refreshToken");

    // delete previous cover image from cloudinary
    const previousCoverImage = user.coverImage;
    if (previousCoverImage) {
        await deleteOnCloudinary(previousCoverImage);
    }

    // upload new cover image on cloudinary
    const coverImage = await uploadOnCloudinary(coverImageFilePath);

    // save avatar in db
    user.coverImage = coverImage?.url
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, { user },
        "Cover Image updated successfully!"
    ))
})

// get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.user._id })
        .select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(
        200,
        { user },
        "User fetched successfully"))
})

// channel
const channel = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username) {
        throw new ApiError(400, "Username is missing!");
    }

    // check if channel not exist
    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, "channel does not exist!");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                },
                videoCount: {
                    $size: "$videos"
                }
            }
        },
        {
            $project: {
                username: 1,
                fullName: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                subscriberCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                videoCount: 1
            }
        }
    ])


    if (!channel?.length) {
        throw new ApiError(404, "channel does not exist!");
    }

    res.status(200).json(new ApiResponse(
        200,
        { channel: channel[0] },
        "User channel fetched successfully"
    ))
})

// get user watch history
const getUserWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    res.status(200).json(new ApiResponse(
        200,
        { watchHistory: user[0].watchHistory },
        "User watch history fetched successfully"
    ))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    changeAccountDetails,
    changeUserAvatar,
    changeUserCoverImage,
    getCurrentUser,
    channel,
    getUserWatchHistory
};