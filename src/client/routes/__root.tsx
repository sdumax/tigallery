import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="bg-gray-800 text-white p-4">
        <nav className="container mx-auto">
          <Link to="/" className="text-lg font-bold">
            TIG
          </Link>
        </nav>
      </header>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  ),
});
