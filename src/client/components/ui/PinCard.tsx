import React from "react";
import { Link } from "@tanstack/react-router";
import { HeartIcon } from "../svgIcons";
import { Button } from "./Button";
import { Avatar } from "./Avatar";
import { BlurHashImageWithCrossfade } from "./BlurHashImage";
import { useImageLikeHandler } from "../../hooks/useImageLikeHandler";

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
  const {
    isLiked,
    likesCount: currentLikesCount,
    handleLikeToggle,
    isPending,
  } = useImageLikeHandler({
    imageId: id,
    initialIsLiked,
    initialLikesCount: likesCount,
    onLikeToggle,
  });

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleLikeToggle();
  };

  return (
    <div className="pin-card bg-card group">
      <PinCardLink id={id}>
        <PinCardImage
          imageUrl={imageUrl}
          alt={alt}
          blurHash={blurHash}
          isLiked={isLiked}
          likesCount={currentLikesCount}
          isPending={isPending}
          onLikeToggle={handleLikeClick}
        />
        <PinCardContent title={title} author={author} />
      </PinCardLink>
    </div>
  );
};

const PinCardLink: React.FC<{ id: string; children: React.ReactNode }> = ({
  id,
  children,
}) => (
  <Link to="/pin/$pinId" params={{ pinId: id }} className="block">
    {children}
  </Link>
);

const PinCardImage: React.FC<{
  imageUrl: string;
  alt: string;
  blurHash?: string;
  isLiked: boolean;
  likesCount: number;
  isPending: boolean;
  onLikeToggle: (e: React.MouseEvent) => void;
}> = ({
  imageUrl,
  alt,
  blurHash,
  isLiked,
  likesCount,
  isPending,
  onLikeToggle,
}) => (
  <div className="relative">
    <BlurHashImageWithCrossfade
      src={imageUrl}
      alt={alt}
      blurHash={blurHash}
      className="w-full transition-transform group-hover:scale-105"
    />
    <PinCardLikeButton
      isLiked={isLiked}
      likesCount={likesCount}
      isPending={isPending}
      onLikeToggle={onLikeToggle}
    />
  </div>
);

// Component: PinCardLikeButton - Should go in /src/client/components/ui/PinCard/PinCardLikeButton.tsx
const PinCardLikeButton: React.FC<{
  isLiked: boolean;
  likesCount: number;
  isPending: boolean;
  onLikeToggle: (e: React.MouseEvent) => void;
}> = ({ isLiked, likesCount, isPending, onLikeToggle }) => (
  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
    <Button
      variant={isLiked ? "primary" : "secondary"}
      size="sm"
      disabled={isPending}
      icon={
        <HeartIcon
          className={`h-3 w-3 sm:h-4 sm:w-4 ${isLiked ? "fill-current" : ""}`}
        />
      }
      className={`rounded-full shadow-lg text-xs sm:text-sm min-h-[36px] sm:min-h-auto ${isLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
      onClick={onLikeToggle}>
      {isPending ? "..." : isLiked ? likesCount + 1 : likesCount}
    </Button>
  </div>
);

// Component: PinCardContent - Should go in /src/client/components/ui/PinCard/PinCardContent.tsx
const PinCardContent: React.FC<{
  title: string;
  author: string;
}> = ({ title, author }) => (
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
);
