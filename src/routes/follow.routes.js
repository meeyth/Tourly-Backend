/*import { Router } from "express";
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

export default router;*/
import { Router } from "express";

import {
  toggleFollow,
  getFollowers,
  getFollowing
} from "../controllers/follow.controller.js";

import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

// Protect follow/unfollow routes
// Use toggleFollow for following/unfollowing
router.post("/follow/:userId", verifyJWT, toggleFollow);

router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);
export default router;
