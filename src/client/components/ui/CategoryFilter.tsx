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
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for inspiration..."
              className="w-full pl-12 pr-20 py-4 bg-card border border-border rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text-primary placeholder-text-tertiary"
            />
            {(searchInput || searchQuery) && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors">
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-medium transition-colors">
            Search
          </button>
        </form>

        {/* Search Status */}
        {searchQuery && (
          <div className="mt-3 text-center">
            <p className="text-text-secondary">
              Searching for:{" "}
              <span className="font-medium text-text-primary">
                "{searchQuery}"
              </span>
              <button
                onClick={clearSearch}
                className="ml-2 text-primary hover:text-primary-hover text-sm underline">
                Clear
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex space-x-3 mx-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-colors whitespace-nowrap ${
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
