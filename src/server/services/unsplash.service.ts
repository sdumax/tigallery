import axios from "axios";
import { logError } from "../utils/errorHandling.js";

const UNSPLASH_API = "https://api.unsplash.com";
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!ACCESS_KEY) {
  throw new Error("Missing UNSPLASH_ACCESS_KEY in .env");
}

const unsplash = axios.create({
  baseURL: UNSPLASH_API,
  headers: {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  },
});

const UNSPLASH_ENDPOINTS = {
  search: "/search/photos",
  imageDetails: (id: string) => `/photos/${id}`,
  images: "/photos",
  likes: (id: string) => `/photos/${id}/like`,
};

export const searchImages = async (query: string, page = 1, perPage = 10) => {
  try {
    const response = await unsplash.get("/search/photos", {
      params: { query, page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    logError("searchImages", error, { query, page, perPage });
    throw error;
  }
};

export const getImageById = async (id: string) => {
  try {
    const response = await unsplash.get(`/photos/${id}`);
    return response.data;
  } catch (error) {
    logError("getImageById", error, { imageId: id });
    throw error;
  }
};

export const getImages = async (page = 1, perPage = 10) => {
  try {
    const response = await unsplash.get(UNSPLASH_ENDPOINTS.images, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    logError("getImages", error, { page, perPage });
    throw error;
  }
};

export const likeUnsplashImage = async (imageId: string) => {
  try {
    const response = await unsplash.post(UNSPLASH_ENDPOINTS.likes(imageId));
    return response.data;
  } catch (error) {
    logError("likeUnsplashImage", error, { imageId });
    throw error;
  }
};

export const unlikeUnsplashImage = async (imageId: string) => {
  try {
    const response = await unsplash.delete(UNSPLASH_ENDPOINTS.likes(imageId));
    return response.data;
  } catch (error) {
    logError("unlikeUnsplashImage", error, { imageId });
    throw error;
  }
};
