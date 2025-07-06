import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BackIcon, HeartIcon, CommentIcon, ShareIcon } from "../svgIcons";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Tag } from "../ui/Tag";
import { BlurHashImageWithCrossfade } from "../ui/BlurHashImage";
import { PinDetailsLoading } from "../ui/LoadingComponents";
import { pinDetailsQueryOptions } from "../../lib/queryOptions";
import { useAuth } from "../../contexts/AuthContext";
import {
  useToggleLikeMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from "../../lib/mutations";
import { AuthModal } from "../auth/AuthModal";
import { useAuthModal } from "../../hooks/useAuthModal";
import { formatRelativeTime, validateComment } from "../../utils/commentUtils";
import { useImageLikeStatus } from "../../hooks/useLikes";

interface PinDetailsProps {
  pinId: string;
}

export const PinDetails: React.FC<PinDetailsProps> = ({ pinId }) => {
  const { user, isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const authModal = useAuthModal();

  // Fetch pin details with comments and likes
  const {
    data: pin,
    isLoading,
    error,
  } = useQuery(pinDetailsQueryOptions(pinId, user?.id));

  // Mutations
  const likeMutation = useToggleLikeMutation(pinId);
  const commentMutation = useAddCommentMutation(pinId);
  const deleteCommentMutation = useDeleteCommentMutation(pinId);

  // Get real-time like status for authenticated users
  const likeStatus = useImageLikeStatus(pinId);

  // Use real-time data if available, otherwise fall back to pin data
  const isLiked = pin?.isLiked || likeStatus.isLiked;
  const likesCount = pin?.likes || likeStatus.likesCount || 0;

  // Local state for optimistic updates
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(isLiked);
  const [optimisticLikesCount, setOptimisticLikesCount] = useState(likesCount);

  // Update local state when real data changes
  React.useEffect(() => {
    setOptimisticIsLiked(isLiked);
    setOptimisticLikesCount(likesCount);
  }, [isLiked, likesCount]);

  const handleLikeToggle = async () => {
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
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticIsLiked(!newLikedState);
      setOptimisticLikesCount((prev: number) =>
        newLikedState ? prev - 1 : prev + 1
      );
      console.error("Failed to toggle like:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!isAuthenticated || !user) {
      authModal.openModal("login");
      return;
    }

    // Validate comment
    const validation = validateComment(commentText);
    if (!validation.isValid) {
      setCommentError(validation.error || "Invalid comment");
      return;
    }

    setCommentError(null);

    try {
      await commentMutation.mutate({
        userId: user.id,
        content: commentText.trim(),
      });
      setCommentText("");
    } catch (error: any) {
      console.error("Failed to add comment:", error);
      setCommentError(
        error.response?.data?.message || "Failed to post comment"
      );
    }
  };

  const handleCommentTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentText(e.target.value);
    if (commentError) {
      setCommentError(null); // Clear error when user starts typing
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!isAuthenticated || !user) return;

    // Simple confirmation dialog
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteCommentMutation.mutate(commentId);
    } catch (error: any) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            icon={<BackIcon className="h-5 w-5" />}
            onClick={() => window.history.back()}
            className="text-text-secondary hover:text-text-primary">
            Back to Gallery
          </Button>
        </div>
        <PinDetailsLoading />
      </>
    );
  }

  if (error || !pin) {
    return (
      <>
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            icon={<BackIcon className="h-5 w-5" />}
            onClick={() => window.history.back()}
            className="text-text-secondary hover:text-text-primary">
            Back to Gallery
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-text-secondary mb-4">
            {error
              ? `Error loading pin details: ${error instanceof Error ? error.message : "Unknown error"}`
              : "Pin not found"}
          </p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}>
            Return to Gallery
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Back Button */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          icon={<BackIcon className="h-5 w-5" />}
          onClick={() => window.history.back()}
          className="text-text-secondary hover:text-text-primary">
          Back to Gallery
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Image Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-card">
            <BlurHashImageWithCrossfade
              src={pin.imageUrl}
              alt={pin.title}
              blurHash={pin.blurHash}
              className="w-full h-auto object-cover"
            />
            {/* Like Button Overlay */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
              <Button
                variant={optimisticIsLiked ? "primary" : "secondary"}
                size="md"
                icon={
                  <HeartIcon
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${optimisticIsLiked ? "fill-current" : ""}`}
                  />
                }
                className={`rounded-full shadow-lg text-sm sm:text-base min-h-[44px] ${optimisticIsLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
                onClick={handleLikeToggle}>
                {optimisticIsLiked ? "Liked" : "Like"}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between px-2 sm:px-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                icon={
                  <HeartIcon
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${optimisticIsLiked ? "fill-current text-red-500" : ""}`}
                  />
                }
                className="text-text-secondary hover:text-primary text-sm sm:text-base min-h-[44px] sm:min-h-auto"
                onClick={handleLikeToggle}>
                {optimisticLikesCount}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<CommentIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                className="text-text-secondary hover:text-primary text-sm sm:text-base min-h-[44px] sm:min-h-auto">
                {pin.comments.length}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<ShareIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                className="text-text-secondary hover:text-primary text-sm sm:text-base min-h-[44px] sm:min-h-auto">
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* Pin Info */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary mb-3 sm:mb-4">
              {pin.title}
            </h1>
            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
              {pin.description}
            </p>
          </div>

          {/* Author Info */}
          <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-card rounded-lg">
            <Avatar src={pin.authorAvatar} name={pin.author} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary text-sm sm:text-base truncate">
                {pin.author}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">
                Posted {pin.createdAt}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button
                variant="primary"
                size="sm"
                className="min-h-[44px] sm:min-h-auto text-sm">
                Follow
              </Button>
            </div>
          </div>

          {/* Tags */}
          {pin.tags && pin.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-text-primary mb-2 sm:mb-3 text-sm sm:text-base">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {pin.tags.map((tag, index) => (
                  <Tag
                    key={index}
                    variant="default"
                    clickable
                    className="text-xs sm:text-sm">
                    #{tag}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div>
            <h3 className="font-semibold text-text-primary mb-3 sm:mb-4 text-sm sm:text-base">
              Comments ({pin.comments.length})
            </h3>

            {/* Add Comment */}
            <div className="mb-4 sm:mb-6">
              {isAuthenticated ? (
                <div className="flex space-x-2 sm:space-x-3">
                  <Avatar name={user?.username || "User"} size="sm" />
                  <div className="flex-1">
                    <textarea
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={handleCommentTextChange}
                      className={`w-full p-3 bg-card border rounded-lg focus:outline-none resize-none text-sm sm:text-base min-h-[88px] ${
                        commentError
                          ? "border-red-500 focus:border-red-500"
                          : "border-border focus:border-primary"
                      }`}
                      rows={3}
                      maxLength={500}
                    />

                    {/* Error message and character count */}
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex-1">
                        {commentError && (
                          <p className="text-red-500 text-xs">{commentError}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`text-xs ${
                            commentText.length > 450
                              ? "text-red-500"
                              : "text-text-tertiary"
                          }`}>
                          {commentText.length}/500
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={
                            !commentText.trim() ||
                            commentMutation.isPending ||
                            !validateComment(commentText).isValid
                          }
                          onClick={handleCommentSubmit}
                          className="min-h-[44px] sm:min-h-auto text-sm">
                          {commentMutation.isPending
                            ? "Posting..."
                            : "Post Comment"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 bg-card rounded-lg border border-border">
                  <p className="text-text-secondary mb-3 text-sm">
                    Sign in to add a comment
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => authModal.openModal("login")}
                    className="min-h-[44px] sm:min-h-auto">
                    Sign In
                  </Button>
                </div>
              )}
            </div>

            {/* Comments List */}
            <div className="space-y-3 sm:space-y-4">
              {pin.comments && pin.comments.length > 0 ? (
                pin.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-2 sm:space-x-3">
                    <Avatar
                      name={comment.user?.username || "Anonymous"}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="bg-card rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-text-primary text-xs sm:text-sm truncate">
                            {comment.user?.username || "Anonymous"}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-text-tertiary flex-shrink-0">
                              {formatRelativeTime(comment.createdAt)}
                            </span>
                            {/* Delete button - only show for comment owner */}
                            {isAuthenticated &&
                              user &&
                              comment.userId === user.id && (
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                  disabled={deleteCommentMutation.isPending}
                                  className="text-text-tertiary hover:text-red-500 transition-colors p-1 rounded min-h-[32px] min-w-[32px] flex items-center justify-center"
                                  title="Delete comment">
                                  <span className="text-xs">✕</span>
                                </button>
                              )}
                          </div>
                        </div>
                        <p className="text-text-secondary text-xs sm:text-sm">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-text-secondary text-sm sm:text-base">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={authModal.closeModal}
        initialMode={authModal.mode}
      />
    </>
  );
};
