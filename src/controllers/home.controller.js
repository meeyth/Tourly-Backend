/*import Post from "../models/post.model.js";  
import { asyncHandler } from "../utils/asyncHandler.js";

export const getHomeData = asyncHandler(async (req, res) => {

    // Most liked posts → sorted by likesCount desc
    const mostLiked = await Post.find({})
        .sort({ likesCount: -1 })
        .limit(10);

    // Recently added → sorted by createdAt desc
    const recent = await Post.find({})
        .sort({ createdAt: -1 })
        .limit(10);

    res.status(200).json({
        success: true,
        message: "Homepage data fetched successfully",
        data: {
            mostLiked,
            recent
        }
    });
});
import Post from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Homepage data
export const getHomeData = asyncHandler(async (req, res) => {

    // Most liked posts → only those with the highest number of likes
    const mostLiked = await Post.find()
        .populate("createdBy", "username avatar")
        .populate("likes", "username")
        .sort({ "likes.length": -1, createdAt: -1 }) // sort by number of likes
        .limit(3); // limit to top 3, adjust as needed

    // Recently added → sorted by createdAt desc
    const recent = await Post.find()
        .populate("createdBy", "username avatar")
        .populate("likes", "username")
        .sort({ createdAt: -1 })
        .limit(10);

    res.status(200).json({
        success: true,
        message: "Homepage data fetched successfully",
        data: {
            mostLiked,
            recent
        }
    });
});*/

import Post  from "../models/post.model.js";

export const getHomeData = async (req, res) => {
  try {
    // 1️⃣ Fetch all posts
    const posts = await Post.find()
      .populate("createdBy", "username avatar")
      .sort({ createdAt: -1 });

    // 2️⃣ Most Liked → FILTER only posts having at least 1 like
    const mostLiked = posts
      .filter((p) => p.likes.length > 0)
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, 5);

    // 3️⃣ Recent posts
    const recent = posts.slice(0, 5);

    res.status(200).json({
      success: true,
      message: "Homepage data fetched successfully",
      data: {
        mostLiked,
        recent,
      },
    });
  } catch (error) {
    console.error("Error in homepage:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

