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
import CommunitiesSvg from "../../assets/communities-logo.svg";
import BestOfRedditSvg from "../../assets/best-of-reddit-logo.svg";
import TopTranslatedPostsSvg from "../../assets/top-translated-posts-logo.svg";
import TopicsSvg from "../../assets/topics-logo.svg";
import RedditRulesSvg from "../../assets/reddit-rules-logo.svg";
import PrivacyPolicySvg from "../../assets/privacy-policy-logo.svg";
import UserAgreementSvg from "../../assets/user-agreement-logo.svg";
import AccessibilitySvg from "../../assets/accessibility-logo.svg";
import InternetCultureSvg from "../../assets/internet-culture-icon.svg";
import GamesSvg from "../../assets/games-icon.svg";
import QAsSvg from "../../assets/q&a-icon.svg";
import TechnologySvg from "../../assets/tecnology-icon.svg";
import PopCultureSvg from "../../assets/pop-culture-icon.svg";
import MoviesTvSvg from "../../assets/movies&tv-icon.svg";

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

const HomeIcon = () => <HomeSvg />;

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
  icon?: React.ReactNode;
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
          "w-full flex items-center justify-between px-3 py-2 text-sm font-normal rounded-md",
          isDarkMode ? "text-white" : "text-black"
        )}
      >
        <div className="flex items-center">
          {icon && (
            <IconWrapper size="sm" className="mr-3">
              {icon}
            </IconWrapper>
          )}
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
    communities: boolean;
    legal: boolean;
    internetCulture: boolean;
    games: boolean;
    qas: boolean;
    technology: boolean;
    popCulture: boolean;
    moviesTv: boolean;
  }>({
    resources: false,
    topics: false,
    communities: false,
    legal: false,
    internetCulture: false,
    games: false,
    qas: false,
    technology: false,
    popCulture: false,
    moviesTv: false,
  });

  const [showMore, setShowMore] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <>
      <aside
        className={cn(
          "fixed lg:static top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] overflow-y-auto transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isDarkMode ? "bg-black" : "bg-white",
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
              label={
                <span
                  className={cn(
                    "text-xs tracking-wider",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  TOPICS
                </span>
              }
              hasDropdown
              isExpanded={expandedSections.topics}
              onToggle={() => toggleSection("topics")}
            >
              <div className="space-y-1">
                <SidebarItem
                  icon={<InternetCultureSvg />}
                  label="Internet Culture (Viral)"
                  hasDropdown
                  isExpanded={expandedSections.internetCulture}
                  onToggle={() => toggleSection("internetCulture")}
                >
                  <div className="space-y-1 border-l border-gray-200 dark:border-gray-700 pt-3">
                    <SidebarItem label="Amazing" />
                    <SidebarItem label="Animals & Pets" />
                    <SidebarItem label="Cringe & Facepalm" />
                    <SidebarItem label="Funny" />
                    <SidebarItem label="Interesting" />
                    <SidebarItem label="Oddly Satisfying" />
                    <SidebarItem label="Reddit Meta" />
                    <SidebarItem label="Wholesome & Heartwarming" />
                  </div>
                </SidebarItem>
                <SidebarItem
                  icon={<GamesSvg />}
                  label="Games"
                  hasDropdown
                  isExpanded={expandedSections.games}
                  onToggle={() => toggleSection("games")}
                >
                  <div className="space-y-1">
                    <SidebarItem label="Action Games" />
                    <SidebarItem label="Adventure Games" />
                    <SidebarItem label="Esports" />
                    <SidebarItem label="Gaming Consoles & Gear" />
                    <SidebarItem label="Gaming News % Discussion" />
                    <SidebarItem label="Mobile Games" />
                    <SidebarItem label="Other Games" />
                    <SidebarItem label="Role-Playing Games" />
                    <SidebarItem label="Simulation Games" />
                    <SidebarItem label="Sports & Racing Games" />
                    <SidebarItem label="Strategy Games" />
                    <SidebarItem label="Tabletop Games" />
                  </div>
                </SidebarItem>
                <SidebarItem
                  icon={<QAsSvg />}
                  label="Q&As"
                  hasDropdown
                  isExpanded={expandedSections.qas}
                  onToggle={() => toggleSection("qas")}
                >
                  <div className="space-y-1">
                    <SidebarItem label="Q&As" />
                    <SidebarItem label="Stories % Confessions" />
                  </div>
                </SidebarItem>
                <SidebarItem
                  icon={<TechnologySvg />}
                  label="Technology"
                  hasDropdown
                  isExpanded={expandedSections.technology}
                  onToggle={() => toggleSection("technology")}
                >
                  <div className="space-y-1">
                    <SidebarItem label="3D Printing" />
                    <SidebarItem label="Artificial Intelligence & Machine Learning" />
                    <SidebarItem label="Computers & Hardware" />
                    <SidebarItem label="Consumer Electronics" />
                    <SidebarItem label="DIY Electronics" />
                    <SidebarItem label="Programming" />
                    <SidebarItem label="Software & Apps" />
                    <SidebarItem label="Steaming Services" />
                    <SidebarItem label="Tech News & Discussion" />
                    <SidebarItem label="Virtual & Augmented Reality" />
                  </div>
                </SidebarItem>
                <SidebarItem
                  icon={<PopCultureSvg />}
                  label="Pop Culture"
                  hasDropdown
                  isExpanded={expandedSections.popCulture}
                  onToggle={() => toggleSection("popCulture")}
                >
                  <div className="space-y-1">
                    <SidebarItem label="Celebrities" />
                    <SidebarItem label="Creators & Influencers" />
                    <SidebarItem label="Generations & Nostalgia" />
                    <SidebarItem label="Podcasts" />
                    <SidebarItem label="Streamers" />
                    <SidebarItem label="Tarot & Astrology" />
                  </div>
                </SidebarItem>
                <SidebarItem
                  icon={<MoviesTvSvg />}
                  label="Movies & TV"
                  hasDropdown
                  isExpanded={expandedSections.moviesTv}
                  onToggle={() => toggleSection("moviesTv")}
                >
                  <div className="space-y-1">
                    <SidebarItem label="Action Movies & Series" />
                    <SidebarItem label="Animated Movies & Series" />
                    <SidebarItem label="Comedy Movies & Series" />
                    <SidebarItem label="Crime, Mystery & Thriller Movies & Series" />
                    <SidebarItem label="Documentary Movies & Series" />
                    <SidebarItem label="Drama Movies & Series" />
                    <SidebarItem label="Fantasy Movies & Series" />
                    <SidebarItem label="Horror Movies & Series" />
                    <SidebarItem label="Movies News & Discussion" />
                    <SidebarItem label="Reality TV" />
                    <SidebarItem label="Romance Movies & Series" />
                    <SidebarItem label="Sci-Fi Movies & Series" />
                    <SidebarItem label="Superhero Movies & Series" />
                    <SidebarItem label="TV News & Discussion" />
                  </div>
                </SidebarItem>
                <button
                  onClick={toggleShowMore}
                  className={cn(
                    "text-sm px-3 py-1.5 rounded-full transition-colors",
                    isDarkMode
                      ? "text-white hover:text-white hover:bg-gray-900/70"
                      : "text-black hover:text-black hover:bg-gray-200"
                  )}
                >
                  {showMore ? "See less" : "See more"}
                </button>
              </div>
            </SidebarItem>
          </div>
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
            <SidebarItem
              icon={""}
              label={
                <span
                  className={cn(
                    "text-xs tracking-wider",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  RESOURCES
                </span>
              }
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

              <div className="space-y-1 mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                <SidebarItem icon={<CommunitiesSvg />} label="Communities" />
                <SidebarItem
                  icon={<BestOfRedditSvg />}
                  label="Best of Reddit"
                />
                <SidebarItem
                  icon={<TopTranslatedPostsSvg />}
                  label="Top Translated Posts"
                />
                <SidebarItem icon={<TopicsSvg />} label="Topics" />
              </div>

              <div className="space-y-1 mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                <SidebarItem icon={<RedditRulesSvg />} label="Reddit Rules" />
                <SidebarItem
                  icon={<PrivacyPolicySvg />}
                  label="Privacy Policy"
                />
                <SidebarItem
                  icon={<UserAgreementSvg />}
                  label="User Agreement"
                />
                <SidebarItem
                  icon={<AccessibilitySvg />}
                  label="Accessibility"
                />
              </div>
            </SidebarItem>
          </div>

          <div className="mt-4 pt-4">
            <p
              className={cn(
                "text-[10px]",
                isDarkMode ? "text-white" : "text-black"
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
