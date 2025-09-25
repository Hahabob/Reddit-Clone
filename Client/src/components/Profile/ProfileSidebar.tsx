import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import CameraIcon from "../../assets/cameraIcon.svg";
import ShareIcon from "../../assets/share-icon.svg";
import bananaMedal from "../../assets/BananaAchivement.webp";
import EditAvatarIcon from "../../assets/EditAvatarIcon.svg";
import defaultAvatar from "../../assets/defaultAvatar.png";
import EyeIcon from "../../assets/eyeIcon.svg";
import ShieldIcon from "../../assets/shieldIcon.svg";

interface ProfileSidebarProps {
  username: string;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ username }) => {
  const { isDarkMode } = useTheme();

  const settings = [
    {
      icon: (
        <img
          src={defaultAvatar}
          alt="User Avatar"
          className="w-8 h-8 rounded-full overflow-hidden"
        />
      ),
      name: "Profile",
      description: "Customize your profile",
    },
    {
      icon: (
        <div className="w-5 h-5">
          <EyeIcon />
        </div>
      ),
      name: "Curate your profile",
      description: "Manage what people see when they visit your profile",
    },
    {
      icon: (
        <div className="w-5 h-5">
          <EditAvatarIcon />
        </div>
      ),
      name: "Avatar",
      description: "Style your avatar",
    },
    {
      icon: (
        <div className="w-5 h-5">
          <ShieldIcon />
        </div>
      ),
      name: "Mod Tools",
      description: "Moderate your profile",
    },
  ];

  return (
    <div>
      <div className="w-70 bg-gray-100 dark:bg-gray-900 rounded-b-2xl overflow-hidden">
        <div className={`${isDarkMode ? "bg-transparent" : "bg-gray-100"}`}>
          <div className="h-25 bg-gradient-to-b from-blue-900 to-black rounded-t-lg relative">
            <button className="absolute bottom-4 right-2 p-2 bg-gray-300 dark:bg-gray-800 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 cursor-pointer">
              <CameraIcon />
            </button>
          </div>
          <div className="p-4 -mt-10 relative">
            <div className="flex items-end justify-between mb-8"></div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {username}
            </h2>
            <button
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] mb-4 font-medium cursor-pointer ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-black"
              }`}
            >
              <span className="w-3 h-3 flex items-center justify-center">
                <ShareIcon />
              </span>
              Share
            </button>
            <div className="flex font-bold text-xs text-gray-600 dark:text-gray-400 mb-2">
              <span>0 followers</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex flex-col">
                <span className="font-semibold dark:text-white text-black">
                  1
                </span>
                <span>Karma</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold dark:text-white text-black">
                  0
                </span>
                <span>Contributions</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold dark:text-white text-black">
                  2 d
                </span>
                <span>Reddit Age</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold dark:text-white text-black">
                  0
                </span>
                <span>Active in &gt;</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold dark:text-white text-black">
                  0
                </span>
                <span>Gold earned</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="-mt-4 my-3 mx-3 border-gray-200 dark:border-[#ffffff19]" />
        <div className={`${isDarkMode ? "bg-transparent" : "bg-gray-100"} p-4`}>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-white mb-3 -mt-4">
            ACHIEVEMENTS
          </h3>
          <div className="flex items-center mb-2">
            <div className="relative w-20 h-15 ">
              <img
                src={bananaMedal}
                alt="Banana Enthusiast"
                className="w-9 h-9 rounded-full border-1 border-white absolute z-30 cursor-pointer"
              />
              <img
                src={bananaMedal}
                alt="Banana Baby"
                className="w-9 h-9 rounded-full border-1 border-white absolute z-20 cursor-pointer"
                style={{ left: "33%" }}
              />
              <img
                src={bananaMedal}
                alt="Banana Beginner"
                className="w-9 h-9 rounded-full border-1 border-white absolute z-10 cursor-pointer"
                style={{ left: "66%" }}
              />
            </div>
            <div className="ml-10 text-[10px] text-gray-600 dark:text-gray-400">
              Banana Enthusiast,
              <div>Banana Baby,</div>
              <div>Banana Beginner, +3 more</div>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
            <span>6 unlocked</span>
            <button
              className={`px-3 py-2 rounded-full text-xs font-medium cursor-pointer ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white hover:underline"
                  : "bg-gray-200 hover:bg-gray-300 text-black hover:underline"
              }`}
            >
              View All
            </button>
          </div>
        </div>

        <hr className="-mt-1 my-3 mx-3 border-gray-200 dark:border-[#ffffff19]" />
        <div className={`${isDarkMode ? "bg-transparent" : "bg-gray-100"} p-4`}>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-white mb-4 -mt-3">
            SETTINGS
          </h3>
          <div className="space-y-6">
            {settings.map((setting, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  {setting.icon && <span className="mr-3">{setting.icon}</span>}
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {setting.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {setting.description}
                    </div>
                  </div>
                </div>
                <button
                  className={`px-3 py-2 rounded-full text-xs font-medium cursor-pointer ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-black hover:underline"
                  }`}
                >
                  Update
                </button>
              </div>
            ))}
          </div>
        </div>

        <hr className="-mt-1 my-3 mx-3 border-gray-200 dark:border-[#ffffff19]" />
        <div
          className={`${
            isDarkMode ? "bg-transparent" : "bg-gray-100"
          } p-4 -mt-3`}
        >
          <h3 className="text-sm font-semibold text-gray-500 dark:text-white mb-4">
            SOCIAL LINKS
          </h3>
          <button
            className={`flex items-center justify-center px-3 rounded-full cursor-pointer ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-black"
            }`}
          >
            <span className="text-xl font-normal mr-1.5">+</span>
            <span className="hover:underline text-xs font-medium">
              Add Social Link
            </span>
          </button>
        </div>
      </div>

      <div className="p-4 text-xs text-gray-500 font-normal dark:text-gray-400 space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <a href="#" className="hover:text-black dark:hover:text-white">
            Reddit Rules
          </a>
          <a href="#" className="hover:text-black dark:hover:text-white">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-black dark:hover:text-white">
            User Agreement
          </a>
          <a href="#" className="hover:text-black dark:hover:text-white">
            Accessibility
          </a>
        </div>
        <div className="mt-2">Reddit, Inc. © 2025. All rights reserved.</div>
      </div>
    </div>
  );
};
