import React, { createContext, useContext, useState, ReactNode } from "react";

interface GalleryContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const useGalleryContext = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGalleryContext must be used within a GalleryProvider");
  }
  return context;
};

interface GalleryProviderProps {
  children: ReactNode;
}

export const GalleryProvider: React.FC<GalleryProviderProps> = ({
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearching, setIsSearching] = useState(false);

  const value: GalleryContextType = {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    isSearching,
    setIsSearching,
  };

  return (
    <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
  );
};
