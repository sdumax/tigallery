import { Router } from "express";
import {
  getCommentsByImage,
  addComment,
} from "../controllers/image.controller";
import {
  likeImage,
  unlikeImage,
  getLikesForImage,
} from "../controllers/like.controller";
import {
  handleSearch,
  handleGetImage,
  handleGetImages,
} from "../controllers/unsplash.controller";

const router = Router();

// Unsplash /images/
router.get("/", handleGetImages); // /api/images?page=1&perPage=10
router.get("/search", handleSearch); // /api/images/search?query=cats
router.get("/:id/details", handleGetImage); // /api/images/:id/details

// Comments /api/images/
router.get("/:id/comments", getCommentsByImage);
router.post("/:id/comments", addComment);

// Likes /api/images/
router.get("/:id/likes", getLikesForImage);
router.post("/:id/like", likeImage);
router.delete("/:id/like", unlikeImage);

export default router;
