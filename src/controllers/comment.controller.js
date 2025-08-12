import Comment from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create a new comment
const createComment = asyncHandler(async (req, res) => {
    const { text, post } = req.body;

    if (!text?.trim() || !post) {
        throw new ApiError(400, "Text and post ID are required");
    }

    const comment = await Comment.create({
        text,
        post,
        owner: req.user._id,
    });

    return res.status(201).json(new ApiResponse(201, comment, "Comment created successfully"));
});

// Get all comments for a post
const getCommentsByPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
        .populate("owner", "username avatar")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

// Delete a comment by id (only owner can delete)
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only delete your own comments");
    }

    await Comment.deleteOne({ _id: commentId });

    return res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export {
    createComment,
    getCommentsByPost,
    deleteComment,
};
