import { RequestHandler } from "express";
import { prisma } from "../prisma/client.js";

// Response type for like count
type LikeCountResponse = {
  likes: number;
};

// POST /api/images/:id/like
export const likeImage: RequestHandler<
  { id: string },
  { message: string }
> = async (req, res) => {
  const { id: imageId } = req.params;

  try {
    await prisma.like.create({ data: { imageId } });
    res.status(201).json({ message: "Image liked!" });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to like image" });
  }
};

// DELETE /api/images/:id/like
export const unlikeImage: RequestHandler<
  { id: string },
  { message: string }
> = async (req, res) => {
  const { id: imageId } = req.params;

  try {
    const like = await prisma.like.findFirst({
      where: { imageId },
      orderBy: { createdAt: "desc" },
    });

    if (!like) {
      res.status(404).json({ message: "No like to remove" });
      return;
    }

    await prisma.like.delete({ where: { id: like.id } });
    res.status(200).json({ message: "Image unliked" });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to unlike image" });
  }
};

// GET /api/images/:id/likes
export const getLikesForImage: RequestHandler<
  { id: string },
  LikeCountResponse | { message: string }
> = async (req, res) => {
  const { id: imageId } = req.params;

  try {
    const count = await prisma.like.count({ where: { imageId } });
    res.status(200).json({ likes: count });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch likes" });
  }
};
