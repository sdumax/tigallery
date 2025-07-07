import { useOptimistic } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAuthModal } from "../contexts/AuthModalContext";
import { useToggleLikeMutation } from "../lib/mutations";
import { useImageLikeStatus } from "./useLikes";

interface UseImageLikeHandlerProps {
  imageId: string;
  initialIsLiked?: boolean;
  initialLikesCount?: number;
  onLikeToggle?: (id: string, isLiked: boolean) => void;
}

interface LikeState {
  isLiked: boolean;
  likesCount: number;
}

export function useImageLikeHandler({
  imageId,
  initialIsLiked = false,
  initialLikesCount = 0,
  onLikeToggle,
}: UseImageLikeHandlerProps) {
  const { user, isAuthenticated } = useAuth();
  const authModal = useAuthModal();
  const likeMutation = useToggleLikeMutation(imageId);

  // Get real-time like status for authenticated users
  const { isLiked: actualIsLiked, likesCount: actualLikesCount } =
    useImageLikeStatus(imageId);

  // Use real-time data if available, otherwise fall back to props

  const [optimisticState, addOptimisticUpdate] = useOptimistic(
    { isLiked: actualIsLiked, likesCount: Number(initialLikesCount + actualLikesCount) },
    (_, newState: LikeState): LikeState => ({
      isLiked: newState.isLiked,
      likesCount: newState.likesCount,
    })
  );

  const handleLikeToggle = async () => {
    if (!isAuthenticated || !user) {
      authModal.openModal("login");
      return;
    }

    // Optimistically update UI
    addOptimisticUpdate({
      isLiked: !optimisticState.isLiked,
      likesCount: !optimisticState.isLiked
        ? optimisticState.likesCount + 1
        : Math.max(optimisticState.likesCount - 1, 0),
    });

    try {
    await likeMutation.mutate({
        userId: user.id,
        isCurrentlyLiked: actualIsLiked,
      });

      // Call the optional callback for parent component updates
      onLikeToggle?.(imageId, !optimisticState.isLiked);
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // React 19's useOptimistic automatically reverts on error
    }
  };

  console.log("Final optimistic state:", optimisticState);

  return {
    isLiked: optimisticState.isLiked,
    likesCount: optimisticState.likesCount,
    handleLikeToggle,
    isPending: likeMutation.isPending,
  };
}
