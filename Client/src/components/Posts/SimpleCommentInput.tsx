import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/utils";
import CommentEditor from "./CommentEditor";

interface SimpleCommentInputProps {
  onSubmit: (content: string) => void;
  isLoading?: boolean;
  userAvatar?: string;
  username?: string;
  shouldReset?: boolean;
}

const SimpleCommentInput: React.FC<SimpleCommentInputProps> = ({
  onSubmit,
  isLoading = false,
  userAvatar,
  username,
  shouldReset = false,
}) => {
  const { isDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset the input when shouldReset prop changes to true
  React.useEffect(() => {
    if (shouldReset) {
      setIsExpanded(false);
    }
  }, [shouldReset]);

  const handleSubmit = (content: string) => {
    onSubmit(content);
  };

  const handleCancel = () => {
    setIsExpanded(false);
  };

  if (isExpanded) {
    return (
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={username || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={cn(
                  "w-full h-full flex items-center justify-center text-sm font-medium",
                  isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                {username ? username[0].toUpperCase() : "U"}
              </div>
            )}
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}
          >
            Comment as u/{username || "username"}
          </span>
        </div>
        <CommentEditor
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          placeholder="What are your thoughts?"
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={username || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "w-full h-full flex items-center justify-center text-sm font-medium",
                isDarkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {username ? username[0].toUpperCase() : "U"}
            </div>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(true)}
          className={cn(
            "flex-1 px-4 py-3 rounded-full text-left text-sm border transition-colors",
            isDarkMode
              ? "bg-black border-gray-600 text-gray-400 hover:border-gray-500 focus:border-blue-500"
              : "bg-white border-gray-300 text-gray-500 hover:border-gray-400 focus:border-blue-500"
          )}
        >
          Join the conversation
        </button>
        <div className="flex items-center space-x-2">
          <button
            className={cn(
              "p-2 rounded-full transition-colors",
              isDarkMode
                ? "text-gray-400 hover:bg-gray-800"
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </button>
          <button
            className={cn(
              "p-2 rounded-full transition-colors",
              isDarkMode
                ? "text-gray-400 hover:bg-gray-800"
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleCommentInput;
