import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import CameraIcon from "../../assets/cameraIcon.svg";

interface ProfileSidebarProps {
  username: string;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ username }) => {
  const { isDarkMode } = useTheme();
  const achievements = [
    { name: "Banana Enthusiast", icon: "🍌" },
    { name: "Banana Baby", icon: "🍌" },
    { name: "Banana Beginner", icon: "🍌" },
  ];
  const settings = [
    { name: "Profile", description: "Customize your profile" },
    {
      name: "Curate your profile",
      description: "Manage what people see when they visit your profile",
    },
    { name: "Avatar", description: "Style your avatar" },
    { name: "Mod Tools", description: "Moderate your profile" },
  ];

  return (
    <div className="w-70 space-y-4">
      {/* Profile Banner */}
      <div
        className={`${
          isDarkMode ? "bg-transparent" : "bg-white"
        } rounded-lg shadow-sm overflow-hidden`}
      >
        <div className="h-30 bg-gradient-to-b from-blue-900 to-black relative">
          <button className="absolute bottom-4 right-2 p-2 bg-gray-800 rounded-full">
            <CameraIcon />
          </button>
        </div>
        <div className="p-4 -mt-10 relative">
          <div className="flex items-end justify-between mb-8"></div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {username}
          </h2>
          <button
            className={`px-4 py-1 rounded-full text-sm mb-4 font-medium ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Share
          </button>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex justify-between">
              <span>0 followers</span>
            </div>
            <div className="flex justify-between">
              <span>1 Karma</span>
              <span>0 Contributions</span>
            </div>
            <div className="flex justify-between">
              <span>2m Reddit Age</span>
              <span>0 Active in &gt;</span>
            </div>
            <div className="flex justify-between">
              <span>0 Gold earned</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-transparent" : "bg-white"
        } rounded-lg shadow-sm p-4`}
      >
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          ACHIEVEMENTS
        </h3>
        <div className="flex space-x-2 mb-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm"
            >
              {achievement.icon}
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          Banana Enthusiast, Banana Baby, Banana Beginner, +8 more
        </div>
        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
          <span>6 unlocked</span>
          <button className="text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </button>
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-transparent" : "bg-white"
        } rounded-lg shadow-sm p-4`}
      >
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          SETTINGS
        </h3>
        <div className="space-y-3">
          {settings.map((setting, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {setting.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {setting.description}
                </div>
              </div>
              <button
                className={`px-3 py-1 rounded text-xs font-medium ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Update
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-transparent" : "bg-white"
        } rounded-lg shadow-sm p-4`}
      >
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          SOCIAL LINKS
        </h3>
        <button
          className={`w-full py-2 px-3 rounded text-sm font-medium ${
            isDarkMode
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          + Add Social Link
        </button>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div className="flex flex-wrap gap-x-2">
          <a href="#" className="hover:underline">
            Reddit Rules
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            User Agreement
          </a>
          <a href="#" className="hover:underline">
            Accessibility
          </a>
        </div>
        <div>Reddit, Inc. © 2025. All rights reserved.</div>
      </div>
    </div>
  );
};
