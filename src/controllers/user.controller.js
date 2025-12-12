// controllers/user.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";

//import { asyncHandler } from "./utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
//import { User } from "../models/user.model.js";
import User from "../models/user.model.js"; // ✅ correct

//import { Follow } from "../models/follow.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { options } from "../constants.js";

// ---------------------- Helper: Generate Tokens ----------------------
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
};

// ---------------------- Register User ----------------------
const registerUser = asyncHandler(async (req, res) => {
    const {  email, username, password } = req.body;

    if ([ email, username, password].some(field => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar?.url) {
        throw new ApiError(400, "Error uploading avatar");
    }

    const user = await User.create({
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatar.url
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(createdUser._id);

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, { user: createdUser, accessToken, refreshToken }, "User registered successfully"));
});

// ---------------------- Login User ----------------------
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});



// ---------------------- Logout User ----------------------
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// ---------------------- Refresh Access Token ----------------------
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password");
        if (!user) throw new ApiError(401, "Invalid refresh token");

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is invalid or expired");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user, accessToken, refreshToken }, "Access token refreshed"));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

// ---------------------- Change Password ----------------------
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

// ---------------------- Get Current User ----------------------
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// ---------------------- Update Profile ----------------------
const updateProfile = asyncHandler(async (req, res) => {
    const { fullname, email, username } = req.body;

    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;
    if (username) updateData.username = username;

    if (req.file?.path) {
        const avatar = await uploadOnCloudinary(req.file.path);
        if (avatar?.url) updateData.avatar = avatar.url;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true }).select("-password");

    return res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

// ---------------------- Get Other User Profile ----------------------
const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username?.trim()) throw new ApiError(400, "Username is required");

    const profile = await User.findOne({ username: username.toLowerCase() }).select("-password -refreshToken -email");
    if (!profile) throw new ApiError(404, "User profile not found");

    const isFollowing = await Follow.findOne({ follower: req.user._id, following: profile._id });

    return res.status(200).json(new ApiResponse(200, { profile, isFollowing: Boolean(isFollowing) }, "Profile fetched successfully"));
});

// ---------------------- Follow / Unfollow ----------------------
/*const toggleFollow = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (req.user._id.toString() === userId) {
        throw new ApiError(400, "You cannot follow yourself");
    }

    const existingFollow = await Follow.findOne({ follower: req.user._id, following: userId });
    if (existingFollow) {
        await Follow.deleteOne({ _id: existingFollow._id });
        return res.status(200).json(new ApiResponse(200, {}, "Unfollowed successfully"));
    }

    await Follow.create({ follower: req.user._id, following: userId });
    return res.status(200).json(new ApiResponse(200, {}, "Followed successfully"));
});*/

// ---------------------- Export ----------------------
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateProfile,
    getUserProfile,
   
};

