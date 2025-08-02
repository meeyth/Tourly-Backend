import { Router } from "express";
import {
  createComment,
  getCommentsByPost,
  deleteComment
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/:postId").get(getCommentsByPost); // fetch comments for a post
router.route("/").post(createComment); // post a comment
router.route("/:commentId").delete(deleteComment); // delete a comment

export default router;
