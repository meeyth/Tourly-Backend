import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateProfile,
  getUserProfile,
  toggleFollow
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; //  multer for avatar

const router = Router();

// Public routes
router.post("/register", upload.single("avatar"), registerUser); //  handles avatar file
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", verifyJWT, logoutUser);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/update", verifyJWT, upload.single("avatar"), updateProfile); //  also supports updating avatar
router.get("/profile/:username", verifyJWT, getUserProfile);
router.post("/follow/:userId", verifyJWT, toggleFollow);

export default router;


