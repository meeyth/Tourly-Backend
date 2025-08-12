/*import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  likePost
} from "../controllers/post.controller.js";

const router = Router();

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:postId", getSinglePost);
router.patch("/:postId", updatePost);
router.delete("/:postId", deletePost);

// Like a post
router.post("/:postId/like", likePost);

export default router;
*/

import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,    // renamed to keep consistent
  updatePost,
  deletePost,
  toggleLikePost  // renamed to keep consistent
} from "../controllers/post.controller.js";

import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:postId", getPostById);

// Protected routes: user must be logged in
router.post("/", verifyJWT, createPost);
router.patch("/:postId", verifyJWT, updatePost);
router.delete("/:postId", verifyJWT, deletePost);

// Like/unlike a post toggle
router.post("/:postId/like", verifyJWT, toggleLikePost);

export default router;
