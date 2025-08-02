import { Router } from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} from "../controllers/follow.controller.js";

const router = Router();

router.post("/follow", followUser);
router.post("/unfollow", unfollowUser);
router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);

export default router;
