import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";
import imageRoutes from "./routes/image.routes.js";

const router = Router();

// Mount the authentication routes
router.use("/auth", authRoutes);

// Mount the image routes
router.use("/images", imageRoutes);

export default router;
