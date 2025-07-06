import React from "react";

export const Footer = () => {
  return (
    <footer className="mt-8 sm:mt-12 py-6 sm:py-8 border-t border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <div className="bg-primary w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-xl">T</span>
            </div>
            <span className="ml-2 text-lg sm:text-xl font-bold">Tigallery</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm sm:text-base p-2 min-h-[44px] flex items-center">
              About
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm sm:text-base p-2 min-h-[44px] flex items-center">
              Business
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm sm:text-base p-2 min-h-[44px] flex items-center">
              Blog
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm sm:text-base p-2 min-h-[44px] flex items-center">
              Terms
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm sm:text-base p-2 min-h-[44px] flex items-center">
              Privacy
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm sm:text-base p-2 min-h-[44px] flex items-center">
              Help
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-text-tertiary text-xs sm:text-sm">
              © 2023 Tigallery
            </p>
            <p className="text-text-tertiary text-xs mt-1">
              Inspired by Pinterest
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
