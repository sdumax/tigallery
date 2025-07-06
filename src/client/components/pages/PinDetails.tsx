import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BackIcon, HeartIcon, CommentIcon, ShareIcon } from "../svgIcons";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Tag } from "../ui/Tag";
import { UnsplashBlurImage } from "../ui/UnsplashBlurImage";
import { PinDetailsLoading } from "../ui/LoadingComponents";
import { pinDetailsQueryOptions } from "../../lib/queryOptions";

interface PinDetailsProps {
  pinId: string;
}

export const PinDetails: React.FC<PinDetailsProps> = ({ pinId }) => {
  // TODO: Get real userId from auth system
  const userId = 1; // Mock user ID for now

  // Fetch pin details with comments and likes
  const {
    data: pin,
    isLoading,
    error,
  } = useQuery(pinDetailsQueryOptions(pinId, userId));

  // Debug logging
  React.useEffect(() => {
    console.log("PinDetails - pinId:", pinId);
    console.log("PinDetails - pin data:", pin);
    console.log("PinDetails - isLoading:", isLoading);
    console.log("PinDetails - error:", error);
  }, [pinId, pin, isLoading, error]);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Update local state when data loads
  React.useEffect(() => {
    if (pin) {
      setIsLiked(pin.isLiked);
      setLikesCount(pin.likes);
    }
  }, [pin]);

  const handleLikeToggle = async () => {
    // TODO: Implement real like/unlike functionality
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1));
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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-card">
            <UnsplashBlurImage
              src={pin.imageUrl}
              alt={pin.title}
              animationType="progressive"
              className="w-full h-auto object-cover"
            />
            {/* Like Button Overlay */}
            <div className="absolute top-4 right-4">
              <Button
                variant={isLiked ? "primary" : "secondary"}
                size="md"
                icon={
                  <HeartIcon
                    className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                  />
                }
                className={`rounded-full shadow-lg ${isLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
                onClick={handleLikeToggle}>
                {isLiked ? "Liked" : "Like"}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                icon={
                  <HeartIcon
                    className={`h-5 w-5 ${isLiked ? "fill-current text-red-500" : ""}`}
                  />
                }
                className="text-text-secondary hover:text-primary"
                onClick={handleLikeToggle}>
                {likesCount}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<CommentIcon className="h-5 w-5" />}
                className="text-text-secondary hover:text-primary">
                {pin.comments.length}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<ShareIcon className="h-5 w-5" />}
                className="text-text-secondary hover:text-primary">
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          {/* Pin Info */}
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-4 truncate w-1/2">
              {pin.title}
            </h1>
            <p className="text-text-secondary leading-relaxed">
              {pin.description}
            </p>
          </div>

          {/* Author Info */}
          <div className="flex items-center space-x-4 p-4 bg-card rounded-lg">
            <Avatar src={pin.authorAvatar} name={pin.author} size="lg" />
            <div>
              <h3 className="font-semibold text-text-primary">{pin.author}</h3>
              <p className="text-sm text-text-secondary">
                Posted {pin.createdAt}
              </p>
            </div>
            <div className="ml-auto">
              <Button variant="primary" size="sm">
                Follow
              </Button>
            </div>
          </div>

          {/* Tags */}
          {pin.tags && pin.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-text-primary mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {pin.tags.map((tag, index) => (
                  <Tag
                    key={index}
                    variant="default"
                    clickable
                    onClick={() => console.log(`Clicked tag: ${tag}`)}>
                    #{tag}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">
              Comments ({pin.comments.length})
            </h3>

            {/* Add Comment */}
            <div className="mb-6">
              <div className="flex space-x-3">
                <Avatar name="User" size="sm" />
                <div className="flex-1">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full p-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button variant="primary" size="sm">
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {pin.comments && pin.comments.length > 0 ? (
                pin.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar
                      name={`User ${comment.userId || "Anonymous"}`}
                      size="sm"
                    />
                    <div className="flex-1">
                      <div className="bg-card rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-text-primary text-sm">
                            {comment.userId
                              ? `User ${comment.userId}`
                              : "Anonymous"}
                          </h4>
                          <span className="text-xs text-text-tertiary">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-text-secondary text-sm">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
