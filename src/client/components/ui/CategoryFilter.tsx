import React, { useState } from "react";
import { SearchIcon } from "../svgIcons";
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

  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    if (searchInput.trim()) {
      setSelectedCategory("all"); // Reset category when searching
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId !== "all") {
      setSearchQuery(categoryId); // Use category as search term
      setSearchInput(categoryId);
    } else {
      setSearchQuery("");
      setSearchInput("");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setSelectedCategory("all");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <SearchIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-text-tertiary" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for inspiration..."
              className="w-full pl-10 sm:pl-12 pr-16 sm:pr-20 py-3 sm:py-4 bg-card border border-border rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text-primary placeholder-text-tertiary text-sm sm:text-base"
            />
            {(searchInput || searchQuery) && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-12 sm:right-16 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center sm:min-h-auto sm:min-w-auto sm:p-0">
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary-hover text-white px-4 sm:px-6 py-2 rounded-full font-medium transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-auto">
            Search
          </button>
        </form>

        {/* Search Status */}
        {searchQuery && (
          <div className="mt-2 sm:mt-3 text-center px-4">
            <p className="text-text-secondary text-sm sm:text-base">
              Searching for:{" "}
              <span className="font-medium text-text-primary">
                "{searchQuery}"
              </span>
              <button
                onClick={clearSearch}
                className="ml-2 text-primary hover:text-primary-hover text-sm underline p-1">
                Clear
              </button>
            </p>
          </div>
        )}
      </div>

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
