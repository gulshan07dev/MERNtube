import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler((req, res, next) => {
    const jwt_token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

    if (!jwt_token) {
        return next(new ApiError(401, "Unauthorise request!"));
    }

    // decode token
    const user = jwt.verify(jwt_token, process.env.ACCESS_TOKEN_SECRET);

    if (!user) {
        return next(new ApiError(401, "Invalid access token"));
    }

    req.user = user;
    next();
})