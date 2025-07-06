import { createFileRoute } from "@tanstack/react-router";
import { CategoryFilter, PinGrid } from "../components";
import { GalleryProvider } from "../contexts/GalleryContext";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <GalleryProvider>
      {/* Categories */}
      <CategoryFilter />

      {/* Pinterest Grid */}
      <PinGrid />
    </GalleryProvider>
  );
}
