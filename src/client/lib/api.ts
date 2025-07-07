import axios from "axios";
import type {
  UnsplashImage,
  UnsplashSearchResponse,
  Comment,
  LikesResponse,
  SearchImagesParams,
  GetImagesParams,
  CreateCommentData,
  LikeImageData,
} from "../types/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(
        `Making ${config.method?.toUpperCase()} request to ${config.url}`
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Image API methods
export const imageApi = {
  // Get all images with pagination
  getImages: async (params: GetImagesParams = {}): Promise<UnsplashImage[]> => {
    const { page = 1, perPage = 20 } = params;
    const response = await api.get(`/images`, {
      params: { page, perPage },
    });
    return response.data;
  },

  // Search images
  searchImages: async (
    params: SearchImagesParams
  ): Promise<UnsplashSearchResponse> => {
    const { query, page = 1 } = params;
    const response = await api.get(`/images/search`, {
      params: { query, page },
    });
    return response.data;
  },

  // Get single image details
  getImageDetails: async (imageId: string): Promise<UnsplashImage> => {
    const response = await api.get(`/images/${imageId}/details`);
    return response.data;
  },

  // Get comments for an image
  getComments: async (imageId: string): Promise<Comment[]> => {
    const response = await api.get(`/images/${imageId}/comments`);
    return response.data;
  },

  // Add comment to an image
  addComment: async (
    imageId: string,
    data: CreateCommentData
  ): Promise<Comment> => {
    const response = await api.post(`/images/${imageId}/comments`, data);
    return response.data;
  },

  // Delete comment from an image
  deleteComment: async (imageId: string, commentId: number): Promise<void> => {
    await api.delete(`/images/${imageId}/comments/${commentId}`);
  },

  // Get likes for an image
  getLikes: async (
    imageId: string,
    userId?: number
  ): Promise<LikesResponse> => {
    const response = await api.get(`/images/${imageId}/likes`, {
      params: userId ? { userId } : {},
    });
    return response.data;
  },

  // Like an image
  likeImage: async (imageId: string, data: LikeImageData): Promise<void> => {
    await api.post(`/images/${imageId}/like`, data);
  },

  // Unlike an image
  unlikeImage: async (imageId: string, userId: number): Promise<void> => {
    await api.delete(`/images/${imageId}/like`, {
      data: { userId },
    });
  },
};

export default api;
