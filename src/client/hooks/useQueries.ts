import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  imagesQueryOptions,
  infiniteImagesQueryOptions,
  searchImagesQueryOptions,
  infiniteSearchQueryOptions,
  imageDetailsQueryOptions,
  imageCommentsQueryOptions,
  imageLikesQueryOptions,
  pinDetailsQueryOptions,
  pinsListQueryOptions,
} from "../lib/queryOptions";
import type {
  GetImagesParams,
  SearchImagesParams,
  UnsplashSearchResponse,
} from "../types/api";

// Hook for getting images list
export const useImages = (params: GetImagesParams = {}) => {
  return useQuery(imagesQueryOptions(params));
};

// Hook for infinite images scrolling
export const useInfiniteImages = (
  params: Omit<GetImagesParams, "page"> = {}
) => {
  return useInfiniteQuery(infiniteImagesQueryOptions(params));
};

// Hook for searching images
export const useSearchImages = (params: SearchImagesParams) => {
  return useQuery(searchImagesQueryOptions(params));
};

// Hook for infinite search scrolling
export const useInfiniteSearchImages = (
  params: Omit<SearchImagesParams, "page">
) => {
  return useInfiniteQuery(infiniteSearchQueryOptions(params));
};

// Hook for single image details
export const useImageDetails = (imageId: string) => {
  return useQuery(imageDetailsQueryOptions(imageId));
};

// Hook for image comments
export const useImageComments = (imageId: string) => {
  return useQuery(imageCommentsQueryOptions(imageId));
};

// Hook for image likes
export const useImageLikes = (imageId: string, userId?: number) => {
  return useQuery(imageLikesQueryOptions(imageId, userId));
};

// Hook for complete pin details (image + comments + likes)
export const usePinDetails = (imageId: string, userId?: number) => {
  return useQuery(pinDetailsQueryOptions(imageId, userId));
};

// Hook for pins list (transformed for UI)
export const usePinsList = (params: GetImagesParams = {}) => {
  return useQuery(pinsListQueryOptions(params));
};

// Custom hook with search functionality
export const useImageSearch = () => {
  return {
    // For regular paginated search
    searchImages: (params: SearchImagesParams) =>
      useQuery(searchImagesQueryOptions(params)),

    // For infinite scroll search
    searchImagesInfinite: (params: Omit<SearchImagesParams, "page">) =>
      useInfiniteQuery(infiniteSearchQueryOptions(params)),
  };
};

// Custom hook for gallery functionality
export const useGallery = (params: GetImagesParams = {}) => {
  const imagesQuery = useInfiniteImages(params);

  const loadMore = () => {
    if (imagesQuery.hasNextPage && !imagesQuery.isFetchingNextPage) {
      imagesQuery.fetchNextPage();
    }
  };

  const allImages = imagesQuery.data?.pages.flatMap((page) => page) || [];

  return {
    images: allImages,
    isLoading: imagesQuery.isLoading,
    isFetchingNextPage: imagesQuery.isFetchingNextPage,
    hasNextPage: imagesQuery.hasNextPage,
    loadMore,
    error: imagesQuery.error,
    refetch: imagesQuery.refetch,
  };
};

// Custom hook for search with debouncing
export const useSearchWithDebounce = (
  searchTerm: string,
  delay: number = 500
) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  const searchQuery = useInfiniteSearchImages({
    query: debouncedSearchTerm,
  });

  const allResults =
    searchQuery.data?.pages.flatMap(
      (page: UnsplashSearchResponse) => page.results
    ) || [];

  return {
    searchResults: allResults,
    isSearching: searchQuery.isLoading,
    isFetchingNextPage: searchQuery.isFetchingNextPage,
    hasNextPage: searchQuery.hasNextPage,
    loadMore: () => {
      if (searchQuery.hasNextPage && !searchQuery.isFetchingNextPage) {
        searchQuery.fetchNextPage();
      }
    },
    error: searchQuery.error,
    debouncedSearchTerm,
  };
};
