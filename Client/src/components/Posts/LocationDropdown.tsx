import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../contexts/ThemeContext";

interface LocationOption {
  value: string;
  label: string;
}

const locationOptions: LocationOption[] = [
  {
    value: "everywhere",
    label: "Everywhere",
  },
  {
    value: "united-states",
    label: "United States",
  },
  {
    value: "argentina",
    label: "Argentina",
  },
  {
    value: "australia",
    label: "Australia",
  },
  {
    value: "bulgaria",
    label: "Bulgaria",
  },
  {
    value: "canada",
    label: "Canada",
  },
  {
    value: "israel",
    label: "Israel",
  },
  {
    value: "germany",
    label: "Germany",
  },
  {
    value: "france",
    label: "France",
  },
  {
    value: "united-kingdom",
    label: "United Kingdom",
  },
];

interface LocationDropdownProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
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

export const LocationDropdown: React.FC<LocationDropdownProps> = ({
  currentLocation,
  onLocationChange,
}) => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentOption =
    locationOptions.find((option) => option.value === currentLocation) ||
    locationOptions[0];

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

  const handleLocationChange = (location: string) => {
    onLocationChange(location);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {showTooltip && !isOpen && (
        <div className="absolute -top-12 left-12 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-black text-white text-xs font-bold px-3 py-2 rounded-md shadow-lg whitespace-nowrap font-sans">
            Change location filter
            <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
          </div>
        </div>
      )}

      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          "flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-medium transition-colors",
          isDarkMode
            ? "text-gray-400 hover:bg-gray-800"
            : "text-gray-500 hover:bg-gray-300"
        )}
      >
        <span>{currentOption.label}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 z-50">
          <div
            className={cn(
              "rounded-md shadow-lg border overflow-hidden max-h-32 overflow-y-auto",
              isDarkMode
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            )}
          >
            <div className="px-3 py-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-gray-300" : "text-black"
                )}
              >
                Location
              </span>
            </div>

            <div className="py-1">
              {locationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleLocationChange(option.value)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm transition-colors duration-150 focus:outline-none",
                    isDarkMode
                      ? "text-white hover:bg-gray-800"
                      : "text-black hover:bg-gray-100",
                    currentLocation === option.value
                      ? isDarkMode
                        ? "bg-gray-800"
                        : "bg-gray-100"
                      : ""
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
