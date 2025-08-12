import Follow from "../models/follow.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Follow or Unfollow toggle
const toggleFollow = asyncHandler(async (req, res) => {
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
});

// Get followers of a user
const getFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const followers = await Follow.find({ following: userId }).populate("follower", "username avatar");
    return res.status(200).json(new ApiResponse(200, followers, "Followers fetched successfully"));
});

// Get following list of a user
const getFollowing = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const following = await Follow.find({ follower: userId }).populate("following", "username avatar");
    return res.status(200).json(new ApiResponse(200, following, "Following list fetched successfully"));
});

export { toggleFollow, getFollowers, getFollowing };
