import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/utils";
import LinkIcon from "../../assets/link-icon.svg";
import ImageAddIcon from "../../assets/image-add-icon.svg";
import VideoIcon from "../../assets/videoIcon.svg";
import BulletListIcon from "../../assets/bulletListIcon.svg";
import NumberListIcon from "../../assets/numberListIcon.svg";
import SpoilerAlertIcon from "../../assets/spoilerAlertIcon.svg";
import QuoteBlockIcon from "../../assets/quoteBlockIcon.svg";

interface CommentEditorProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  placeholder?: string;
  initialValue?: string;
  isLoading?: boolean;
  submitButtonText?: string;
}

const CommentEditor: React.FC<CommentEditorProps> = ({
  onSubmit,
  onCancel,
  placeholder = "What are your thoughts?",
  initialValue = "",
  isLoading = false,
  submitButtonText = "Comment",
}) => {
  const { isDarkMode } = useTheme();
  const [content, setContent] = useState(initialValue);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

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
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
      const timeout = setTimeout(() => {
        setShowTooltip(buttonId);
      }, 1000);
      setTooltipTimeout(timeout);
    };

    const handleMouseLeave = () => {
      setShowTooltip(null);
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

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  return (
    <div className="w-full">
      <div>
        <div
          className={`border rounded-t-2xl border-b-0 p-1 flex items-center gap-0.5 ${
            isDarkMode ? "border-gray-600 bg-black" : "border-gray-300 bg-white"
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

          <TooltipWrapper tooltipText="Strikethrough" buttonId="strikethrough">
            <button className="p-1 hover:bg-gray-200 rounded-full px-3 py-1 text-gray-500 dark:text-gray-400 font-normal line-through cursor-pointer">
              S
            </button>
          </TooltipWrapper>

          <TooltipWrapper tooltipText="Superscript" buttonId="superscript">
            <button className="p-1 hover:bg-gray-200 rounded-full px-2 py-1 text-gray-500 dark:text-gray-400 font-normal cursor-pointer">
              X²
            </button>
          </TooltipWrapper>

          <TooltipWrapper tooltipText="Heading" buttonId="heading">
            <button className="p-1 hover:bg-gray-200 rounded-full px-1.5 py-1 text-gray-500 dark:text-gray-400 cursor-pointer">
              <div className="flex items-end gap-1/4">
                <span className="text-[10px] font-bold leading-none">T</span>
                <span className="text-[20px] leading-none">T</span>
              </div>
            </button>
          </TooltipWrapper>

          <div
            className={`w-1 h-4 ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}
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
            className={`w-1 h-4 ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={cn(
            "w-full text-sm px-3 py-2 border border-t-0 rounded-b-2xl focus:outline-none resize-none",
            isDarkMode
              ? "bg-black border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-700 placeholder-gray-500"
          )}
        />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onCancel}
          className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
            isDarkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            !content.trim() || isLoading
              ? isDarkMode
                ? "bg-gray-900 text-gray-600 cursor-not-allowed"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
              : isDarkMode
              ? "bg-blue-800 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-blue-800 text-white hover:bg-blue-900 cursor-pointer"
          )}
        >
          {isLoading ? "Posting..." : submitButtonText}
        </button>
      </div>
    </div>
  );
};

export default CommentEditor;
