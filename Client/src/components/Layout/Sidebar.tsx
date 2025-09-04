import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/utils";
import HomeSvg from "../../assets/home-icon.svg";
import PopularSvg from "../../assets/popular-logo.svg";
import AllSvg from "../../assets/all-logo.svg";
import AboutRedditSvg from "../../assets/about-reddit-logo.svg";
import AdvertiseSvg from "../../assets/advertise-icon.svg";
import RedditProBetaSvg from "../../assets/reddit-pro-logo.svg";
import HelpSvg from "../../assets/help-logo.svg";
import BlogSvg from "../../assets/blog-logo.svg";
import CareersSvg from "../../assets/careers-logo.svg";
import PressSvg from "../../assets/press-logo.svg";
import AnswersSvg from "../../assets/answer-logo.svg";

interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const IconWrapper: React.FC<IconWrapperProps> = ({
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
      className={cn(
        sizeClasses[size],
        className,
        isDarkMode ? "text-white" : "text-gray-800"
      )}
      style={{
        filter: isDarkMode ? "brightness(0) invert(1)" : "none",
      }}
    >
      {children}
    </div>
  );
};

// SVG Icons - using project assets via SVGR
const HomeIcon = () => <HomeSvg className="w-5 h-5" />;

const PopularIcon = () => <PopularSvg />;

const AllIcon = () => <AllSvg />;

const AnswersIcon = () => <AnswersSvg />;

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18,15 12,9 6,15" />
  </svg>
);

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string | React.ReactNode;
  hasDropdown?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  hasDropdown = false,
  isExpanded = false,
  onToggle,
  children,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md",
          isDarkMode
            ? "text-gray-300 hover:text-white hover:bg-gray-800"
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        )}
      >
        <div className="flex items-center">
          <IconWrapper size="sm" className="mr-3">
            {icon}
          </IconWrapper>
          {label}
        </div>
        {hasDropdown && (
          <IconWrapper size="sm">
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </IconWrapper>
        )}
      </button>
      {hasDropdown && isExpanded && children && (
        <div className="ml-6 mt-1 space-y-1">{children}</div>
      )}
    </div>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onGoToHome?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onGoToHome }) => {
  const { isDarkMode } = useTheme();
  const [expandedSections, setExpandedSections] = useState<{
    resources: boolean;
    topics: boolean;
  }>({
    resources: false,
    topics: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      <aside
        className={cn(
          "fixed lg:static top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] overflow-y-auto transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isDarkMode ? "bg-gray-900" : "bg-white",
          "border-r",
          isDarkMode ? "border-gray-700" : "border-gray-200"
        )}
      >
        <div className="p-4">
          <nav className="space-y-1">
            <SidebarItem
              icon={<HomeIcon />}
              label="Home"
              onToggle={onGoToHome}
            />
            <SidebarItem icon={<PopularIcon />} label="Popular" />
            <SidebarItem icon={<AllIcon />} label="All" />
            <SidebarItem
              icon={<AnswersIcon />}
              label={
                <span>
                  Answers{" "}
                  <span
                    className={
                      isDarkMode ? "text-orange-400" : "text-orange-600"
                    }
                  >
                    BETA
                  </span>
                </span>
              }
            />
          </nav>
          <div className="mt-6">
            <SidebarItem
              icon={""}
              label="Topics"
              hasDropdown
              isExpanded={expandedSections.topics}
              onToggle={() => toggleSection("topics")}
            >
              <div className="space-y-1">
                <SidebarItem
                  icon={<AllIcon />}
                  label="Internet Culture (Viral)"
                />
                <SidebarItem icon={<AllIcon />} label="Games" />
                <SidebarItem icon={<AllIcon />} label="Q&As" />
                <SidebarItem icon={<AllIcon />} label="Technology" />
                <SidebarItem icon={<AllIcon />} label="Pop Culture" />
                <SidebarItem icon={<AllIcon />} label="Movies & TV" />
                <button
                  className={cn(
                    "text-sm px-3 py-1.5 rounded-full transition-colors",
                    isDarkMode
                      ? "text-white hover:text-white hover:bg-gray-800/70"
                      : "text-black hover:text-black hover:bg-gray-200"
                  )}
                >
                  See more
                </button>
              </div>
            </SidebarItem>
          </div>
          <div className="mt-6">
            <SidebarItem
              icon={""}
              label="Resources"
              hasDropdown
              isExpanded={expandedSections.resources}
              onToggle={() => toggleSection("resources")}
            >
              <div className="space-y-1">
                <SidebarItem icon={<AboutRedditSvg />} label="About Reddit" />
                <SidebarItem icon={<AdvertiseSvg />} label="Advertise" />
                <SidebarItem
                  icon={<RedditProBetaSvg />}
                  label={
                    <span>
                      Reddit Pro{" "}
                      <span
                        className={
                          isDarkMode ? "text-orange-400" : "text-orange-600"
                        }
                      >
                        BETA
                      </span>
                    </span>
                  }
                />
                <SidebarItem icon={<HelpSvg />} label="Help" />
                <SidebarItem icon={<BlogSvg />} label="Blog" />
                <SidebarItem icon={<CareersSvg />} label="Careers" />
                <SidebarItem icon={<PressSvg />} label="Press" />
              </div>
            </SidebarItem>
          </div>
          <div className="mt-6">
            <h3
              className={cn(
                "px-3 text-xs font-semibold uppercase tracking-wider",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              Communities
            </h3>
            <div className="mt-2 space-y-1">
              <SidebarItem icon={<AllIcon />} label="Communities" />
              <SidebarItem icon={<AllIcon />} label="Best of Reddit" />
              <SidebarItem icon={<AllIcon />} label="Top Translated Posts" />
              <SidebarItem icon={<AllIcon />} label="Topics" />
            </div>
          </div>
          <div className="mt-6">
            <h3
              className={cn(
                "px-3 text-xs font-semibold uppercase tracking-wider",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              Legal
            </h3>
            <div className="mt-2 space-y-1">
              <SidebarItem icon={<AllIcon />} label="Reddit Rules" />
              <SidebarItem icon={<AllIcon />} label="Privacy Policy" />
              <SidebarItem icon={<AllIcon />} label="User Agreement" />
              <SidebarItem icon={<AllIcon />} label="Accessibility" />
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p
              className={cn(
                "text-xs",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              Reddit, Inc. © 2025. All rights reserved.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
