import { useMutation, useQueryClient } from "@tanstack/react-query";
import { imageApi } from "../lib/api";
import { queryKeys } from "./queryOptions";
import type { CreateCommentData, LikeImageData } from "../types/api";

// Like Image Mutation
export const useLikeImageMutation = (imageId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LikeImageData) => imageApi.likeImage(imageId, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch likes
      queryClient.invalidateQueries({
        queryKey: queryKeys.imageLikes(imageId, variables.userId),
      });

      // Invalidate image details to update like count
      queryClient.invalidateQueries({
        queryKey: queryKeys.imageDetails(imageId),
      });

      // Update like status optimistically
      queryClient.setQueryData(
        queryKeys.imageLikes(imageId, variables.userId),
        (oldData: any) => ({
          ...oldData,
          isLiked: true,
          count: (oldData?.count || 0) + 1,
        })
      );
    },
    onError: (error) => {
      console.error("Failed to like image:", error);
    },
  });
};

// Unlike Image Mutation
export const useUnlikeImageMutation = (imageId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => imageApi.unlikeImage(imageId, userId),
    onSuccess: (_, userId) => {
      // Invalidate and refetch likes
      queryClient.invalidateQueries({
        queryKey: queryKeys.imageLikes(imageId, userId),
      });

      // Invalidate image details to update like count
      queryClient.invalidateQueries({
        queryKey: queryKeys.imageDetails(imageId),
      });

      // Update like status optimistically
      queryClient.setQueryData(
        queryKeys.imageLikes(imageId, userId),
        (oldData: any) => ({
          ...oldData,
          isLiked: false,
          count: Math.max((oldData?.count || 1) - 1, 0),
        })
      );
    },
    onError: (error) => {
      console.error("Failed to unlike image:", error);
    },
  });
};

// Toggle Like Mutation (combines like/unlike)
export const useToggleLikeMutation = (imageId: string) => {
  const likeImageMutation = useLikeImageMutation(imageId);
  const unlikeImageMutation = useUnlikeImageMutation(imageId);

  return {
    mutate: (data: { userId: number; isCurrentlyLiked: boolean }) => {
      if (data.isCurrentlyLiked) {
        unlikeImageMutation.mutate(data.userId);
      } else {
        likeImageMutation.mutate({ userId: data.userId });
      }
    },
    isPending: likeImageMutation.isPending || unlikeImageMutation.isPending,
    error: likeImageMutation.error || unlikeImageMutation.error,
  };
};

// Add Comment Mutation
export const useAddCommentMutation = (imageId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) => imageApi.addComment(imageId, data),
    onSuccess: (newComment) => {
      // Add the new comment to the existing comments
      queryClient.setQueryData(
        queryKeys.imageComments(imageId),
        (oldComments: any[] = []) => [newComment, ...oldComments]
      );

      // Invalidate pin details if it exists
      queryClient.invalidateQueries({
        queryKey: queryKeys.imageDetails(imageId),
      });
    },
    onError: (error) => {
      console.error("Failed to add comment:", error);
    },
  });
};

// Delete Comment Mutation
export const useDeleteCommentMutation = (imageId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) =>
      imageApi.deleteComment(imageId, commentId),
    onSuccess: (_, commentId) => {
      // Remove the comment from the existing comments
      queryClient.setQueryData(
        queryKeys.imageComments(imageId),
        (oldComments: any[] = []) =>
          oldComments.filter((comment) => comment.id !== commentId)
      );

      // Invalidate pin details if it exists
      queryClient.invalidateQueries({
        queryKey: queryKeys.imageDetails(imageId),
      });
    },
    onError: (error) => {
      console.error("Failed to delete comment:", error);
    },
  });
};

// Custom hook for combined like/unlike functionality with optimistic updates
export const useLikeToggle = (imageId: string, userId: number) => {
  const queryClient = useQueryClient();

  const toggleLikeMutation = useMutation({
    mutationFn: async ({ isCurrentlyLiked }: { isCurrentlyLiked: boolean }) => {
      if (isCurrentlyLiked) {
        await imageApi.unlikeImage(imageId, userId);
        return false;
      } else {
        await imageApi.likeImage(imageId, { userId });
        return true;
      }
    },
    onMutate: async ({ isCurrentlyLiked }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.imageLikes(imageId, userId),
      });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData(
        queryKeys.imageLikes(imageId, userId)
      );

      // Optimistically update to the new value
      queryClient.setQueryData(
        queryKeys.imageLikes(imageId, userId),
        (old: any) => ({
          ...old,
          isLiked: !isCurrentlyLiked,
          count: isCurrentlyLiked
            ? Math.max((old?.count || 1) - 1, 0)
            : (old?.count || 0) + 1,
        })
      );

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(
        queryKeys.imageLikes(imageId, userId),
        context?.previousLikes
      );
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: queryKeys.imageLikes(imageId, userId),
      });
    },
  });

  return toggleLikeMutation;
};
