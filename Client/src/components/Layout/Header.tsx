import React, { useState } from "react";
import { IconWrapper } from "../Icons/IconWrapper";
import { useTheme } from "../../contexts/ThemeContext";
import RedditLogoSvg from "../../assets/reddit-logo.svg";
import RedditLogoName from "../../assets/reddit-logo-name-letters-together.svg";

// Hamburger menu icon
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

// SVG Icons - replace with your actual SVG imports
const RedditLogo = () => <RedditLogoSvg />;

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const DarkModeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 border-b ${
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              {/* Hamburger Menu Button - show on all screens */}
              <button
                onClick={onToggleSidebar}
                className={`p-2 rounded-md mr-2 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <IconWrapper size="sm">
                  <MenuIcon />
                </IconWrapper>
              </button>

              <div className="w-8 h-8">
                <RedditLogoSvg />
              </div>
              <div className="ml-2 h-6 hidden lg:block">
                <IconWrapper size="sm">
                  <RedditLogoName />
                </IconWrapper>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconWrapper size="sm" className="text-gray-400">
                  <SearchIcon />
                </IconWrapper>
              </div>
              <input
                type="text"
                placeholder="Search Reddit"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() =>
                  setTimeout(() => setShowSearchResults(false), 200)
                }
                className={`block w-full pl-10 pr-3 py-2 border rounded-md leading-5 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500`}
              />
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div
                className={`absolute top-full left-0 right-0 mt-1 rounded-md shadow-lg z-10 ${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="py-2">
                  <div
                    className={`px-4 py-2 text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No results found.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <IconWrapper>
                <DarkModeIcon />
              </IconWrapper>
            </button>

            {/* Sign In Button */}
            <button
              className={`px-4 py-2 rounded-full font-medium ${
                isDarkMode
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
