import React from "react";

export const Footer = () => {
  return (
    <footer className="mt-12 py-8 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="ml-2 text-xl font-bold">Tigallery</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors">
              About
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors">
              Business
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors">
              Blog
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors">
              Terms
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors">
              Privacy
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors">
              Help
            </a>
          </div>

          <div className="mt-4 md:mt-0 text-center md:text-right">
            <p className="text-text-tertiary text-sm">© 2023 Tigallery</p>
            <p className="text-text-tertiary text-xs mt-1">
              Inspired by Pinterest
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
