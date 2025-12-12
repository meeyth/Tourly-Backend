import {Wishlist } from "../models/wishlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId })
    .populate("posts")   // populate post details
    .lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      wishlist || { posts: [] },
      "Wishlist fetched successfully"
    )
  );
});

// REMOVE a single post from wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.postId;

  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw new ApiError(404, "No wishlist found");

  wishlist.posts.pull(postId);
  await wishlist.save();

  return res.status(200).json(new ApiResponse(200, wishlist, "Post removed from wishlist"));
});

// CLEAR wishlist
export const clearWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await Wishlist.findOneAndUpdate({ user: userId }, { $set: { posts: [] } }, { upsert: true });
  return res.status(200).json(new ApiResponse(200, [], "Wishlist cleared successfully"));
});


