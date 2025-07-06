import React, { useState, useEffect } from "react";

interface UnsplashBlurImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  blurHash?: string;
  animationType?: "smooth" | "crossfade" | "progressive";
  onLoad?: () => void;
  onError?: () => void;
}

// Generate Unsplash thumbnail URL for blur placeholder
const getUnsplashBlurUrl = (originalUrl: string, width = 20, height = 20) => {
  try {
    const url = new URL(originalUrl);
    // If it's an Unsplash image, create a low-res version
    if (url.hostname.includes("unsplash.com")) {
      url.searchParams.set("w", width.toString());
      url.searchParams.set("h", height.toString());
      url.searchParams.set("q", "20"); // Low quality
      url.searchParams.set("blur", "2"); // Add blur
      return url.toString();
    }
  } catch (error) {
    console.warn("Invalid URL for blur generation:", originalUrl);
  }
  return null;
};

export const UnsplashBlurImage: React.FC<UnsplashBlurImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  blurHash,
  animationType = "crossfade",
  onLoad,
  onError,
}) => {
  const [imageState, setImageState] = useState<
    "loading" | "transitioning" | "loaded" | "error"
  >("loading");
  const [blurUrl, setBlurUrl] = useState<string | null>(null);

  useEffect(() => {
    // Generate blur URL
    const generatedBlurUrl = getUnsplashBlurUrl(src, 20, 20);
    setBlurUrl(generatedBlurUrl);

    // Preload the main image
    const img = new Image();
    img.onload = () => {
      // Start transition effect
      setImageState("transitioning");

      // Complete the transition after allowing it to start
      setTimeout(() => {
        setImageState("loaded");
        onLoad?.();
      }, 50); // Brief delay to ensure smooth transition
    };
    img.onerror = () => {
      setImageState("error");
      onError?.();
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad, onError]);

  const getAnimationClass = () => {
    switch (animationType) {
      case "crossfade":
        return "crossfade-reveal";
      case "progressive":
        return "progressive-reveal";
      case "smooth":
      default:
        return "smooth-image-reveal";
    }
  };

  const getTransitionDuration = () => {
    switch (animationType) {
      case "crossfade":
        return "duration-1000";
      case "progressive":
        return "duration-1200";
      case "smooth":
      default:
        return "duration-1000";
    }
  };

  const baseClasses = `transition-all ${getTransitionDuration()} ${className}`;

  if (imageState === "error") {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <svg
            className="mx-auto h-8 w-8 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Blur placeholder - enhanced crossfade transition */}
      {blurUrl && (
        <img
          src={blurUrl}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${
            imageState === "loaded"
              ? "opacity-0 blur-lg scale-110"
              : imageState === "transitioning"
                ? "opacity-40 blur-md scale-105"
                : "opacity-100 blur-sm scale-100"
          } ${className}`}
        />
      )}

      {/* Fallback skeleton if no blur URL */}
      {!blurUrl &&
        (imageState === "loading" || imageState === "transitioning") && (
          <div
            className={`absolute inset-0 skeleton-loading transition-opacity duration-800 ${
              imageState === "transitioning" ? "opacity-30" : "opacity-100"
            }`}
          />
        )}

      {/* Main image - smooth reveal with crossfade */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`relative z-10 w-full h-full object-cover ${getAnimationClass()} ${
          imageState === "loaded"
            ? "opacity-100 blur-0 scale-100"
            : imageState === "transitioning"
              ? "opacity-70 blur-xs scale-102"
              : "opacity-0 blur-sm scale-105"
        } ${className}`}
        loading="lazy"
      />
    </div>
  );
};

// Skeleton loader component for use while images are loading
export const ImageSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`skeleton-loading rounded-lg ${className}`}>
      <div className="animate-pulse">
        <div className="bg-gray-300 h-48 w-full rounded-lg"></div>
      </div>
    </div>
  );
};
