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
import { upload } from "../middlewares/multer.middleware.js"; // << ADD THIS
const router = Router();

router.get("/", getAllPosts);
router.get("/:postId", getPostById);

// Protected routes: user must be logged in
//router.post("/", verifyJWT, createPost);
router.post("/", verifyJWT, upload.array("images"), createPost);
router.patch("/:postId", verifyJWT, updatePost);
router.delete("/:postId", verifyJWT, deletePost);

// Like/unlike a post toggle
router.post("/:postId/like", verifyJWT, toggleLikePost);

export default router;
