import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
   updateProfile,
  getUserProfile,
 
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; //  multer for avatar

const router = Router();
router.get("/profile", verifyJWT, getUserProfile);
// Public routes
router.post("/register", upload.single("avatar"), registerUser); //  handles avatar file
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", verifyJWT, logoutUser);
router.patch("/update", verifyJWT, upload.single("avatar"), updateProfile); //  also supports updating avatar

export default router;


