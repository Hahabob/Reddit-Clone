import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useTheme } from "../../contexts/ThemeContext";
import RedditLogoSvg from "../../assets/reddit-logo.svg";
import RedditLogoName from "../../assets/reddit-logo-name-letters-together.svg";
import { cn } from "../../lib/utils";
import QRCodeIcon from "../../assets/QRCode-icon.svg";
import RedditProBetaSvg from "../../assets/reddit-pro-logo.svg";
import AdvertiseIconSvg from "../../assets/AdvertiseIcon.svg";
import LogInOutIcon from "../../assets/log-in-out-icon.svg";
import { QRCodeModal } from "../ui/RedditQRPop";
import { UserSidebar } from "./UserSidebar";
import NotificationsIconSvg from "../../assets/notificationIcon.svg";
import ChatIcon from "../../assets/ChatIcon.svg";

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

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
    <circle cx="5" cy="12" r="2" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
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
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMoreMenu]);

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

  const handleLoginClick = () => {
    navigate("/sign-in");
  };

  const handleLoginMenuClick = () => {
    navigate("/sign-in");
    setShowMoreMenu(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors",
        isDarkMode ? "border-[#434546]" : "border-gray-200"
      )}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={onToggleSidebar}
                className={cn(
                  "p-2 rounded-md mr-2 cursor-pointer",
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-900"
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
                  "block w-full pl-10 pr-3 py-3 rounded-full text-sm transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500",
                  isDarkMode
                    ? "bg-gray-800 text-white placeholder-gray-400 hover:bg-gray-700 focus:ring-white"
                    : "bg-gray-200 text-gray-900 placeholder-gray-600 focus:ring-blue-500"
                )}
              />
            </form>
            {showSearchResults && (
              <div
                className={cn(
                  "absolute top-full left-0 right-0 mt-1 rounded-md shadow-lg z-10",
                  isDarkMode
                    ? "bg-gray-900 border border-gray-800"
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
          <div className="flex items-center space-x-2">
            <SignedIn>
              {/* Create button */}
              <button
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-semibold cursor-pointer flex items-center gap-1",
                  "text-black bg-gray-200 hover:bg-gray-300"
                )}
              >
                <IconWrapper size="sm">
                  <PlusIcon />
                </IconWrapper>
                Create
              </button>

              {/* Advertise on Reddit icon */}
              <div className="relative">
                <button
                  className={cn(
                    "p-2 rounded-md cursor-pointer",
                    isDarkMode
                      ? "text-gray-400 hover:text-white hover:bg-gray-900"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <IconWrapper size="md">
                    <AdvertiseIconSvg />
                  </IconWrapper>
                </button>
              </div>

              {/* Chat icon with notification badge */}
              <div className="relative">
                <button
                  className={cn(
                    "p-2 rounded-md cursor-pointer",
                    isDarkMode
                      ? "text-gray-400 hover:text-white hover:bg-gray-900"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <IconWrapper size="md">
                    <ChatIcon />
                  </IconWrapper>
                </button>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  1
                </div>
              </div>

              {/* Notifications icon with badge */}
              <div className="relative">
                <button
                  className={cn(
                    "p-2 rounded-md cursor-pointer",
                    isDarkMode
                      ? "text-gray-400 hover:text-white hover:bg-gray-900"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <IconWrapper size="md">
                    <IconWrapper size="md">
                      <NotificationsIconSvg />
                    </IconWrapper>
                  </IconWrapper>
                </button>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  1
                </div>
              </div>

              {/* User avatar with online status */}
              <div className="relative">
                <button
                  onClick={() => setShowUserSidebar(true)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user?.firstName?.charAt(0) ||
                        user?.username?.charAt(0) ||
                        "U"}
                    </div>
                    {/* Online status indicator */}
                    <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black"></div>
                  </div>
                </button>
              </div>
            </SignedIn>

            <SignedOut>
              {/* Signed out user display */}
              <button
                onClick={() => setShowQRModal(true)}
                className={cn(
                  "px-3 py-2.5 rounded-full text-sm font-semibold cursor-pointer flex items-center gap-2",
                  "text-black bg-gray-200 hover:bg-gray-300",
                  "hidden sm:flex"
                )}
              >
                <IconWrapper size="md">
                  <QRCodeIcon />
                </IconWrapper>
                Get App
              </button>
              <button
                onClick={handleLoginClick}
                className={cn(
                  "px-4 py-2.5 rounded-full text-sm font-medium cursor-pointer",
                  "bg-orange-700 text-white hover:bg-orange-800"
                )}
              >
                Log In
              </button>
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className={cn(
                    "p-2 rounded-full cursor-pointer",
                    "text-gray-500 hover:text-gray-800 hover:bg-gray-300"
                  )}
                >
                  <IconWrapper size="md">
                    <MoreIcon />
                  </IconWrapper>
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-2">
                      <button
                        onClick={handleLoginMenuClick}
                        className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <IconWrapper size="md" className="mr-3">
                          <LogInOutIcon />
                        </IconWrapper>
                        <span className="text-sm font-medium">
                          Log In / Sign Up
                        </span>
                      </button>
                      <button className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <IconWrapper size="md" className="mr-3">
                          <AdvertiseIconSvg />
                        </IconWrapper>
                        <span className="text-sm font-medium">
                          Advertise on Reddit
                        </span>
                      </button>
                      <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-normal rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <div className="flex items-center">
                          <IconWrapper size="md" className="mr-3">
                            <RedditProBetaSvg />
                          </IconWrapper>
                          <span>
                            Try Reddit Pro{" "}
                            <span className="text-xs font-semibold ml-1 text-orange-700 dark:text-orange-400">
                              BETA
                            </span>
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
      <QRCodeModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />
      <UserSidebar
        isOpen={showUserSidebar}
        onClose={() => setShowUserSidebar(false)}
      />
    </header>
  );
};
