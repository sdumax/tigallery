import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

interface UserMenuProps {
  className?: string;
  isMobile?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  className = "",
  isMobile = false,
}) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside (only for desktop)
  useEffect(() => {
    if (isMobile) return; // Don't auto-close on mobile

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!user) return null;

  // Mobile version - show user info inline without dropdown
  if (isMobile) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar name={user.username} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text-primary truncate">
                {user.username}
              </p>
              <p className="text-sm text-text-secondary truncate">
                {user.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-text-primary hover:text-primary transition-colors p-2 rounded-full hover:bg-card-hover min-h-[44px]">
        <Avatar name={user.username} size="sm" />
        <span className="hidden sm:block text-sm font-medium">
          {user.username}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <Avatar name={user.username} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">
                  {user.username}
                </p>
                <p className="text-sm text-text-secondary truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to profile page
                console.log("Navigate to profile");
              }}
              className="w-full px-4 py-3 text-left text-text-primary hover:bg-card-hover transition-colors flex items-center space-x-3 min-h-[44px]">
              <div className="w-5 h-5 flex items-center justify-center">👤</div>
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to settings page
                console.log("Navigate to settings");
              }}
              className="w-full px-4 py-3 text-left text-text-primary hover:bg-card-hover transition-colors flex items-center space-x-3 min-h-[44px]">
              <div className="w-5 h-5 flex items-center justify-center">⚙️</div>
              <span>Settings</span>
            </button>

            <div className="border-t border-border my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3 min-h-[44px]">
              <div className="w-5 h-5 flex items-center justify-center">🚪</div>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
