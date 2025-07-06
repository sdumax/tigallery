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
