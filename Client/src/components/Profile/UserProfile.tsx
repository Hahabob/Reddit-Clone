import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import wonderingSnoo from "../../assets/wonderingSnoo.png";
import defaultAvatar from "../../assets/defaultAvatar.png";
import CameraIcon from "../../assets/cameraIcon.svg";

interface ProfileTab {
  id: string;
  label: string;
  active: boolean;
}

export const UserProfile: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState("overview");
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

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="text-center py-16">
            <div className="mb-8">
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
      case "comments":
        return (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto flex items-center justify-center">
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
              <div className="w-20 h-20 mx-auto flex items-center justify-center">
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
              <div className="w-20 h-20 mx-auto flex items-center justify-center">
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
              <div className="w-20 h-20 mx-auto flex items-center justify-center">
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
              <div className="w-20 h-20 mx-auto flex items-center justify-center">
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
              <div className="w-20 h-20 mx-auto flex items-center justify-center">
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
              <div className="w-20 h-20 mx-auto flex items-center justify-center">
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
      <div
        className={`${
          isDarkMode ? "bg-transparent" : "bg-white"
        } rounded-lg shadow-sm mb-4 overflow-hidden`}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <div className="w-18 h-18 rounded-full p-2 items-center bg-gray-800">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={defaultAvatar}
                  alt="User Avatar"
                  className="w-full h-full"
                />
              </div>
            </div>
            <button className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center -ml-8 mt-12">
              <CameraIcon />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-300">{username}</h1>
              <p className="text-sm text-gray-400 font-medium">u/{username}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`py-2 px-1 font-medium text-sm ${
                  tab.active
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing all content
          </div>
          <button
            className={`px-4 py-2 rounded-full font-medium text-sm ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            + Create Post
          </button>
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-transparent" : "bg-white"
        } rounded-lg shadow-sm`}
      >
        {renderContent()}
      </div>
    </div>
  );
};
