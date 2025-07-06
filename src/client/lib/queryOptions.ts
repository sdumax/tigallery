import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { imageApi } from "../lib/api";
import type {
  UnsplashImage,
  UnsplashSearchResponse,
  Comment,
  LikesResponse,
  SearchImagesParams,
  GetImagesParams,
  Pin,
} from "../types/api";

// Transform Unsplash image to Pin format for UI consistency
const transformImageToPin = (
  image: UnsplashImage,
  isLiked = false,
  comments: Comment[] = []
): Pin => ({
  id: image.id,
  imageUrl: image.urls.regular,
  title: image.alt_description || image.description || "Untitled",
  description: image.description || image.alt_description || "",
  author: image.user.name || image.user.username,
  authorAvatar: image.user.profile_image.medium,
  tags: [], // Unsplash doesn't provide tags in this format, could be enhanced
  likes: image.likes,
  isLiked,
  comments,
  createdAt: new Date(image.created_at).toLocaleDateString(),
});

// Query Keys
export const queryKeys = {
  images: ["images"] as const,
  imagesList: (params: GetImagesParams) =>
    [...queryKeys.images, "list", params] as const,
  imagesSearch: (params: SearchImagesParams) =>
    [...queryKeys.images, "search", params] as const,
  imageDetails: (id: string) => [...queryKeys.images, "details", id] as const,
  imageComments: (id: string) => [...queryKeys.images, id, "comments"] as const,
  imageLikes: (id: string, userId?: number) =>
    [...queryKeys.images, id, "likes", userId] as const,
} as const;

// Images List Query Options
export const imagesQueryOptions = (params: GetImagesParams = {}) =>
  queryOptions({
    queryKey: queryKeys.imagesList(params),
    queryFn: () => imageApi.getImages(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

// Infinite Images Query Options (for pagination)
export const infiniteImagesQueryOptions = (
  params: Omit<GetImagesParams, "page"> = {}
) =>
  infiniteQueryOptions({
    queryKey: queryKeys.imagesList(params),
    queryFn: ({ pageParam = 1 }) =>
      imageApi.getImages({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Assuming each page returns 20 items by default
      return lastPage.length === (params.perPage || 20)
        ? allPages.length + 1
        : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// Search Images Query Options
export const searchImagesQueryOptions = (params: SearchImagesParams) =>
  queryOptions({
    queryKey: queryKeys.imagesSearch(params),
    queryFn: () => imageApi.searchImages(params),
    enabled: !!params.query && params.query.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// Infinite Search Query Options
export const infiniteSearchQueryOptions = (
  params: Omit<SearchImagesParams, "page">
) =>
  infiniteQueryOptions({
    queryKey: queryKeys.imagesSearch(params),
    queryFn: ({ pageParam = 1 }) =>
      imageApi.searchImages({ ...params, page: pageParam as number }),
    enabled: !!params.query && params.query.length > 0,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.results.length > 0 ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// Single Image Details Query Options
export const imageDetailsQueryOptions = (imageId: string) =>
  queryOptions({
    queryKey: queryKeys.imageDetails(imageId),
    queryFn: () => imageApi.getImageDetails(imageId),
    enabled: !!imageId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

// Image Comments Query Options
export const imageCommentsQueryOptions = (imageId: string) =>
  queryOptions({
    queryKey: queryKeys.imageComments(imageId),
    queryFn: () => imageApi.getComments(imageId),
    enabled: !!imageId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

// Image Likes Query Options
export const imageLikesQueryOptions = (imageId: string, userId?: number) =>
  queryOptions({
    queryKey: queryKeys.imageLikes(imageId, userId),
    queryFn: () => imageApi.getLikes(imageId, userId),
    enabled: !!imageId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

// Combined Pin Query Options (with comments and likes)
export const pinDetailsQueryOptions = (imageId: string, userId?: number) =>
  queryOptions({
    queryKey: [...queryKeys.imageDetails(imageId), "full", userId],
    queryFn: async (): Promise<Pin> => {
      const [imageDetails, comments, likes] = await Promise.all([
        imageApi.getImageDetails(imageId),
        imageApi.getComments(imageId),
        imageApi.getLikes(imageId, userId),
      ]);

      return transformImageToPin(imageDetails, likes.isLiked, comments);
    },
    enabled: !!imageId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

// Transform images list to pins for consistent UI
export const pinsListQueryOptions = (params: GetImagesParams = {}) =>
  queryOptions({
    queryKey: [...queryKeys.imagesList(params), "pins"],
    queryFn: async (): Promise<Pin[]> => {
      const images = await imageApi.getImages(params);
      return images.map((image) => transformImageToPin(image));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
