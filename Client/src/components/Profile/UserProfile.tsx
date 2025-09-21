import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import wonderingSnoo from "../../assets/wonderingSnoo.png";
import defaultAvatar from "../../assets/defaultAvatar.png";
import CameraIcon from "../../assets/cameraIcon.svg";
import EyeIcon from "../../assets/eyeIcon.svg";
import RightArrowIcon from "../../assets/rightArrowIcon.svg";

interface ProfileTab {
  id: string;
  label: string;
  active: boolean;
}

export const UserProfile: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("New");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tabs: ProfileTab[] = [
    { id: "overview", label: "Overview", active: activeTab === "overview" },
    { id: "posts", label: "Posts", active: activeTab === "posts" },
    { id: "comments", label: "Comments", active: activeTab === "comments" },
    { id: "saved", label: "Saved", active: activeTab === "saved" },
    { id: "history", label: "History", active: activeTab === "history" },
    { id: "hidden", label: "Hidden", active: activeTab === "hidden" },
    { id: "upvoted", label: "Upvoted", active: activeTab === "upvoted" },
    { id: "downvoted", label: "Downvoted", active: activeTab === "downvoted" },
  ];
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="text-center py-16">
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto flex items-center justify-center">
                <img
                  src={wonderingSnoo}
                  alt="Snoo wondering"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                u/{username} hasn't posted yet
              </h3>
            </div>
          </div>
        );
      case "posts":
        return (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto">
                <img
                  src={wonderingSnoo}
                  alt="Snoo wondering"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                u/{username} hasn't posted yet
              </h3>
            </div>
          </div>
        );
      case "comments":
        return (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto">
                <img
                  src={wonderingSnoo}
                  alt="Snoo wondering"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                u/{username} hasn't commented yet
              </h3>
            </div>
          </div>
        );
      case "saved":
        return (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto">
                <img
                  src={wonderingSnoo}
                  alt="Snoo wondering"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                u/{username} hasn't saved anything yet
              </h3>
            </div>
          </div>
        );
      case "history":
        return (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto">
                <img
                  src={wonderingSnoo}
                  alt="Snoo wondering"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                u/{username} hasn't viewed anything yet
              </h3>
            </div>
          </div>
        );
      case "hidden":
        return (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto">
                <img
                  src={wonderingSnoo}
                  alt="Snoo wondering"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                u/{username} hasn't hidden anything yet
              </h3>
            </div>
          </div>
        );
      case "upvoted":
        return (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto">
                <img
                  src={wonderingSnoo}
                  alt="Snoo wondering"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                u/{username} hasn't upvoted anything yet
              </h3>
            </div>
          </div>
        );
      case "downvoted":
        return (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto">
                <img
                  src={wonderingSnoo}
                  alt="Snoo wondering"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                u/{username} hasn't downvoted anything yet
              </h3>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto">
                <img
                  src={wonderingSnoo}
                  alt="Snoo wondering"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                u/{username} hasn't {activeTab} yet
              </h3>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-4 ml-10">
          <div className="w-18 h-18 rounded-full p-2 items-center bg-gray-200 dark:bg-gray-800">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img
                src={defaultAvatar}
                alt="User Avatar"
                className="w-full h-full"
              />
            </div>
          </div>
          <button className="w-8 h-7 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center -ml-9 mt-12 cursor-pointer">
            <CameraIcon />
          </button>
          <div>
            <h1 className="text-2xl font-bold dark:text-gray-300">
              {username}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              u/{username}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <nav className="-mb-px flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`py-3 px-5 font-medium text-xs rounded-full cursor-pointer ${
                  tab.active
                    ? "text-black bg-gray-300 dark:text-gray-200 dark:bg-gray-700 rounded-full underline-offset-4 hover:underline"
                    : "text-black hover:text-gray-700 dark:text-gray-200 dark:hover:text-white underline-offset-4 hover:underline"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-gray-100 hover:bg-gray-200 dark:bg-black dark:hover:bg-[#0d0d0f] rounded-md pl-4 pr-4 py-3 cursor-pointer -mb-4">
          <div className="flex items-center justify-between text-xs text-gray-800 dark:text-gray-300">
            <div className="flex items-center">
              <EyeIcon />
              <span className="ml-2">Showing all content</span>
            </div>
            <RightArrowIcon />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-8">
        <button
          className={`px-2 h-7 rounded-full cursor-pointer flex items-center ${
            isDarkMode
              ? "bg-black border-4 border-gray-400 text-gray-300 hover:border-white hover:text-white"
              : "bg-white border-4 border-gray-500 hover:border-black text-black"
          }`}
        >
          <span className="text-2xl font-thin mr-1 mb-1">+</span>
          <span className="font-medium mt-1 text-[10px]">Create Post</span>
        </button>

        <div className="relative group" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`px-2 h-7 rounded-full text-xs font-medium flex items-center cursor-pointer ${
              isDropdownOpen
                ? "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                : "hover:bg-gray-300 dark:bg-transparent dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300"
            }`}
          >
            {selectedSort}
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white dark:bg-white dark:text-black font-medium` text-xs rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            Open sort options
            <div className="absolute top-full left-1/2 transform -translate-x-1/2  w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-black dark:border-t-white"></div>
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-17 bg-white dark:bg-[#181819] rounded-sm shadow-xl z-10">
              <div className="py-1">
                <div className="px-3 py-1 text-xs font-bold text-gray-700 dark:text-gray-400">
                  Sort by
                </div>
                <button
                  onClick={() => {
                    setSelectedSort("Hot");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium cursor-pointer ${
                    selectedSort === "Hot"
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 dark:hover:text-gray-100"
                  }`}
                >
                  Hot
                </button>
                <button
                  onClick={() => {
                    setSelectedSort("New");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium cursor-pointer ${
                    selectedSort === "New"
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 dark:hover:text-gray-100"
                  }`}
                >
                  New
                </button>
                <button
                  onClick={() => {
                    setSelectedSort("Top");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium cursor-pointer ${
                    selectedSort === "Top"
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 dark:hover:text-gray-100"
                  }`}
                >
                  Top
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <hr className="my-3 -mx-25 ml-10 border-gray-200 dark:border-[#ffffff19]" />

      <div className="rounded-lg -mt-16">{renderContent()}</div>
    </div>
  );
};
