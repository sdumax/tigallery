import React from "react";
import { ImageSkeleton } from "./UnsplashBlurImage";

interface LoadingGridProps {
  count?: number;
  className?: string;
}

export const LoadingGrid: React.FC<LoadingGridProps> = ({
  count = 12,
  className = "",
}) => {
  // Generate random heights for skeleton cards to mimic Pinterest layout
  const generateRandomHeight = () => {
    const heights = ["h-48", "h-56", "h-64", "h-72", "h-80"];
    return heights[Math.floor(Math.random() * heights.length)];
  };

  return (
    <div className={`pinterest-grid ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="pin-card bg-card">
          {/* Image skeleton */}
          <ImageSkeleton className={`w-full ${generateRandomHeight()}`} />

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title skeleton */}
            <div className="skeleton-loading h-4 w-3/4 rounded"></div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="skeleton-loading h-3 w-full rounded"></div>
              <div className="skeleton-loading h-3 w-2/3 rounded"></div>
            </div>

            {/* Author skeleton */}
            <div className="flex items-center space-x-3 pt-2">
              <div className="skeleton-loading w-8 h-8 rounded-full"></div>
              <div className="skeleton-loading h-3 w-1/3 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Simpler loading component for search results
export const SearchLoadingGrid: React.FC<LoadingGridProps> = ({
  count = 8,
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="space-y-2">
          <ImageSkeleton className="w-full h-48 rounded-lg" />
          <div className="skeleton-loading h-4 w-3/4 rounded"></div>
          <div className="skeleton-loading h-3 w-1/2 rounded"></div>
        </div>
      ))}
    </div>
  );
};

// Loading component for individual pin details
export const PinDetailsLoading: React.FC = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Image Section */}
      <div className="space-y-4">
        <ImageSkeleton className="w-full h-96 rounded-lg" />

        {/* Action buttons skeleton */}
        <div className="flex items-center space-x-4">
          <div className="skeleton-loading h-10 w-20 rounded-full"></div>
          <div className="skeleton-loading h-10 w-20 rounded-full"></div>
          <div className="skeleton-loading h-10 w-20 rounded-full"></div>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-3">
          <div className="skeleton-loading h-8 w-3/4 rounded"></div>
          <div className="skeleton-loading h-4 w-full rounded"></div>
          <div className="skeleton-loading h-4 w-2/3 rounded"></div>
        </div>

        {/* Author */}
        <div className="flex items-center space-x-4 p-4 bg-card rounded-lg">
          <div className="skeleton-loading w-12 h-12 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="skeleton-loading h-4 w-1/3 rounded"></div>
            <div className="skeleton-loading h-3 w-1/4 rounded"></div>
          </div>
          <div className="skeleton-loading h-8 w-16 rounded-full"></div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <div className="skeleton-loading h-5 w-16 rounded"></div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="skeleton-loading h-6 w-20 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <div className="skeleton-loading h-5 w-24 rounded"></div>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex space-x-3">
              <div className="skeleton-loading w-8 h-8 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton-loading h-16 w-full rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
