import React from "react";
import { Link } from "@tanstack/react-router";

interface PinCardProps {
  id: string;
  imageUrl: string;
  alt: string;
  title: string;
  description: string;
  author: string;
}

export const PinCard: React.FC<PinCardProps> = ({
  id,
  imageUrl,
  alt,
  title,
  description,
  author,
}) => {
  return (
    <div className="pin-card bg-card group">
      <Link to="/pin/$pinId" params={{ pinId: id }} className="block">
        <div className="relative">
          <img
            src={imageUrl}
            alt={alt}
            className="w-full transition-transform group-hover:scale-105"
          />
          <button
            className="absolute top-3 right-3 bg-primary hover:bg-primary-hover text-white rounded-full px-4 py-2 font-bold transition-colors opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle save action here
            }}>
            Save
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-text-secondary text-sm mb-3">{description}</p>
          <div className="flex items-center">
            <div className="bg-gray-500 w-8 h-8 rounded-full mr-2"></div>
            <span className="text-text-secondary text-sm">{author}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};
