import React, { useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import EditAvatarIcon from "../../assets/EditAvatarIcon.svg";
import DraftsIcon from "../../assets/drafts-icon.svg";
import TrophyIcon from "../../assets/achievements-icon.svg";
import TrendingUpIcon from "../../assets/earn-icon.svg";
import GiftIcon from "../../assets/PremiumIcon.svg";
import MoonIcon from "../../assets/DarkModeIcon.svg";
import LogOutIcon from "../../assets/Log-In-out-icon.svg";
import BarChartIcon from "../../assets/advertise-rightBar.svg";
import LineChartIcon from "../../assets/reddit-pro-logo.svg";
import SettingsIcon from "../../assets/settings-community-logo.svg";
import DefaultAvatar from "../../assets/defaultAvatar.png";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleViewProfile = () => {
    if (user?.username) {
      const profileUrl = `/user/${user.username}`;
      navigate(profileUrl);
      onClose();
    } else if (user?.firstName) {
      const profileUrl = `/user/${user.firstName}`;
      navigate(profileUrl);
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 pointer-events-none" onClick={onClose} />
      <div
        ref={sidebarRef}
        className={cn(
          "fixed top-17 right-0 z-50 w-72 max-h-150 overflow-y-auto transform transition-all duration-300 ease-in-out rounded-lg shadow-lg pointer-events-auto",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
          isDarkMode ? "bg-[#181c1f]" : "bg-white",
          "shadow-lg",
          isDarkMode ? "shadow-transparent" : "shadow-gray-500"
        )}
      >
        <div className="p-4">
          <button
            onClick={handleViewProfile}
            className="w-full flex items-center space-x-2 mb-4 py-2 text-sm font-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-transparent transition-colors text-left text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative before:absolute before:inset-0 before:-left-4 before:-right-4 before:bg-gray-100 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none before:z-0"
          >
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={DefaultAvatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black"></div>
            </div>
            <div className="relative z-10">
              <div className="text-sm text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                View Profile
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                u/{user?.username || user?.firstName}
              </div>
            </div>
          </button>
          <div className="space-y-0.5">
            <button
              className={cn(
                "px-2 mb-2 w-full flex items-center py-2 text-sm font-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-transparent transition-colors text-left text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative before:absolute before:inset-0 before:-left-4 before:-right-4 before:bg-gray-100 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none before:z-0"
              )}
            >
              <div className="w-5 h-5 mr-3 relative z-10">
                <EditAvatarIcon />
              </div>
              <span className="relative z-10">Edit Avatar</span>
            </button>

            <button
              className={cn(
                "px-2 w-full flex items-center py-2 text-sm font-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-transparent transition-colors text-left text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative before:absolute before:inset-0 before:-left-4 before:-right-4 before:bg-gray-100 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none before:z-0"
              )}
            >
              <div className="w-5 h-5 mr-3 relative z-10">
                <DraftsIcon />
              </div>
              <span className="relative z-10">Drafts</span>
            </button>

            <button
              className={cn(
                "px-2 w-full flex items-center py-2 text-sm font-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-transparent transition-colors text-left text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative before:absolute before:inset-0 before:-left-4 before:-right-4 before:bg-gray-100 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none before:z-0"
              )}
            >
              <div className="w-5 h-5 mr-3 relative z-10">
                <TrophyIcon />
              </div>
              <div className="flex flex-col relative z-10">
                <span>Achievements</span>
                <span className="text-xs">6 unlocked</span>
              </div>
            </button>

            <button
              className={cn(
                "px-2 w-full flex items-center py-2 text-sm font-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-transparent transition-colors text-left text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative before:absolute before:inset-0 before:-left-4 before:-right-4 before:bg-gray-100 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none before:z-0"
              )}
            >
              <div className="w-5 h-5 mr-3 relative z-10">
                <TrendingUpIcon />
              </div>
              <div className="flex flex-col relative z-10">
                <span>Earn</span>
                <span className="text-xs">Earn cash on Reddit</span>
              </div>
            </button>

            <button
              className={cn(
                "px-2 w-full flex items-center py-2 text-sm font-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-transparent transition-colors text-left text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative before:absolute before:inset-0 before:-left-4 before:-right-4 before:bg-gray-100 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none before:z-0"
              )}
            >
              <div className="w-5 h-5 mr-3 relative z-10">
                <GiftIcon />
              </div>
              <span className="relative z-10">Premium</span>
            </button>

            <button
              onClick={toggleTheme}
              className={cn(
                "px-2 w-full flex items-center justify-between py-2 text-sm font-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-transparent transition-colors text-left text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative before:absolute before:inset-0 before:-left-4 before:-right-4 before:bg-gray-100 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none before:z-0"
              )}
            >
              <div className="flex items-center relative z-10">
                <div className="w-5 h-5 mr-3">
                  <MoonIcon />
                </div>
                <span>Dark Mode</span>
              </div>
              <div
                className={cn(
                  "w-9 h-6 rounded-full transition-colors cursor-pointer",
                  isDarkMode ? "bg-blue-500" : "bg-gray-200"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 bg-white rounded-full transition-transform mt-0.5 flex items-center justify-center",
                    isDarkMode ? "translate-x-4" : "translate-x-0.5"
                  )}
                >
                  {isDarkMode && (
                    <svg
                      className="w-3 h-3 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>

            <button
              onClick={() => signOut()}
              className={cn(
                "px-2 w-full flex items-center py-2 text-sm font-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-transparent transition-colors text-left text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative before:absolute before:inset-0 before:-left-4 before:-right-4 before:bg-gray-100 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none before:z-0"
              )}
            >
              <div className="w-5 h-5 mr-3 relative z-10">
                <LogOutIcon />
              </div>
              <span className="relative z-10">Log Out</span>
            </button>
          </div>

          <hr className="my-3 -mx-3 border-gray-200 dark:border-[#ffffff19]" />
          <div className="space-y-0.5">
            <button
              className={cn(
                "px-2 w-full flex items-center py-2 text-sm font-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-transparent transition-colors text-left text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative before:absolute before:inset-0 before:-left-4 before:-right-4 before:bg-gray-100 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none before:z-0"
              )}
            >
              <div className="w-5 h-5 mr-3 relative z-10">
                <BarChartIcon />
              </div>
              <span className="relative z-10">Advertise on Reddit</span>
            </button>

            <button
              className={cn(
                "px-2 w-full flex items-center py-2 text-sm font-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-transparent transition-colors text-left text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative before:absolute before:inset-0 before:-left-4 before:-right-4 before:bg-gray-100 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none before:z-0"
              )}
            >
              <div className="w-5 h-5 mr-3 relative z-10">
                <LineChartIcon />
              </div>
              <div className="flex items-center relative z-10">
                <span>Try Reddit Pro</span>
                <span className="ml-2 text-sm font-semibold text-orange-600 dark:text-orange-700">
                  BETA
                </span>
              </div>
            </button>
            <hr className="my-3 -mx-3 border-gray-200 dark:border-[#ffffff19]" />

            <button
              className={cn(
                "px-2 w-full flex items-center py-2 text-sm font-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-transparent transition-colors text-left text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative before:absolute before:inset-0 before:-left-4 before:-right-4 before:bg-gray-100 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none before:z-0"
              )}
            >
              <div className="w-5 h-5 mr-3 relative z-10">
                <SettingsIcon />
              </div>
              <span className="relative z-10">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
