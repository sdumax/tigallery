import { Router } from "express";
import imageRoutes from "./routes/image.routes.js";

const router = Router();

// Mount the image comment routes
router.use("/images", imageRoutes);

export default router;
