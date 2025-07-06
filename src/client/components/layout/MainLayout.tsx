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
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
