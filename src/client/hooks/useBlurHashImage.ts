import { useState, useEffect } from "react";

interface UseBlurHashImageProps {
  src: string;
  onLoad?: () => void;
  onError?: () => void;
}

interface UseBlurHashImageReturn {
  isLoaded: boolean;
  hasError: boolean;
  showTransition: boolean;
}

export const useBlurHashImage = ({
  src,
  onLoad,
  onError,
}: UseBlurHashImageProps): UseBlurHashImageReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    if (!src) return;

    // Reset states
    setIsLoaded(false);
    setHasError(false);
    setShowTransition(false);

    const img = new Image();

    img.onload = () => {
      setShowTransition(true);
      setTimeout(() => {
        setIsLoaded(true);
        onLoad?.();
      }, 100);
    };

    img.onerror = () => {
      setHasError(true);
      onError?.();
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad, onError]);

  return {
    isLoaded,
    hasError,
    showTransition,
  };
};
