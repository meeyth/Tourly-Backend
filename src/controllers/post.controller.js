import Post from "../models/post.model.js";
import  {Wishlist}  from "../models/wishlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { checkAbusiveText } from "../utils/checkAbusiveText.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// -------------------- CLOUDINARY CONFIG --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// ------------------------------------------------------------
// CREATE NEW POST
// ------------------------------------------------------------
const createPost = asyncHandler(async (req, res) => {
  const { title, description, location } = req.body;

  if (!title || !location?.city || !location?.country) {
    throw new ApiError(400, "Title, city, and country are required");
  }

  // Abusive check
  const abusiveTitle = await checkAbusiveText(title || "");
  const abusiveDescription = await checkAbusiveText(description || "");

  if (abusiveTitle || abusiveDescription) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Post contains abusive content"));
  }

  // ----------------- Handle image uploads -------------------
  let uploadedImageUrls = [];

  if (req.files && req.files.length > 0) {
    for (let file of req.files) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "tourly_posts",
      });

      uploadedImageUrls.push(uploadResult.secure_url);

      // Delete temp file
      fs.unlinkSync(file.path);
    }
  }

  // Create post
  const post = await Post.create({
    title,
    description,
    location,
    images: uploadedImageUrls,
    createdBy: req.user._id,
  });

  // Populate createdBy before sending response
  await post.populate("createdBy", "username avatar");

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

// ------------------------------------------------------------
// GET ALL POSTS
// ------------------------------------------------------------
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("createdBy", "username avatar")
    .populate("likes", "username")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

// ------------------------------------------------------------
// GET SINGLE POST BY ID
// ------------------------------------------------------------
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId)
    .populate("createdBy", "username avatar")
    .populate("likes", "username");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});

// ------------------------------------------------------------
// UPDATE POST
// ------------------------------------------------------------
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Authorization
  if (post.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this post");
  }

  const { title, description, location, images } = req.body;

  if (title) post.title = title;
  if (description) post.description = description;
  if (location) {
    if (location.city) post.location.city = location.city;
    if (location.country) post.location.country = location.country;
  }
  if (images) post.images = images;

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post updated successfully"));
});

// ------------------------------------------------------------
// DELETE POST
// ------------------------------------------------------------
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  await post.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

// ------------------------------------------------------------
// LIKE / UNLIKE POST
// ------------------------------------------------------------
/*export const toggleLikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.postId;

        let post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if already liked
        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            // UNLIKE the post
            post.likes.pull(userId);
            await post.save();

            // Remove from wishlist
            await Wishlist.findOneAndUpdate(
                { user: userId },
                { $pull: { posts: postId } }
            );

            // Populate before sending response
            post = await post.populate("createdBy", "username avatar")
                             .populate("likes", "username");

            return res.json({
                success: true,
                message: "Post unliked",
                data: post
            });
        } else {
            // LIKE the post
            post.likes.push(userId);
            await post.save();

            // Add to wishlist
            await Wishlist.findOneAndUpdate(
                { user: userId },
                { $addToSet: { posts: postId } },
                { upsert: true, new: true }
            );

            // Populate before sending response
            post = await post.populate("createdBy", "username avatar")
                             .populate("likes", "username");

            return res.json({
                success: true,
                message: "Post liked",
                data: post
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};*/
export const toggleLikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.postId;

        let post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes.pull(userId);
            await post.save();

            await Wishlist.findOneAndUpdate(
                { user: userId },
                { $pull: { posts: postId } }
            );

            // Re-fetch the post with populated fields
            post = await Post.findById(postId)
                .populate("createdBy", "username avatar")
                .populate("likes", "username");

            return res.json({
                success: true,
                message: "Post unliked",
                data: post
            });
        } else {
            post.likes.push(userId);
            await post.save();

            await Wishlist.findOneAndUpdate(
                { user: userId },
                { $addToSet: { posts: postId } },
                { upsert: true, new: true }
            );

            // Re-fetch the post with populated fields
            post = await Post.findById(postId)
                .populate("createdBy", "username avatar")
                .populate("likes", "username");

            return res.json({
                success: true,
                message: "Post liked",
                data: post
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// ------------------------------------------------------------
export {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  
};
