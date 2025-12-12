import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { getMyWishlist,removeFromWishlist,clearWishlist } from "../controllers/wishlist.controller.js";

const router = Router();

// Get wishlist of logged-in user
router.get("/my", verifyJWT, getMyWishlist);
router.delete("/remove/:postId", verifyJWT, removeFromWishlist);
router.delete("/clear", verifyJWT, clearWishlist);

export default router;
