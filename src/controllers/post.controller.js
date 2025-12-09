import Post from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new post
const createPost = asyncHandler(async (req, res) => {
  const { title, description, location, images } = req.body;

  if (!title || !location?.city || !location?.country) {
    throw new ApiError(400, "Title, city, and country are required");
  }

  const abusiveTitle = await checkAbusiveText(title || "");
  const abusiveDescription = await checkAbusiveText(description || "");

  if (abusiveTitle || abusiveDescription) {
    return res.status(400).json(new ApiResponse(400, null, "Post contains abusive content"));
  }

  const post = await Post.create({
    title,
    description,
    location,
    images: images || [],
    createdBy: req.user._id,
  });

  return res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

// Get all posts (you can add pagination/filter later)
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("createdBy", "username avatar")
    .populate("likes", "username")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

// Get single post by ID
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId)
    .populate("createdBy", "username avatar")
    .populate("likes", "username");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res.status(200).json(new ApiResponse(200, post, "Post fetched successfully"));
});

// Update post
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Only creator can update
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

  return res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
});

// Delete post
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  await post.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully"));
});

// Like / Unlike post toggle
const toggleLikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const userId = req.user._id.toString();
  const index = post.likes.findIndex((id) => id.toString() === userId);

  if (index === -1) {
    // Not liked yet, add like
    post.likes.push(userId);
  } else {
    // Already liked, remove like
    post.likes.splice(index, 1);
  }

  await post.save();

  return res.status(200).json(
    new ApiResponse(200, post.likes, index === -1 ? "Post liked" : "Post unliked")
  );
});

export {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost,
};
