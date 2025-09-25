import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/utils";
import defaultAvatar from "../../assets/defaultAvatar.png";
import UploadPicIcon from "../../assets/uploadPicIcon.svg";

const CreatePost: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "text" | "images" | "link" | "poll"
  >("text");
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [bodyText, setBodyText] = useState("");

  const handlePost = () => {
    // TODO: Implement post creation logic
    console.log("Creating post:", {
      title,
      linkUrl,
      bodyText,
      type: activeTab,
    });
  };

  const handleSaveDraft = () => {
    // TODO: Implement draft saving logic
    console.log("Saving draft:", {
      title,
      linkUrl,
      bodyText,
      type: activeTab,
    });
  };

  const tabs = [
    { id: "text", label: "Text" },
    { id: "images", label: "Images & Video" },
    { id: "link", label: "Link" },
    { id: "poll", label: "Poll" },
  ] as const;

  return (
    <div
      className={`w-full max-w-4xl mx-auto min-h-screen flex flex-col ${
        isDarkMode ? "bg-[#0d0d0f]" : "bg-white"
      }`}
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1
              className={`text-2xl font-bold ${
                isDarkMode ? "text-gray-400" : "text-black"
              }`}
            >
              Create post
            </h1>
            <button
              className={`text-sm font-medium px-4 py-2 rounded-full cursor-pointer ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-black hover:text-black  hover:bg-gray-300"
              }`}
            >
              Drafts
            </button>
          </div>

          {/* Community/User Selector */}
          <div className="mb-6">
            <div
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <div className="flex items-center">
                <img
                  src={defaultAvatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full overflow-hidden"
                />
              </div>
              <span
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                u/Commissioninside5439
              </span>
              <svg
                className="w-5 h-5 ml-2"
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
            </div>
          </div>
        </div>

        {/* Post Type Tabs */}
        <div className="mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer",
                activeTab === tab.id
                  ? "border-blue-500 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                  : isDarkMode
                  ? "border-transparent text-white hover:bg-gray-800"
                  : "border-transparent text-black hover:bg-gray-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Poll Tab - Special Message */}
        {activeTab === "poll" && (
          <div
            className={`border rounded-lg p-4 mb-6 ${
              isDarkMode
                ? "border-gray-600 bg-black"
                : "border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium ${
                  isDarkMode
                    ? "ring-1 ring-gray-600 text-gray-300"
                    : "ring-1 ring-black text-black"
                }`}
              >
                i
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  <span className="font-bold">Creating a poll?</span> Polls on
                  the web are under construction, but you can still create one
                  in the Reddit app.{" "}
                  <a
                    href="#"
                    className="text-blue-500 dark:text-blue-400 hover:underline"
                  >
                    Download the app
                  </a>{" "}
                  to get started.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        {activeTab !== "poll" && (
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className={cn(
                    "w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-4 focus:ring-white",
                    isDarkMode
                      ? "bg-black border-gray-600 text-white placeholder-gray-400"
                      : "bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-black placeholder-gray-500"
                  )}
                />
                {title.length === 0 && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <span className="text-red-500 text-sm ml-8">*</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-1 mr-4">
                <span className="text-sm text-gray-700">
                  {title.length}/300
                </span>
              </div>
            </div>

            {/* Tags Field */}
            <div>
              <button
                className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Add tags
              </button>
            </div>

            {/* Link URL Field - Only for Link tab */}
            {activeTab === "link" && (
              <div>
                <div className="relative">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Link URL"
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                      isDarkMode
                        ? "bg-black border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-black placeholder-gray-500"
                    )}
                  />
                  {linkUrl.length === 0 && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      <span className="text-red-500 text-sm ml-17">*</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Media Upload Area - Only for Images tab */}
            {activeTab === "images" && (
              <div
                className={`border-2 border-dashed rounded-lg p-15 text-center  ${
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Drag and Drop or upload media
                  </p>
                  <div className="cursor-pointer bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 dark:bg-gray-800 rounded-full p-2 flex items-center justify-center">
                    <UploadPicIcon />
                  </div>
                </div>
              </div>
            )}

            {/* Body Text Editor */}
            <div>
              {/* Rich Text Editor Toolbar */}
              <div
                className={`border rounded-t-lg border-b-0 p-2 flex items-center gap-2 ${
                  isDarkMode
                    ? "border-gray-600 bg-black"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <button className="p-1 hover:bg-gray-200 rounded">B</button>
                <button className="p-1 hover:bg-gray-200 rounded italic">
                  I
                </button>
                <button className="p-1 hover:bg-gray-200 rounded line-through">
                  S
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">X²</button>
                <button className="p-1 hover:bg-gray-200 rounded">X₂</button>
                <button className="p-1 hover:bg-gray-200 rounded">
                  &lt;/&gt;
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">🔗</button>
                <button className="p-1 hover:bg-gray-200 rounded">📷</button>
                <button className="p-1 hover:bg-gray-200 rounded">▶️</button>
                <button className="p-1 hover:bg-gray-200 rounded">•</button>
                <button className="p-1 hover:bg-gray-200 rounded">1.</button>
                <button className="p-1 hover:bg-gray-200 rounded">"</button>
                <button className="p-1 hover:bg-gray-200 rounded">⎯</button>
                <button className="p-1 hover:bg-gray-200 rounded">⊞</button>
                <button className="p-1 hover:bg-gray-200 rounded">⋯</button>
                <div className="ml-auto">
                  <button className="text-sm text-blue-500 hover:underline">
                    Switch to Markdown Editor
                  </button>
                </div>
              </div>

              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Body text (optional)
"
                rows={8}
                className={cn(
                  "w-full px-3 py-2 border border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y",
                  isDarkMode
                    ? "bg-black border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-black placeholder-gray-500"
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={handleSaveDraft}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
                  title.length > 0 || bodyText.length > 0 || linkUrl.length > 0
                    ? isDarkMode
                      ? "bg-blue-800 text-white hover:bg-blue-700"
                      : "bg-blue-800 text-white hover:bg-blue-900"
                    : isDarkMode
                    ? "bg-gray-900 text-gray-600 "
                    : "bg-gray-100 text-gray-300 "
                }`}
              >
                Save Draft
              </button>
              <button
                onClick={handlePost}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
                  title.length > 0 || bodyText.length > 0 || linkUrl.length > 0
                    ? isDarkMode
                      ? "bg-blue-800 text-white hover:bg-blue-700"
                      : "bg-blue-800 text-white hover:bg-blue-900"
                    : isDarkMode
                    ? "bg-gray-900 text-gray-600"
                    : "bg-gray-100 text-gray-300 "
                }`}
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-8 mb-8">
        <div className="flex flex-wrap gap-2 text-sm">
          <a
            href="#"
            className={`${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:underline cursor-pointer"
                : "text-gray-600 hover:text-black hover:underline cursor-pointer"
            }`}
          >
            Reddit Rules
          </a>
          <a
            href="#"
            className={`${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:underline cursor-pointer"
                : "text-gray-600 hover:text-black hover:underline cursor-pointer"
            }`}
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className={`${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:underline cursor-pointer"
                : "text-gray-600 hover:text-black hover:underline cursor-pointer"
            }`}
          >
            User Agreement
          </a>
          <a
            href="#"
            className={`${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:underline cursor-pointer"
                : "text-gray-600 hover:text-black hover:underline cursor-pointer"
            }`}
          >
            Accessibility
          </a>
          <div
            className={`text-sm ${
              isDarkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            <span className="font-bold"> · </span>
            <span className="ml-1">
              Reddit, Inc. © 2025. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreatePost;
