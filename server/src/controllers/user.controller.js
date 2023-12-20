import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { omit } from "../utils/omit.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"

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

const options = {
    httpOnly: true,
    secure: true
}

// register
const registerUser = asyncHandler(async (req, res, next) => {
    const { fullName, email, password } = req.body;

    // Check if any field is empty
    if (![fullName, email, password].every(Boolean)) {
        return next(new ApiError(400, "All fields are required"));
    }

    // Check if user already exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        return next(new ApiError(400, "User already registered, please login"));
    }

    // Generate a unique username for the user
    const username = generateUniqueUsername(fullName);

    // Upload avatar and coverImage if they exist
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : undefined;
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : undefined;

    // Save user in the database
    const user = await User.create({
        username,
        fullName,
        email,
        password,
        avatar,
        coverImage,
    });

    if (!user) {
        return next(new ApiError(500, "Failed to register user, try again!"));
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

});

// login
const loginUser = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    // check user exist or not with this username or email
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        return next(
            new ApiError(400,
                "User not register with this email or username, please register"));
    }

    // check password
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return next(new ApiError(400, "Password is Incorrect!"));
    }

    // generate access token and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user);

    // Omit sensitive fields from the response 
    const sensitiveFieldsToOmit = ['password', 'refreshToken'];
    const loggedInUserWithoutSensitiveFields = omit(user.toObject(), sensitiveFieldsToOmit);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200,
            {
                user: loggedInUserWithoutSensitiveFields, accessToken, refreshToken
            },
            "User logged In Successfully!"
        ))
});

// logout
const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(userId, {
        $set: { refreshToken: undefined }
    }, { new: true });

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out successfully"))
});

// refresh access token
const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const clientRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!clientRefreshToken) {
        return next(new ApiError(401, "Unauthorized request!"));
    }

    // decode token
    const decodedToken = jwt.verify(clientRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if (!user && clientRefreshToken !== user?.refreshToken) {
        return next(new ApiError(401, "Unauthorized request!"));
    }

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user);

    return res.
        status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { accessToken, refreshToken },
            "Access token refreshed successfully!"))
});

// change user password
const changeUserPassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return next(new ApiError(400, "All fields are required!"));
    }

    if (oldPassword === newPassword) {
        return next(new ApiError(400, "oldPassword and newPassword are same!"));
    }

    const user = await User.findById(req.user?._id);

    // check password
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        return next(new ApiError(400, "Incorrect oldPassword!"))
    }

    // save new password in db
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).
        json(new ApiResponse(400, {}, "Password changed successfully!"))
});

// change Account details
const changeAccountDetails = asyncHandler(async (req, res, next) => {
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
        return next(new ApiError(400,
            "At least one field (username or fullName) is required"));
    }

    // check username already exist or not
    const isUsernameExist = await User.findOne({ username });
    if (isUsernameExist) {
        return next(new ApiError(400, "Username must be unique!"));
    }

    // save details in db
    const updatedUser = await User.findByIdAndUpdate(req.user?._id,
        updateFields,
        { new: true }).select("-password -refreshToken");

    if (!updatedUser) {
        return next(new ApiError(500,
            "Failed to update user details, try again!"));
    }

    return res.status(200).json(new ApiResponse(200,
        { user: updatedUser },
        "User details updated successfully!"));
});

// change user Avatar
const changeUserAvatar = asyncHandler(async (req, res, next) => {
    const avatarFilePath = req.file?.path;

    if (!avatarFilePath) {
        return next(new ApiError(400, "Avatar is required!"));
    }

    const user = await User.findById(req.user?._id);

    // delete previous avatar from cloudinary
    const previousAvatar = user.avatar;
    if (previousAvatar.key) {
        await deleteOnCloudinary(previousAvatar.key);
    }

    // upload new avatar on cloudinary
    const avatar = await uploadOnCloudinary(avatarFilePath);

    // save avatar in db
    user.avatar = avatar;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {},
        "Avatar updated successfully!"
    ))
})

// change user coverImage
const changeCoverImage = asyncHandler(async (req, res, next) => {
    const coverImageFilePath = req.file?.path;

    if (!coverImageFilePath) {
        return next(new ApiError(400, "Cover Image is required!"));
    }

    const user = await User.findById(req.user?._id);

    // delete previous cover image from cloudinary
    const previousCoverImage = user.coverImage;
    if (previousCoverImage.key) {
        await deleteOnCloudinary(previousCoverImage.key);
    }

    // upload new cover image on cloudinary
    const coverImage = await uploadOnCloudinary(coverImageFilePath);

    // save avatar in db
    user.coverImage = coverImage;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {},
        "Cover Image updated successfully!"
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
    changeCoverImage
};