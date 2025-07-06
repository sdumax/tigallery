import React, { useState } from "react";
import {
  SearchIcon,
  HomeIcon,
  ChatIcon,
  BellIcon,
  MenuIcon,
  XIcon,
} from "../svgIcons";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
            <div className="relative rounded-full bg-card border border-border hover:border-text-tertiary transition-colors w-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full py-2 px-4 pl-10 bg-transparent focus:outline-none placeholder-text-tertiary text-sm"
              />
              <div className="absolute left-3 top-2.5 text-text-tertiary">
                <SearchIcon className="w-4 h-4" />
              </div>
            </div>
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
            <a
              href="#"
              className="text-text-primary hover:text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <div className="bg-accent w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                U
              </div>
            </a>
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
            <div className="relative rounded-full bg-card border border-border">
              <input
                type="text"
                placeholder="Search"
                className="w-full py-3 px-4 pl-10 bg-transparent focus:outline-none placeholder-text-tertiary text-base"
                autoFocus
              />
              <div className="absolute left-3 top-3.5 text-text-tertiary">
                <SearchIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden py-3 border-t border-border">
            <div className="grid grid-cols-4 gap-1">
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
              <a
                href="#"
                className="flex flex-col items-center text-text-primary hover:text-primary transition-colors p-3 min-h-[60px] rounded-lg hover:bg-card-hover">
                <div className="bg-accent w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1">
                  U
                </div>
                <span className="text-xs">Profile</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
