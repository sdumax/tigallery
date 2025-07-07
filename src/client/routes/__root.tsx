import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Navigation, Footer } from "../components";
import { GalleryProvider } from "../contexts/GalleryContext";
import { AuthProvider } from "../contexts/AuthContext";
import { AuthModalProvider, useAuthModal } from "../contexts/AuthModalContext";
import { AuthModal } from "../components/auth/AuthModal";

const RootComponent = () => {
  const authModal = useAuthModal();

  return (
    <>
      <Navigation />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
      <TanStackRouterDevtools />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={authModal.closeModal}
        initialMode={authModal.mode}
      />
    </>
  );
};

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <AuthModalProvider>
        <GalleryProvider>
          <RootComponent />
        </GalleryProvider>
      </AuthModalProvider>
    </AuthProvider>
  ),
});
