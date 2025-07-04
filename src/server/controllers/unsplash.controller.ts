import { RequestHandler } from "express";
import {
  searchImages,
  getImageById,
  getImages,
} from "../services/unsplash.service.js";
import { isValidUnsplashId } from "../utils/index.js";

// GET /api/unsplash/search?query=cat&page=1
export const handleSearch: RequestHandler<
  {},
  any,
  {},
  { query?: string; page?: string }
> = async (req, res) => {
  const { query, page } = req.query;

  if (!query) {
    res.status(400).json({ message: "Missing 'query' parameter" });
    return;
  }

  try {
    const results = await searchImages(query, Number(page) || 1);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to search Unsplash" });
  }
};

// GET /api/unsplash/image/:id
export const handleGetImage: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  const { id } = req.params;

  if (!isValidUnsplashId(id)) {
    res.status(400).json({ message: "Invalid image ID format" });
    return;
  }
  try {
    const image = await getImageById(id);
    res.json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch image details" });
  }
};

// GET /api/unsplash/images
export const handleGetImages: RequestHandler<
  {},
  any,
  {},
  { page?: string; perPage?: string }
> = async (req, res) => {
  const { page, perPage } = req.query;

  try {
    const images = await getImages(Number(page) || 1, Number(perPage) || 10);
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch images" });
  }
};
