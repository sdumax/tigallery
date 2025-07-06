import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { HeartIcon } from "../svgIcons";
import { Button } from "./Button";
import { Avatar } from "./Avatar";
import { BlurHashImageWithCrossfade } from "./BlurHashImage";

interface PinCardProps {
  id: string;
  imageUrl: string;
  alt: string;
  title: string;
  author: string;
  blurHash?: string;
  isLiked?: boolean;
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
  onLikeToggle,
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleLikeToggle = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    onLikeToggle?.(id, newLikedState);
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
              variant={isLiked ? "primary" : "secondary"}
              size="sm"
              icon={
                <HeartIcon
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${isLiked ? "fill-current" : ""}`}
                />
              }
              className={`rounded-full shadow-lg text-xs sm:text-sm min-h-[36px] sm:min-h-auto ${isLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLikeToggle();
              }}>
              {isLiked ? "Liked" : "Like"}
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
    </div>
  );
};
