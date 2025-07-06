import React from "react";

const categories = [
  { id: "all", label: "All Pins", active: true },
  { id: "design", label: "Design", active: false },
  { id: "travel", label: "Travel", active: false },
  { id: "food", label: "Food", active: false },
  { id: "art", label: "Art", active: false },
  { id: "photography", label: "Photography", active: false },
  { id: "fashion", label: "Fashion", active: false },
  { id: "home-decor", label: "Home Decor", active: false },
  { id: "diy", label: "DIY", active: false },
];

export const CategoryFilter = () => {
  return (
    <div className="flex overflow-x-auto pb-4 mb-6 hide-scrollbar">
      <div className="flex space-x-3">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              category.active
                ? "bg-primary text-white"
                : "bg-card hover:bg-card-hover"
            }`}>
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};
