import React from "react";
import { Blurhash } from "react-blurhash";
import { useBlurHashImage } from "../../hooks/useBlurHashImage";

interface BlurHashImageProps {
  src: string;
  alt: string;
  blurHash?: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export const BlurHashImage: React.FC<BlurHashImageProps> = ({
  src,
  alt,
  blurHash,
  className = "",
  width,
  height,
  onLoad,
  onError,
}) => {
  const { isLoaded: imageLoaded, hasError: imageError } = useBlurHashImage({
    src,
    onLoad,
    onError,
  });

  if (imageError) {
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
    <div className={`relative overflow-hidden ${className}`}>
      {/* BlurHash placeholder */}
      {blurHash && !imageLoaded && (
        <div className="absolute inset-0">
          <Blurhash
            hash={blurHash}
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Fallback skeleton if no blur hash */}
      {!blurHash && !imageLoaded && (
        <div className="absolute inset-0 skeleton-loading" />
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`relative z-10 w-full h-full object-cover transition-opacity duration-700 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
      />
    </div>
  );
};

// Enhanced version with crossfade animation
export const BlurHashImageWithCrossfade: React.FC<BlurHashImageProps> = ({
  src,
  alt,
  blurHash,
  className = "",
  width,
  height,
  onLoad,
  onError,
}) => {
  const {
    isLoaded: imageLoaded,
    hasError: imageError,
    showTransition,
  } = useBlurHashImage({
    src,
    onLoad,
    onError,
  });

  if (imageError) {
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
    <div className={`relative overflow-hidden ${className}`}>
      {/* BlurHash placeholder with crossfade */}
      {blurHash && (
        <div
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            imageLoaded ? "opacity-0 scale-110" : "opacity-100 scale-100"
          }`}>
          <Blurhash
            hash={blurHash}
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Fallback skeleton if no blur hash */}
      {!blurHash && (
        <div
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            imageLoaded ? "opacity-0 scale-110" : "opacity-100 scale-100"
          }`}>
          <div className="skeleton-loading w-full h-full" />
        </div>
      )}

      {/* Actual image with crossfade */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`relative z-10 w-full h-full object-cover smooth-image-reveal transition-all duration-1000 ease-out ${
          showTransition
            ? "opacity-100 blur-0 scale-100"
            : "opacity-0 blur-sm scale-105"
        }`}
        loading="lazy"
      />
    </div>
  );
};
