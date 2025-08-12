/*import { Router } from "express";
import {
  createComment,
  getCommentsByPost,
  deleteComment
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/:postId").get(getCommentsByPost); // fetch comments for a post
router.route("/").post(createComment); // post a comment
router.route("/:commentId").delete(deleteComment); // delete a comment

export default router;*/

import { Router } from "express";
import {
  createComment,
  getCommentsByPost,
  deleteComment
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

// Public route: fetch comments for a specific post
router.get("/post/:postId", getCommentsByPost);

// Protected routes: create or delete comment (user must be logged in)
router.post("/", verifyJWT, createComment);
router.delete("/:commentId", verifyJWT, deleteComment);

export default router;

