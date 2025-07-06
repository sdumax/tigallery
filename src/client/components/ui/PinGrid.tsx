import React, { useEffect } from "react";
import { PinCard } from "./PinCard";
import { useGallery } from "../../hooks/useQueries";
import { useSearchWithDebounce } from "../../hooks/useQueries";
import { useGalleryContext } from "../../contexts/GalleryContext";

export const PinGrid = () => {
  const { searchQuery, isSearching, setIsSearching } = useGalleryContext();

  // Use search when there's a query, otherwise use regular gallery
  const shouldSearch = searchQuery && searchQuery.trim().length > 0;

  const galleryQuery = useGallery({ perPage: 20 });
  const searchResults = useSearchWithDebounce(searchQuery, 500);

  // Update searching state
  useEffect(() => {
    if (shouldSearch) {
      setIsSearching(searchResults.isSearching);
    } else {
      setIsSearching(galleryQuery.isLoading);
    }
  }, [
    shouldSearch,
    searchResults.isSearching,
    galleryQuery.isLoading,
    setIsSearching,
  ]);

  const {
    images,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    error,
  } = shouldSearch
    ? {
        images: searchResults.searchResults,
        isLoading: searchResults.isSearching,
        isFetchingNextPage: searchResults.isFetchingNextPage,
        hasNextPage: searchResults.hasNextPage,
        loadMore: searchResults.loadMore,
        error: searchResults.error,
      }
    : {
        images: galleryQuery.images,
        isLoading: galleryQuery.isLoading,
        isFetchingNextPage: galleryQuery.isFetchingNextPage,
        hasNextPage: galleryQuery.hasNextPage,
        loadMore: galleryQuery.loadMore,
        error: galleryQuery.error,
      };

  const handleLikeToggle = (id: string, isLiked: boolean) => {
    console.log(`Pin ${id} ${isLiked ? "liked" : "unliked"}`);
    // TODO: Implement real like functionality with user authentication
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-text-secondary">
            {shouldSearch
              ? `Searching for "${searchQuery}"...`
              : "Loading amazing photos..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-lg">
            ⚠️ Oops! Something went wrong
          </div>
          <p className="text-text-secondary">
            {shouldSearch
              ? `We couldn't search for "${searchQuery}". Please try again.`
              : "We couldn't load the photos. Please try again later."}
          </p>
          <p className="text-sm text-text-tertiary">
            Error: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Results Info */}
      {shouldSearch && (
        <div className="text-center py-4">
          <p className="text-text-secondary">
            {images.length > 0
              ? `Found ${images.length} result${images.length === 1 ? "" : "s"} for "${searchQuery}"`
              : `No results found for "${searchQuery}"`}
          </p>
        </div>
      )}

      {/* Pinterest Grid */}
      <div className="pinterest-grid">
        {images.map((image) => (
          <PinCard
            key={image.id}
            id={image.id}
            imageUrl={image.urls.regular}
            alt={image.alt_description || image.description || "Untitled"}
            title={image.alt_description || image.description || "Untitled"}
            description={image.description || ""}
            author={image.user.name || image.user.username}
            isLiked={false} // TODO: Get real like status from user data
            onLikeToggle={handleLikeToggle}
          />
        ))}
      </div>

      {/* Load More Section */}
      {hasNextPage && (
        <div className="flex justify-center pt-8">
          <button
            onClick={loadMore}
            disabled={isFetchingNextPage}
            className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
            {isFetchingNextPage ? (
              <span className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading...</span>
              </span>
            ) : shouldSearch ? (
              "Load More Results"
            ) : (
              "Load More Photos"
            )}
          </button>
        </div>
      )}

      {/* End of Results */}
      {!hasNextPage && images.length > 0 && (
        <div className="text-center text-text-secondary pt-8">
          <p>
            🎉{" "}
            {shouldSearch
              ? "You've seen all the search results!"
              : "You've seen all the amazing photos!"}
          </p>
          <p className="text-sm mt-2">
            {shouldSearch
              ? "Try a different search term."
              : "Come back later for more inspiration."}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && images.length === 0 && (
        <div className="text-center py-20">
          <div className="space-y-4">
            <div className="text-6xl">{shouldSearch ? "🔍" : "📷"}</div>
            <h3 className="text-xl font-semibold text-text-primary">
              {shouldSearch ? "No results found" : "No photos found"}
            </h3>
            <p className="text-text-secondary">
              {shouldSearch
                ? `We couldn't find any photos matching "${searchQuery}". Try different keywords or browse all photos.`
                : "We couldn't find any photos to display. Please try again later."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
