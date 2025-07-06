import { Router } from "express";
import {
  getCommentsByImage,
  addComment,
} from "../controllers/image.controller.js";
import {
  likeImage,
  unlikeImage,
  getLikesForImage,
} from "../controllers/like.controller.js";
import {
  handleSearch,
  handleGetImage,
  handleGetImages,
} from "../controllers/unsplash.controller.js";
import {
  authenticateToken,
  optionalAuth,
} from "../middleware/auth.middleware.js";

const router = Router();

// Unsplash /images/
router.get("/", handleGetImages); // /api/images?page=1&perPage=10
router.get("/search", handleSearch); // /api/images/search?query=cats
router.get("/:id/details", optionalAuth, handleGetImage); // /api/images/:id/details

// Comments /api/images/
router.get("/:id/comments", getCommentsByImage);
router.post("/:id/comments", authenticateToken, addComment);

// Likes /api/images/
router.get("/:id/likes", optionalAuth, getLikesForImage);
router.post("/:id/like", authenticateToken, likeImage);
router.delete("/:id/like", authenticateToken, unlikeImage);

export default router;
