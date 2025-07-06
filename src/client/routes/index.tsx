import { createFileRoute } from "@tanstack/react-router";
import { CategoryFilter, PinGrid } from "../components";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      {/* Categories */}
      <CategoryFilter />

      {/* Pinterest Grid */}
      <PinGrid />
    </>
  );
}
