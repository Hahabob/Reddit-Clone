import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../contexts/ThemeContext";
import CardIcon from "../../assets/card-icon.svg";
import CompactIcon from "../../assets/compact-icon.svg";

interface ViewOption {
  value: "card" | "compact";
  label: string;
  icon: React.ReactNode;
}

const viewOptions: ViewOption[] = [
  {
    value: "card",
    label: "Card",
    icon: <CardIcon />,
  },
  {
    value: "compact",
    label: "Compact",
    icon: <CompactIcon />,
  },
];

interface ViewDropdownProps {
  currentView: "card" | "compact";
  onViewChange: (view: "card" | "compact") => void;
}

const ChevronDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);

export const ViewDropdown: React.FC<ViewDropdownProps> = ({
  currentView,
  onViewChange,
}) => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentOption =
    viewOptions.find((option) => option.value === currentView) ||
    viewOptions[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleViewChange = (view: typeof currentView) => {
    onViewChange(view);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tooltip */}
      {showTooltip && !isOpen && (
        <div className="absolute -top-12 left-12 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-black text-white text-xs font-bold px-3 py-2 rounded-md shadow-lg whitespace-nowrap font-sans">
            Change post view
            <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
          </div>
        </div>
      )}

      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          "flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-medium",
          isDarkMode
            ? "text-gray-400 hover:bg-gray-800"
            : "text-gray-500 hover:bg-gray-300"
        )}
      >
        <span>{currentOption.icon}</span>
        <ChevronDownIcon />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-32 z-50">
          <div
            className={cn(
              "rounded-md shadow-lg border overflow-hidden",
              isDarkMode
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            )}
          >
            {/* Header */}
            <div className="px-3 py-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                )}
              >
                View
              </span>
            </div>

            {/* Options */}
            <div className="py-1">
              {viewOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleViewChange(option.value)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm transition-colors duration-150 focus:outline-none",
                    isDarkMode
                      ? "text-white hover:bg-gray-800"
                      : "text-black hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <span>{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
