import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const jwt_token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

        if (!jwt_token) {
            return next(new ApiError(401, "Unauthorized request!"));
        }

        // decode token
        const decodeToken = jwt.verify(jwt_token, process.env.ACCESS_TOKEN_SECRET);

        if (!decodeToken) {
            return next(new ApiError(401, "Invalid access token"));
        }

        const user = await User.findById(decodeToken?._id);

        if (!user) {
            return next(new ApiError(401, "Invalid access token"));
        }

        req.user = user
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})