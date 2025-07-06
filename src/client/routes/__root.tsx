import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Navigation, Footer } from "../components";
import { GalleryProvider } from "../contexts/GalleryContext";

export const Route = createRootRoute({
  component: () => (
    <GalleryProvider>
      <Navigation />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
      <TanStackRouterDevtools />
    </GalleryProvider>
  ),
});
