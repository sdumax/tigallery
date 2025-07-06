import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { HeartIcon } from "../svgIcons";
import { Button } from "./Button";
import { Avatar } from "./Avatar";
import { UnsplashBlurImage } from "./UnsplashBlurImage";

interface PinCardProps {
  id: string;
  imageUrl: string;
  alt: string;
  title: string;
  author: string;
  isLiked?: boolean;
  onLikeToggle?: (id: string, isLiked: boolean) => void;
}

export const PinCard: React.FC<PinCardProps> = ({
  id,
  imageUrl,
  alt,
  title,
  author,
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
          <UnsplashBlurImage
            src={imageUrl}
            alt={alt}
            animationType="crossfade"
            className="w-full transition-transform group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant={isLiked ? "primary" : "secondary"}
              size="sm"
              icon={
                <HeartIcon
                  className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                />
              }
              className={`rounded-full shadow-lg ${isLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLikeToggle();
              }}>
              {isLiked ? "Liked" : "Like"}
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3
            className="font-bold group-hover:text-primary transition-colors truncate"
            title={title}>
            {title}
          </h3>
          <div className="author-info">
            <Avatar name={author} size="sm" className="flex-shrink-0" />
            <span
              className="text-text-secondary text-sm truncate author-truncate"
              title={author}>
              {author}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
