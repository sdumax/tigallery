import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  HomeIcon,
  ChatIcon,
  BellIcon,
  MenuIcon,
  XIcon,
} from "../svgIcons";
import { useGalleryContext } from "../../contexts/GalleryContext";
import { useAuth } from "../../contexts/AuthContext";
import { AuthModal } from "../auth/AuthModal";
import { UserMenu } from "../auth/UserMenu";
import { Button } from "../ui/Button";

export const Navigation = () => {
  const { searchQuery, setSearchQuery, setSelectedCategory } =
    useGalleryContext();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">(
    "login"
  );

  // Sync local search input with context
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = searchInput.trim();
    setSearchQuery(trimmedSearch);
    if (trimmedSearch) {
      setSelectedCategory("all"); // Reset category when searching
    }
    setIsSearchOpen(false); // Close mobile search after submitting
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setSelectedCategory("all");
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const openAuthModal = (mode: "login" | "register") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="bg-primary w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-xl">T</span>
            </div>
            <span className="ml-2 text-base sm:text-lg lg:text-xl font-bold">
              Tigallery
            </span>
          </div>

          {/* Mobile Search Button */}
          <button
            className="sm:hidden p-2 text-text-secondary hover:text-text-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <SearchIcon className="w-5 h-5" />
          </button>

          {/* Desktop Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-xl lg:max-w-2xl mx-4 lg:mx-8">
            <form
              onSubmit={handleSearch}
              className="relative rounded-full bg-card border border-border hover:border-text-tertiary transition-colors w-full">
              <input
                type="text"
                placeholder="Search for inspiration..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="w-full py-2 px-4 pl-10 pr-12 bg-transparent focus:outline-none placeholder-text-tertiary text-sm"
              />
              <div className="absolute left-3 top-2.5 text-text-tertiary">
                <SearchIcon className="w-4 h-4" />
              </div>
              {(searchInput || searchQuery) && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-0.5 text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-full hover:bg-card-hover">
                  ✕
                </button>
              )}
            </form>
          </div>

          {/* Desktop Navigation Icons */}
          <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
            <a
              href="#"
              className="text-text-primary hover:text-primary transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <HomeIcon className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-text-primary hover:text-primary transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <ChatIcon className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-text-primary hover:text-primary transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <BellIcon className="w-5 h-5" />
            </a>

            {/* Authentication section */}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuthModal("login")}
                  className="text-text-primary hover:text-primary">
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openAuthModal("register")}
                  className="hidden lg:flex">
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 text-text-secondary hover:text-text-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <XIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="sm:hidden py-3 border-t border-border px-1">
            <form
              onSubmit={handleSearch}
              className="relative rounded-full bg-card border border-border">
              <input
                type="text"
                placeholder="Search for inspiration..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="w-full py-3 px-4 pl-10 pr-12 bg-transparent focus:outline-none placeholder-text-tertiary text-base"
                autoFocus
              />
              <div className="absolute left-3 top-3.5 text-text-tertiary">
                <SearchIcon className="w-4 h-4" />
              </div>
              {(searchInput || searchQuery) && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-0.5 text-text-tertiary hover:text-text-primary transition-colors p-1.5 rounded-full hover:bg-card-hover min-h-[32px] min-w-[32px] flex items-center justify-center">
                  ✕
                </button>
              )}
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden py-3 border-t border-border">
            {isAuthenticated ? (
              <div className="space-y-3">
                {/* User info section */}
                <div className="px-3 pb-3 border-b border-border">
                  <UserMenu className="w-full" isMobile={true} />
                </div>

                {/* Navigation links */}
                <div className="grid grid-cols-3 gap-1 px-3">
                  <a
                    href="#"
                    className="flex flex-col items-center text-text-primary hover:text-primary transition-colors p-3 min-h-[60px] rounded-lg hover:bg-card-hover">
                    <HomeIcon className="w-5 h-5 mb-1" />
                    <span className="text-xs">Home</span>
                  </a>
                  <a
                    href="#"
                    className="flex flex-col items-center text-text-primary hover:text-primary transition-colors p-3 min-h-[60px] rounded-lg hover:bg-card-hover">
                    <ChatIcon className="w-5 h-5 mb-1" />
                    <span className="text-xs">Chat</span>
                  </a>
                  <a
                    href="#"
                    className="flex flex-col items-center text-text-primary hover:text-primary transition-colors p-3 min-h-[60px] rounded-lg hover:bg-card-hover">
                    <BellIcon className="w-5 h-5 mb-1" />
                    <span className="text-xs">Alerts</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3 px-3">
                {/* Auth buttons */}
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => openAuthModal("register")}
                    className="w-full">
                    Sign Up
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => openAuthModal("login")}
                    className="w-full">
                    Sign In
                  </Button>
                </div>

                {/* Navigation links */}
                <div className="pt-3 border-t border-border">
                  <div className="grid grid-cols-3 gap-1">
                    <a
                      href="#"
                      className="flex flex-col items-center text-text-primary hover:text-primary transition-colors p-3 min-h-[60px] rounded-lg hover:bg-card-hover">
                      <HomeIcon className="w-5 h-5 mb-1" />
                      <span className="text-xs">Home</span>
                    </a>
                    <a
                      href="#"
                      className="flex flex-col items-center text-text-primary hover:text-primary transition-colors p-3 min-h-[60px] rounded-lg hover:bg-card-hover">
                      <ChatIcon className="w-5 h-5 mb-1" />
                      <span className="text-xs">Chat</span>
                    </a>
                    <a
                      href="#"
                      className="flex flex-col items-center text-text-primary hover:text-primary transition-colors p-3 min-h-[60px] rounded-lg hover:bg-card-hover">
                      <BellIcon className="w-5 h-5 mb-1" />
                      <span className="text-xs">Alerts</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </nav>
  );
};
