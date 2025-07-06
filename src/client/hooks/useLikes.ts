import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { imageLikesQueryOptions } from "../lib/queryOptions";

/**
 * Hook to get like status for a specific image for the current user
 */
export const useImageLikeStatus = (imageId: string) => {
  const { user, isAuthenticated } = useAuth();

  const likeQuery = useQuery({
    ...imageLikesQueryOptions(imageId, user?.id),
    enabled: !!imageId && isAuthenticated && !!user,
  });

  return {
    isLiked: likeQuery.data?.isLiked || false,
    likesCount: likeQuery.data?.count || 0,
    isLoading: likeQuery.isLoading,
    error: likeQuery.error,
  };
};

/**
 * Hook to get like status for multiple images (for grid views)
 * This will only fetch if user is authenticated
 */
export const useMultipleImageLikes = (imageIds: string[]) => {
  const { user, isAuthenticated } = useAuth();

  const queries = imageIds.map((imageId) => ({
    ...imageLikesQueryOptions(imageId, user?.id),
    enabled: !!imageId && isAuthenticated && !!user,
  }));

  // For now, we'll just return empty data for performance
  // In a real app, you'd want to batch these requests
  return imageIds.reduce(
    (acc, imageId) => {
      acc[imageId] = {
        isLiked: false,
        likesCount: 0,
        isLoading: false,
        error: null,
      };
      return acc;
    },
    {} as Record<
      string,
      { isLiked: boolean; likesCount: number; isLoading: boolean; error: any }
    >
  );
};
