import { RequestHandler } from "express";
import { prisma } from "../prisma/client.js";
import { isValidUnsplashId } from "../utils/index.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

// Response type for like count
type LikeCountResponse = {
  likes: number;
  isLiked?: boolean;
};

// POST /api/images/:id/like
export const likeImage = async (
  req: AuthenticatedRequest,
  res: any
): Promise<void> => {
  const { id: imageId } = req.params;
  const userId = req.user?.id;

  if (!isValidUnsplashId(imageId)) {
    res.status(400).json({ message: "Invalid image ID format" });
    return;
  }

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    // Check if user already liked this image
    const existingLike = await prisma.like.findFirst({
      where: { imageId, userId },
    });

    if (existingLike) {
      res.status(400).json({ message: "Image already liked" });
      return;
    }

    await prisma.like.create({
      data: { imageId, userId },
    });

    const likesCount = await prisma.like.count({ where: { imageId } });

    res.status(201).json({
      message: "Image liked!",
      likes: likesCount,
      isLiked: true,
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to like image" });
  }
};

// DELETE /api/images/:id/like
export const unlikeImage = async (
  req: AuthenticatedRequest,
  res: any
): Promise<void> => {
  const { id: imageId } = req.params;
  const userId = req.user?.id;

  if (!isValidUnsplashId(imageId)) {
    res.status(400).json({ message: "Invalid image ID format" });
    return;
  }

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    const like = await prisma.like.findFirst({
      where: { imageId, userId },
    });

    if (!like) {
      res.status(404).json({ message: "No like to remove" });
      return;
    }

    await prisma.like.delete({ where: { id: like.id } });

    const likesCount = await prisma.like.count({ where: { imageId } });

    res.status(200).json({
      message: "Image unliked",
      likes: likesCount,
      isLiked: false,
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to unlike image" });
  }
};

// GET /api/images/:id/likes
export const getLikesForImage = async (
  req: AuthenticatedRequest,
  res: any
): Promise<void> => {
  const { id: imageId } = req.params;
  const userId = req.user?.id;

  if (!isValidUnsplashId(imageId)) {
    res.status(400).json({ message: "Invalid image ID format" });
    return;
  }

  try {
    const count = await prisma.like.count({ where: { imageId } });

    let isLiked = false;
    if (userId) {
      const userLike = await prisma.like.findFirst({
        where: { imageId, userId },
      });
      isLiked = !!userLike;
    }

    res.status(200).json({
      likes: count,
      isLiked,
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch likes" });
  }
};
