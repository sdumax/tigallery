import React from "react";
import { SearchIcon, HomeIcon, ChatIcon, BellIcon } from "../svgIcons";

export const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="ml-2 text-xl font-bold">Pinterest</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative rounded-full bg-card border border-border hover:border-text-tertiary transition-colors">
              <input
                type="text"
                placeholder="Search"
                className="w-full py-2 px-4 pl-10 bg-transparent focus:outline-none placeholder-text-tertiary"
              />
              <div className="absolute left-3 top-2.5 text-text-tertiary">
                <SearchIcon />
              </div>
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-text-primary hover:text-primary transition-colors">
              <HomeIcon />
            </a>
            <a
              href="#"
              className="text-text-primary hover:text-primary transition-colors">
              <ChatIcon />
            </a>
            <a
              href="#"
              className="text-text-primary hover:text-primary transition-colors">
              <BellIcon />
            </a>
            <a
              href="#"
              className="text-text-primary hover:text-primary transition-colors">
              <div className="bg-accent w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
                U
              </div>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
