import User from "../models/user.model.js"; // default import, not named
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res
                .status(403)
                .json(new ApiResponse(403, "No token provided", "Failed"));
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET // make sure .env matches
        );

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            return res
                .status(403)
                .json(new ApiResponse(403, "Invalid token: user not found", "Failed"));
        }

        req.user = user;
        next();
    } catch (error) {
        return res
            .status(403)
            .json(new ApiResponse(403, "Unauthorized request", "Failed"));
    }
});
