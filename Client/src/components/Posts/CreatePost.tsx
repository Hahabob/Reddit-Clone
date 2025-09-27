import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/utils";
import defaultAvatar from "../../assets/defaultAvatar.png";
import UploadPicIcon from "../../assets/uploadPicIcon.svg";
import LinkIcon from "../../assets/link-icon.svg";
import ImageAddIcon from "../../assets/image-add-icon.svg";
import VideoIcon from "../../assets/videoIcon.svg";
import BulletListIcon from "../../assets/bulletListIcon.svg";
import NumberListIcon from "../../assets/numberListIcon.svg";
import SpoilerAlertIcon from "../../assets/spoilerAlertIcon.svg";
import QuoteBlockIcon from "../../assets/quoteBlockIcon.svg";

const CreatePost: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "text" | "images" | "link" | "poll"
  >("text");
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    };
  }, [tooltipTimeout]);

  const TooltipWrapper = ({
    children,
    tooltipText,
    buttonId,
  }: {
    children: React.ReactNode;
    tooltipText: string;
    buttonId: string;
  }) => {
    const handleMouseEnter = () => {
      // Clear any existing timeout
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
      // Set new timeout for 2 seconds
      const timeout = setTimeout(() => {
        setShowTooltip(buttonId);
      }, 1500);
      setTooltipTimeout(timeout);
    };

    const handleMouseLeave = () => {
      setShowTooltip(null);
      // Clear timeout when mouse leaves
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        setTooltipTimeout(null);
      }
    };

    return (
      <div className="relative">
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {children}
        </div>
        {showTooltip === buttonId && (
          <div
            className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-2 text-xs font-medium rounded whitespace-nowrap z-50 ${
              isDarkMode
                ? "bg-black text-white shadow-[0_2px_8px_2px_rgba(0,0,0,0.6)]"
                : "bg-white text-black shadow-[0_2px_8px_2px_rgba(0,0,0,0.2)]"
            }`}
          >
            {tooltipText}
            <div
              className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-4 ${
                isDarkMode
                  ? "border-black border-l-transparent border-r-transparent border-b-transparent"
                  : "border-white border-l-transparent border-r-transparent border-b-transparent"
              }`}
            />
          </div>
        )}
      </div>
    );
  };

  const handlePost = () => {
    console.log("Creating post:", {
      title,
      linkUrl,
      bodyText,
      type: activeTab,
    });
  };

  const handleSaveDraft = () => {
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
      <div className="flex-1 flex flex-col">
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

          <div className="mb-6">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full cursor-pointer ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <div className="flex items-center">
                <img
                  src={defaultAvatar}
                  alt="User Avatar"
                  className="w-6 h-6 rounded-full overflow-hidden"
                />
              </div>
              <span
                className={`font-medium text-sm ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                u/Commissioninside5439
              </span>
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
            </div>
          </div>
        </div>

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

        {activeTab !== "poll" && (
          <div className="space-y-6">
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className={cn(
                    "w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-white",
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

            <div>
              <div
                className={`border rounded-t-2xl border-b-0 p-1  flex items-center gap-0.5 ${
                  isDarkMode
                    ? "border-gray-600 bg-black"
                    : "border-gray-300 bg-white"
                }`}
              >
                <TooltipWrapper tooltipText="Bold" buttonId="bold">
                  <button className="p-1 hover:bg-gray-200 rounded-full px-2.5 py-0.5 text-gray-500 dark:text-gray-400 font-bold cursor-pointer">
                    B
                  </button>
                </TooltipWrapper>

                <TooltipWrapper tooltipText="Italic" buttonId="italic">
                  <button className="p-1 hover:bg-gray-200 rounded-full px-3 py-0.5 text-gray-500 dark:text-gray-400 font-normal italic cursor-pointer">
                    i
                  </button>
                </TooltipWrapper>

                <TooltipWrapper
                  tooltipText="Strikethrough"
                  buttonId="strikethrough"
                >
                  <button className="p-1 hover:bg-gray-200 rounded-full px-3 py-1 text-gray-500 dark:text-gray-400 font-normal line-through cursor-pointer">
                    S
                  </button>
                </TooltipWrapper>

                <TooltipWrapper
                  tooltipText="Superscript"
                  buttonId="superscript"
                >
                  <button className="p-1 hover:bg-gray-200 rounded-full px-2 py-1 text-gray-500 dark:text-gray-400 font-normal cursor-pointer">
                    X²
                  </button>
                </TooltipWrapper>

                <TooltipWrapper tooltipText="Heading" buttonId="heading">
                  <button className="p-1 hover:bg-gray-200 rounded-full px-1.5 py-1 text-gray-500 dark:text-gray-400 cursor-pointer">
                    <div className="flex items-end gap-1/4">
                      <span className="text-[10px] font-bold leading-none">
                        T
                      </span>
                      <span className="text-[20px] leading-none">T</span>
                    </div>
                  </button>
                </TooltipWrapper>

                <div
                  className={`w-1 h-4 ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-200"
                  }`}
                ></div>

                <TooltipWrapper tooltipText="Link" buttonId="link">
                  <button className="p-2 hover:bg-gray-200 rounded-full text-gray-500 dark:text-gray-400 cursor-pointer font-bold text-md">
                    <LinkIcon />
                  </button>
                </TooltipWrapper>

                <TooltipWrapper tooltipText="Image" buttonId="image">
                  <button className="p-2 hover:bg-gray-200 rounded-full text-gray-500 dark:text-gray-400 cursor-pointer font-bold text-md">
                    <ImageAddIcon />
                  </button>
                </TooltipWrapper>

                <TooltipWrapper tooltipText="Video" buttonId="video">
                  <button className="p-2 hover:bg-gray-200 rounded-full text-gray-500 dark:text-gray-400 cursor-pointer font-bold text-md">
                    <VideoIcon />
                  </button>
                </TooltipWrapper>

                <TooltipWrapper tooltipText="Bullet List" buttonId="bulletList">
                  <button className="p-2 hover:bg-gray-200 rounded-full text-gray-500 dark:text-gray-400 cursor-pointer">
                    <BulletListIcon />
                  </button>
                </TooltipWrapper>

                <TooltipWrapper tooltipText="Number List" buttonId="numberList">
                  <button className="p-2 hover:bg-gray-200 rounded-full text-gray-500 dark:text-gray-400 cursor-pointer">
                    <NumberListIcon />
                  </button>
                </TooltipWrapper>

                <div
                  className={`w-1 h-4 ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-200"
                  }`}
                ></div>

                <TooltipWrapper tooltipText="Spoiler" buttonId="spoiler">
                  <button className="p-2 hover:bg-gray-200 rounded-full text-gray-500 dark:text-gray-400 cursor-pointer">
                    <SpoilerAlertIcon />
                  </button>
                </TooltipWrapper>

                <TooltipWrapper tooltipText="Quote Block" buttonId="quoteBlock">
                  <button className="p-2 hover:bg-gray-200 rounded-full text-gray-500 dark:text-gray-400 cursor-pointer">
                    <QuoteBlockIcon />
                  </button>
                </TooltipWrapper>

                <button className="p-1 hover:bg-gray-200 rounded-full px-2 text-gray-600 dark:text-gray-400 cursor-pointer font-bold text-md">
                  ⋯
                </button>

                <div className="ml-auto">
                  <button className="text-xs font-semibold text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full px-2 py-2 cursor-pointer">
                    Switch to Markdown Editor
                  </button>
                </div>
              </div>

              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Body text (optional)
"
                rows={5}
                className={cn(
                  "w-full text-xs px-3 py-2 border border-t-0 rounded-b-2xl focus:outline-none",
                  isDarkMode
                    ? "bg-black border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-700 placeholder-gray-500"
                )}
              />
            </div>

            <div className="flex justify-end gap-3 -mt-6">
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
