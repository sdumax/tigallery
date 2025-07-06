import { Router } from "express";
import {
  register,
  login,
  getProfile,
  refreshToken,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authenticateToken, getProfile);
router.post("/refresh", authenticateToken, refreshToken);

export default router;
