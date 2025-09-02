import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import RedditLogoSvg from "../../assets/reddit-logo.svg";
import RedditLogoName from "../../assets/reddit-logo-name-letters-together.svg";
import { cn } from "../../lib/utils";

interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const IconWrapper: React.FC<IconWrapperProps> = ({
  children,
  className = "",
  size = "md",
}) => {
  const { isDarkMode } = useTheme();

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div
      className={cn(
        sizeClasses[size],
        className,
        isDarkMode ? "text-white" : "text-gray-800"
      )}
      style={{
        filter: isDarkMode ? "brightness(0) invert(1)" : "none",
      }}
    >
      {children}
    </div>
  );
};

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

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
  onSearch?: (
    query: string,
    sort?: "relevance" | "hot" | "top" | "new" | "comments",
    time?: "hour" | "day" | "week" | "month" | "year" | "all"
  ) => void;
  onGoToHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onSearch,
  onGoToHome,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
      setShowSearchResults(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b",
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={onToggleSidebar}
                className={cn(
                  "p-2 rounded-md mr-2 cursor-pointer",
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                )}
              >
                <IconWrapper size="sm">
                  <MenuIcon />
                </IconWrapper>
              </button>
              <div className="relative flex items-center">
                <button
                  onClick={onGoToHome}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="cursor-pointer flex items-center"
                >
                  <div className="w-8 h-8">
                    <RedditLogoSvg />
                  </div>
                  <div
                    className={cn(
                      "ml-2 h-6 hidden lg:block",
                      isDarkMode ? "text-white" : "text-orange-700"
                    )}
                  >
                    <div
                      className={cn(
                        "h-6",
                        isDarkMode ? "text-white" : "text-orange-600"
                      )}
                    >
                      <RedditLogoName />
                    </div>
                  </div>
                </button>
                {showTooltip && (
                  <div className="absolute top-1/2 left-full ml-2 lg:ml-17 transform -translate-y-1/2 z-50">
                    <div className="bg-black text-white text-xs font-bold px-3 py-2 rounded-md shadow-lg whitespace-nowrap font-sans">
                      Go to Reddit Home
                      <div className="absolute top-1/2 -left-1 w-2 h-2 bg-black transform -translate-y-1/2 rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-lg mx-8 relative">
            <form onSubmit={handleSearch} className="relative">
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
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() =>
                  setTimeout(() => setShowSearchResults(false), 200)
                }
                className={cn(
                  "block w-full pl-10 pr-3 py-2 border rounded-md leading-5",
                  "focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500",
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                )}
              />
            </form>
            {showSearchResults && (
              <div
                className={cn(
                  "absolute top-full left-0 right-0 mt-1 rounded-md shadow-lg z-10",
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200"
                )}
              >
                <div className="py-2">
                  <div
                    className={cn(
                      "px-4 py-2 text-sm",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    No results found.
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-md cursor-pointer",
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              )}
            >
              <IconWrapper>
                <DarkModeIcon />
              </IconWrapper>
            </button>
            <button
              className={cn(
                "px-4 py-2 rounded-full font-medium cursor-pointer",
                "bg-orange-500 text-white hover:bg-orange-600"
              )}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
