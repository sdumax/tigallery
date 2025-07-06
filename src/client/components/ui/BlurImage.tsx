import React, { useState, useRef, useEffect } from "react";

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  blurDataURL?: string;
  placeholder?: "blur" | "empty" | "shimmer";
  animationType?: "smooth" | "crossfade" | "progressive";
  onLoad?: () => void;
  onError?: () => void;
}

// Generate a simple blur data URL for placeholder
const generateBlurDataURL = (width = 10, height = 10) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  if (ctx) {
    // Create a gradient for the blur effect
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f3f4f6");
    gradient.addColorStop(0.5, "#e5e7eb");
    gradient.addColorStop(1, "#d1d5db");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  return canvas.toDataURL();
};

export const BlurImage: React.FC<BlurImageProps> = ({
  src,
  alt,
  className = "",
  blurDataURL,
  placeholder = "blur",
  animationType = "smooth",
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const defaultBlurDataURL = blurDataURL || generateBlurDataURL();

  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    setHasError(false);
    setShowTransition(false);

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      // Start transition immediately when image is ready
      setShowTransition(true);

      // Complete loading state after a brief delay to allow transition to start
      setTimeout(() => {
        setIsLoading(false);
        onLoad?.();
      }, 100);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad, onError]);

  const renderPlaceholder = () => {
    switch (placeholder) {
      case "shimmer":
        return (
          <div
            className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse ${className}`}>
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        );
      case "empty":
        return <div className={`bg-gray-200 ${className}`} />;
      case "blur":
      default:
        return (
          <img
            src={defaultBlurDataURL}
            alt=""
            className={`filter blur-sm transition-all duration-300 ${className}`}
          />
        );
    }
  };

  const renderError = () => (
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
        <p className="text-xs">Failed to load</p>
      </div>
    </div>
  );

  if (hasError) {
    return renderError();
  }

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

  return (
    <div className="relative overflow-hidden">
      {/* Placeholder with enhanced fade-out transition */}
      <div
        className={`absolute inset-0 transition-all ${getTransitionDuration()} ease-out ${
          showTransition
            ? "opacity-0 scale-105 blur-md"
            : "opacity-100 scale-100"
        }`}>
        {renderPlaceholder()}
      </div>

      {/* Actual Image with selected animation type */}
      {imageSrc && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          className={`relative z-10 w-full h-full object-cover ${getAnimationClass()} ${
            showTransition
              ? "opacity-100 blur-0 scale-100"
              : "opacity-0 blur-sm scale-105"
          } ${className}`}
          loading="lazy"
        />
      )}
    </div>
  );
};

// Progressive blur image component with multiple quality levels
export const ProgressiveBlurImage: React.FC<
  BlurImageProps & {
    lowQualitySrc?: string;
    mediumQualitySrc?: string;
  }
> = ({
  src,
  lowQualitySrc,
  mediumQualitySrc,
  alt,
  className = "",
  animationType = "progressive",
  onLoad,
  onError,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const imagesToLoad = [lowQualitySrc, mediumQualitySrc, src].filter(
      Boolean
    ) as string[];

    imagesToLoad.forEach((imageSrc, index) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, imageSrc]));
        setCurrentSrc(imageSrc);

        // If this is the final high-quality image
        if (index === imagesToLoad.length - 1) {
          onLoad?.();
        }
      };
      img.onerror = () => {
        if (index === imagesToLoad.length - 1) {
          onError?.();
        }
      };
      img.src = imageSrc;
    });
  }, [src, lowQualitySrc, mediumQualitySrc, onLoad, onError]);

  const getBlurAmount = () => {
    if (loadedImages.has(src)) return "blur-0";
    if (loadedImages.has(mediumQualitySrc || "")) return "blur-xs";
    if (loadedImages.has(lowQualitySrc || "")) return "blur-sm";
    return "blur-md";
  };

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

  return (
    <div className="relative overflow-hidden">
      {currentSrc ? (
        <img
          src={currentSrc}
          alt={alt}
          className={`${getAnimationClass()} transition-all duration-1000 ease-out filter ${getBlurAmount()} ${className}`}
          loading="lazy"
        />
      ) : (
        <div className={`bg-gray-200 animate-pulse ${className}`} />
      )}
    </div>
  );
};
