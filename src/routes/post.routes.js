import { Router } from "express";
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
