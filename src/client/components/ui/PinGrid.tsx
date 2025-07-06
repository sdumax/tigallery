import React from "react";
import { PinCard } from "./PinCard";

const mockPins = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Interior Design",
    title: "Minimalist Living Room",
    description: "Modern interior design ideas for small spaces",
    author: "Design Studio",
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Travel",
    title: "Mountain Getaway",
    description: "Top 10 places to visit in the Alps this winter",
    author: "Travel Guide",
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Food",
    title: "Pancake Perfection",
    description: "Fluffy pancakes with maple syrup and berries",
    author: "Food Network",
  },
  {
    id: "4",
    imageUrl:
      "https://images.unsplash.com/photo-1543857778-c4a1a569e7bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Fashion",
    title: "Street Style",
    description: "Urban fashion trends for fall 2023",
    author: "Style Magazine",
  },
  {
    id: "5",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Food",
    title: "Dinner Ideas",
    description: "Quick and healthy dinner recipes for busy weeknights",
    author: "Chef's Table",
  },
  {
    id: "6",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Fashion",
    title: "Cozy Outfits",
    description: "Winter fashion inspiration for staying warm in style",
    author: "Fashion Daily",
  },
  {
    id: "7",
    imageUrl:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Nature",
    title: "Misty Mountains",
    description: "Breathtaking landscapes from around the world",
    author: "Nature Lover",
  },
  {
    id: "8",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Design",
    title: "Typography Inspiration",
    description: "Creative font pairings for your next project",
    author: "Design Studio",
  },
];

export const PinGrid = () => {
  return (
    <div className="pinterest-grid">
      {mockPins.map((pin) => (
        <PinCard
          key={pin.id}
          id={pin.id}
          imageUrl={pin.imageUrl}
          alt={pin.alt}
          title={pin.title}
          description={pin.description}
          author={pin.author}
        />
      ))}
    </div>
  );
};
