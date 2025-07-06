import { RequestHandler } from "express";
import { prisma } from "../prisma/client.js";
import { isValidUnsplashId } from "../utils/index.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

// Types
type Comment = {
  id: number;
  imageId: string;
  userId: number | null;
  content: string;
  createdAt: Date;
  user?: {
    id: number;
    username: string;
  } | null;
};

type CreateCommentBody = {
  content: string;
};

type CommentError = { message: string };

// GET /api/images/:id/comments
export const getCommentsByImage: RequestHandler<
  { id: string },
  Comment[] | CommentError
> = async (req, res) => {
  const { id: imageId } = req.params;

  // Validate imageId
  if (!isValidUnsplashId(imageId)) {
    res.status(400).json({ message: "Invalid image ID format" });
    return;
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { imageId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(comments);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// POST /api/images/:id/comments
export const addComment = async (
  req: AuthenticatedRequest,
  res: any
): Promise<void> => {
  const { id: imageId } = req.params;

  if (!isValidUnsplashId(imageId)) {
    res.status(400).json({ message: "Invalid image ID format" });
    return;
  }

  const { content }: CreateCommentBody = req.body;
  const userId = req.user?.id;

  // Basic validation
  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  if (!content || content.trim().length < 3) {
    res
      .status(400)
      .json({ message: "Content (min 3 characters) is required." });
    return;
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        imageId,
        userId,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    res.status(201).json(comment);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// DELETE /api/images/:id/comments/:commentId
export const deleteComment = async (
  req: AuthenticatedRequest,
  res: any
): Promise<void> => {
  const { id: imageId, commentId } = req.params;
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
    // Check if comment exists and belongs to the user
    const comment = await prisma.comment.findFirst({
      where: {
        id: parseInt(commentId),
        imageId,
        userId,
      },
    });

    if (!comment) {
      res.status(404).json({ message: "Comment not found or unauthorized" });
      return;
    }

    // Delete the comment
    await prisma.comment.delete({
      where: {
        id: parseInt(commentId),
      },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};
