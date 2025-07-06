import React from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { CategoryFilter } from "../ui/CategoryFilter";
import { PinGrid } from "../ui/PinGrid";

export const MainLayout = () => {
  return (
    <>
      <Navigation />

      {/* Main Content */}
      <main className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          {/* Categories */}
          <CategoryFilter />

          {/* Pinterest Grid */}
          <PinGrid />
        </div>
      </main>

      <Footer />
    </>
  );
};
