import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { HeartIcon } from "../svgIcons";
import { Button } from "./Button";
import { Avatar } from "./Avatar";
import { BlurHashImageWithCrossfade } from "./BlurHashImage";
import { useAuth } from "../../contexts/AuthContext";
import { useToggleLikeMutation } from "../../lib/mutations";
import { useAuthModal } from "../../hooks/useAuthModal";
import { useImageLikeStatus } from "../../hooks/useLikes";
import { AuthModal } from "../auth/AuthModal";

interface PinCardProps {
  id: string;
  imageUrl: string;
  alt: string;
  title: string;
  author: string;
  blurHash?: string;
  isLiked?: boolean;
  likesCount?: number;
  onLikeToggle?: (id: string, isLiked: boolean) => void;
}

export const PinCard: React.FC<PinCardProps> = ({
  id,
  imageUrl,
  alt,
  title,
  author,
  blurHash,
  isLiked: initialIsLiked = false,
  likesCount = 0,
  onLikeToggle,
}) => {
  const { user, isAuthenticated } = useAuth();
  const authModal = useAuthModal();
  const likeMutation = useToggleLikeMutation(id);

  // Get real-time like status for authenticated users
  const likeStatus = useImageLikeStatus(id);

  // Use real-time data if available, otherwise fall back to props
  const isLiked = isAuthenticated ? likeStatus.isLiked : initialIsLiked;
  const currentLikesCount =
    isAuthenticated && likeStatus.likesCount > 0
      ? likeStatus.likesCount
      : likesCount;

  // Local state for optimistic updates
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(isLiked);
  const [optimisticLikesCount, setOptimisticLikesCount] =
    useState(currentLikesCount);

  // Update local state when real data changes
  React.useEffect(() => {
    setOptimisticIsLiked(isLiked);
    setOptimisticLikesCount(currentLikesCount);
  }, [isLiked, currentLikesCount]);

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      authModal.openModal("login");
      return;
    }

    const newLikedState = !optimisticIsLiked;

    // Optimistically update UI
    setOptimisticIsLiked(newLikedState);
    setOptimisticLikesCount((prev: number) =>
      newLikedState ? prev + 1 : prev - 1
    );

    try {
      await likeMutation.mutate({
        userId: user.id,
        isCurrentlyLiked: optimisticIsLiked,
      });

      // Call the optional callback for parent component updates
      onLikeToggle?.(id, newLikedState);
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticIsLiked(!newLikedState);
      setOptimisticLikesCount((prev: number) =>
        newLikedState ? prev - 1 : prev + 1
      );
      console.error("Failed to toggle like:", error);
    }
  };
  return (
    <div className="pin-card bg-card group">
      <Link to="/pin/$pinId" params={{ pinId: id }} className="block">
        <div className="relative">
          <BlurHashImageWithCrossfade
            src={imageUrl}
            alt={alt}
            blurHash={blurHash}
            className="w-full transition-transform group-hover:scale-105"
          />
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Button
              variant={optimisticIsLiked ? "primary" : "secondary"}
              size="sm"
              disabled={likeMutation.isPending}
              icon={
                <HeartIcon
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${optimisticIsLiked ? "fill-current" : ""}`}
                />
              }
              className={`rounded-full shadow-lg text-xs sm:text-sm min-h-[36px] sm:min-h-auto ${optimisticIsLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
              onClick={handleLikeToggle}>
              {likeMutation.isPending
                ? "..."
                : optimisticLikesCount > 0
                  ? optimisticLikesCount.toLocaleString()
                  : optimisticIsLiked
                    ? "Liked"
                    : "Like"}
            </Button>
          </div>
        </div>
        <div className="p-3 sm:p-4">
          <h3
            className="font-bold group-hover:text-primary transition-colors truncate text-sm sm:text-base"
            title={title}>
            {title}
          </h3>
          <div className="author-info mt-2">
            <Avatar name={author} size="sm" className="flex-shrink-0" />
            <span
              className="text-text-secondary text-xs sm:text-sm truncate author-truncate"
              title={author}>
              {author}
            </span>
          </div>
        </div>
      </Link>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={authModal.closeModal}
        initialMode={authModal.mode}
      />
    </div>
  );
};
