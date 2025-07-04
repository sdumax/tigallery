import { RequestHandler } from "express";
import { prisma } from "../prisma/client.js";
import { isValidUnsplashId } from "../utils/index.js";

// Types
type Comment = {
  id: number;
  imageId: string;
  author: string;
  content: string;
  createdAt: Date;
};

type CreateCommentBody = {
  author: string;
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
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(comments);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// POST /api/images/:id/comments
export const addComment: RequestHandler<
  { id: string },
  Comment | CommentError,
  CreateCommentBody
> = async (req, res) => {
  const { id: imageId } = req.params;

  if (!imageId || imageId.length !== 36) {
    res.status(400).json({ message: "Invalid image ID" });
    return;
  }

  const { author, content } = req.body;

  // Basic validation
  if (!author || !content || content.trim().length < 3) {
    res
      .status(400)
      .json({ message: "Author and content (min 3 characters) are required." });
    return;
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        imageId,
        author,
        content: content.trim(),
      },
    });
    res.status(201).json(comment);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};
