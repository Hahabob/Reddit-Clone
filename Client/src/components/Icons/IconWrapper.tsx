import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const IconWrapper: React.FC<IconWrapperProps> = ({
  children,
  className = "",
  size = "md",
}) => {
  const { isDarkMode } = useTheme();

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${className} ${
        isDarkMode ? "text-white" : "text-gray-800"
      }`}
      style={{
        filter: isDarkMode ? "brightness(0) invert(1)" : "none",
      }}
    >
      {children}
    </div>
  );
};
