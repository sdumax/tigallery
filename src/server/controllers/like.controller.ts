import { RequestHandler } from "express";
import { prisma } from "../prisma/client.js";
import { isValidUnsplashId } from "../utils/index.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  likeUnsplashImage,
  unlikeUnsplashImage,
} from "../services/unsplash.service.js";
import {
  sendValidationError,
  sendSuccessResponse,
  handleDatabaseError,
  handleExternalApiError,
  logError,
} from "../utils/errorHandling.js";

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

  if (!imageId || !isValidUnsplashId(imageId)) {
    sendValidationError(res, "Valid image ID is required", "imageId");
    return;
  }

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  try {
    // Check if user already liked this image
    const existingLike = await prisma.like.findFirst({
      where: { imageId, userId },
    });

    if (existingLike) {
      res.status(409).json({
        success: false,
        message: "Image already liked by user",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Try to like the image on Unsplash (non-blocking)
    try {
      await likeUnsplashImage(imageId);
    } catch (unsplashError) {
      // Log the error but don't fail the request
      logError("likeImage - Unsplash API", unsplashError, { imageId, userId });
    }

    // Store the like in our database
    await prisma.like.create({
      data: { imageId, userId },
    });

    const likesCount = await prisma.like.count({ where: { imageId } });

    sendSuccessResponse(
      res,
      {
        likes: likesCount,
        isLiked: true,
      },
      "Image liked successfully",
      201
    );
  } catch (error: unknown) {
    handleDatabaseError(res, "likeImage", error);
  }
};

// DELETE /api/images/:id/like
export const unlikeImage = async (
  req: AuthenticatedRequest,
  res: any
): Promise<void> => {
  const { id: imageId } = req.params;
  const userId = req.user?.id;

  if (!imageId || !isValidUnsplashId(imageId)) {
    sendValidationError(res, "Valid image ID is required", "imageId");
    return;
  }

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  try {
    const like = await prisma.like.findFirst({
      where: { imageId, userId },
    });

    if (!like) {
      res.status(404).json({
        success: false,
        message: "Like not found for this user and image",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Try to unlike the image on Unsplash (non-blocking)
    try {
      await unlikeUnsplashImage(imageId);
    } catch (unsplashError) {
      // Log the error but don't fail the request
      logError("unlikeImage - Unsplash API", unsplashError, {
        imageId,
        userId,
      });
    }

    // Remove the like from our database
    await prisma.like.delete({ where: { id: like.id } });

    const likesCount = await prisma.like.count({ where: { imageId } });

    sendSuccessResponse(
      res,
      {
        likes: likesCount,
        isLiked: false,
      },
      "Image unliked successfully"
    );
  } catch (error: unknown) {
    handleDatabaseError(res, "unlikeImage", error);
  }
};

// GET /api/images/:id/likes
export const getLikesForImage = async (
  req: AuthenticatedRequest,
  res: any
): Promise<void> => {
  const { id: imageId } = req.params;
  const userId = req.user?.id;

  if (!imageId || !isValidUnsplashId(imageId)) {
    sendValidationError(res, "Valid image ID is required", "imageId");
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

    sendSuccessResponse(
      res,
      {
        likes: count,
        isLiked,
      },
      "Like information retrieved successfully"
    );
  } catch (error: unknown) {
    handleDatabaseError(res, "getLikesForImage", error);
  }
};
