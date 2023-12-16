import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateUniqueUsername = (fullName) => {
    const baseUsername = fullName.split(" ")[0].toLowerCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    return `@${baseUsername}_${randomSuffix}`;
};

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
        return next(new ApiError(500, "Failed to register user"));
    }

    // Omit sensitive fields from the response
    const { password: _, refreshToken, ...createdUser } = user.toObject();

    return res.status(201).json(
        new ApiResponse(200, {user: createdUser}, "User registered successfully")
    );

});

export { registerUser };
