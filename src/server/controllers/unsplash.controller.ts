import { RequestHandler } from "express";
import {
  searchImages,
  getImageById,
  getImages,
} from "../services/unsplash.service.js";
import { isValidUnsplashId } from "../utils/index.js";
import {
  sendValidationError,
  sendSuccessResponse,
  handleExternalApiError,
} from "../utils/errorHandling.js";

// GET /api/unsplash/search?query=cat&page=1
export const handleSearch: RequestHandler<
  {},
  any,
  {},
  { query?: string; page?: string }
> = async (req, res) => {
  const { query, page } = req.query;

  if (!query || query.trim().length === 0) {
    sendValidationError(
      res,
      "Search query is required and cannot be empty",
      "query"
    );
    return;
  }

  if (query.length > 200) {
    sendValidationError(
      res,
      "Search query must be less than 200 characters",
      "query"
    );
    return;
  }

  const pageNum = Number(page) || 1;
  if (pageNum < 1 || pageNum > 1000) {
    sendValidationError(res, "Page number must be between 1 and 1000", "page");
    return;
  }

  try {
    const results = await searchImages(query.trim(), pageNum);
    sendSuccessResponse(res, results, "Images retrieved successfully");
  } catch (error) {
    handleExternalApiError(res, "handleSearch", error, "Unsplash");
  }
};

// GET /api/unsplash/image/:id
export const handleGetImage: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  const { id } = req.params;

  if (!id || !isValidUnsplashId(id)) {
    sendValidationError(res, "Valid image ID is required", "id");
    return;
  }

  try {
    const image = await getImageById(id);
    sendSuccessResponse(res, image, "Image details retrieved successfully");
  } catch (error) {
    handleExternalApiError(res, "handleGetImage", error, "Unsplash");
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

  const pageNum = Number(page) || 1;
  const perPageNum = Number(perPage) || 10;

  if (pageNum < 1 || pageNum > 1000) {
    sendValidationError(res, "Page number must be between 1 and 1000", "page");
    return;
  }

  if (perPageNum < 1 || perPageNum > 50) {
    sendValidationError(
      res,
      "Items per page must be between 1 and 50",
      "perPage"
    );
    return;
  }

  try {
    const images = await getImages(pageNum, perPageNum);
    sendSuccessResponse(res, images, "Images retrieved successfully");
  } catch (error) {
    handleExternalApiError(res, "handleGetImages", error, "Unsplash");
  }
};

// POST
