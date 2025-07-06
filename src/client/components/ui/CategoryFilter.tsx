import React from "react";
import { useGalleryContext } from "../../contexts/GalleryContext";

const categories = [
  { id: "all", label: "All Pins" },
  { id: "design", label: "Design" },
  { id: "travel", label: "Travel" },
  { id: "food", label: "Food" },
  { id: "art", label: "Art" },
  { id: "photography", label: "Photography" },
  { id: "fashion", label: "Fashion" },
  { id: "home-decor", label: "Home Decor" },
  { id: "diy", label: "DIY" },
  { id: "nature", label: "Nature" },
  { id: "architecture", label: "Architecture" },
];

export const CategoryFilter = () => {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } =
    useGalleryContext();

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId !== "all") {
      setSearchQuery(categoryId); // Use category as search term
    } else {
      setSearchQuery("");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Status */}
      {searchQuery && (
        <div className="text-center px-4">
          <p className="text-text-secondary text-sm sm:text-base">
            {searchQuery === selectedCategory && selectedCategory !== "all" ? (
              <>
                Browsing:{" "}
                <span className="font-medium text-text-primary">
                  {categories.find((c) => c.id === selectedCategory)?.label ||
                    searchQuery}
                </span>
              </>
            ) : (
              <>
                Searching for:{" "}
                <span className="font-medium text-text-primary">
                  "{searchQuery}"
                </span>
              </>
            )}
          </p>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex overflow-x-auto pb-2 sm:pb-4 hide-scrollbar px-4 sm:px-0">
        <div className="flex space-x-2 sm:space-x-3 mx-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-colors whitespace-nowrap text-sm sm:text-base min-h-[44px] flex items-center ${
                selectedCategory === category.id
                  ? "bg-primary text-white shadow-lg"
                  : "bg-card hover:bg-card-hover text-text-secondary hover:text-text-primary border border-border"
              }`}>
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
