/*import Post  from "../models/post.model.js";

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

*/

import Post from "../models/post.model.js";

export const getHomeData = async (req, res) => {
  try {
    // 1️⃣ Fetch all posts with createdBy and likes populated
    const posts = await Post.find()
      .populate("createdBy", "username avatar")
      .populate("likes", "username avatar") // populate likes too
      .sort({ createdAt: -1 }); // most recent first

    // 2️⃣ Most Liked → FILTER only posts having at least 1 like and get top 5
    const mostLiked = posts
      .filter((p) => p.likes.length > 0)
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, 5);

    // 3️⃣ Recent posts → all posts sorted by createdAt descending
    const recent = posts; // already sorted by createdAt descending

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
