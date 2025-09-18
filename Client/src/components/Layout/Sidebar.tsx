import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/utils";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import HomeSvg from "../../assets/home-icon.svg";
import PopularSvg from "../../assets/popular-logo.svg";
import AllSvg from "../../assets/all-logo.svg";
import AboutRedditSvg from "../../assets/about-reddit-logo.svg";
import AdvertiseSideBarIconSvg from "../../assets/advertise-side-bar-icon.svg";
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
import AnimeSvg from "../../assets/AnimeIcon.svg";
import ArtsSvg from "../../assets/ArtIcon.svg";
import BusinessSvg from "../../assets/BusinessIcon.svg";
import CollectiblesSvg from "../../assets/collectiblesIcon.svg";
import EducationCareerSvg from "../../assets/careers-logo.svg";
import FashionBeautySvg from "../../assets/Fashion&beautyIcon.svg";
import FoodDrinksSvg from "../../assets/FoodIcon.svg";
import HomeGardenSvg from "../../assets/home&gardenIcon.svg";
import HumanitiesLawSvg from "../../assets/humanitiesIcon.svg";
import MusicSvg from "../../assets/musicIcon.svg";
import NatureOutdoorsSvg from "../../assets/natureIcon.svg";
import NewsPoliticsSvg from "../../assets/newsIcon.svg";
import PlacesTravelSvg from "../../assets/places&travelIcon.svg";
import ScienceSvg from "../../assets/scienceIcon.svg";
import SportsSvg from "../../assets/sportsIcon.svg";
import SpookySvg from "../../assets/spookyIcon.svg";
import VehiclesSvg from "../../assets/vehiclesIcon.svg";
import WellnessSvg from "../../assets/wellnessIcon.svg";
import ExploreSvg from "../../assets/exploreIcon.svg";
import ManageCommunitiesSvg from "../../assets/settings-community-logo.svg";

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

const HomeIcon = () => (
  <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
    <HomeSvg />
  </div>
);

const PopularIcon = () => (
  <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
    <PopularSvg />
  </div>
);

const AllIcon = () => (
  <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
    <AllSvg />
  </div>
);

const AnswersIcon = () => (
  <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
    <AnswersSvg />
  </div>
);

const ExploreIcon = () => (
  <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
    <ExploreSvg />
  </div>
);

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
          "w-full flex items-center justify-between px-3 py-2 text-sm font-normal rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
          isDarkMode ? "text-white" : "text-black"
        )}
      >
        <div className="flex items-center min-w-0">
          {icon && (
            <IconWrapper size="md" className="mr-3 flex-shrink-0">
              {icon}
            </IconWrapper>
          )}
          <span className="truncate">{label}</span>
        </div>
        {hasDropdown && (
          <IconWrapper size="sm" className="ml-2 flex-shrink-0">
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
  onClose: () => void;
  onGoToHome?: () => void;
}

const SidebarContentLoggedIn: React.FC<{ onGoToHome?: () => void }> = ({
  onGoToHome,
}) => {
  const { isDarkMode } = useTheme();
  const [expandedSections, setExpandedSections] = useState<{
    resources: boolean;
    customFeeds: boolean;
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
    customFeeds: false,
    communities: false,
    legal: false,
    internetCulture: false,
    games: false,
    qas: false,
    technology: false,
    popCulture: false,
    moviesTv: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="p-4">
      <nav className="space-y-1">
        <SidebarItem icon={<HomeIcon />} label="Home" onToggle={onGoToHome} />
        <SidebarItem icon={<PopularIcon />} label="Popular" />
        <SidebarItem
          icon={<AnswersIcon />}
          label={
            <span>
              Answers{" "}
              <span
                className={`text-xs font-semibold ml-1.5 ${
                  isDarkMode ? "text-orange-400" : "text-orange-700"
                }`}
              >
                BETA
              </span>
            </span>
          }
        />
        <SidebarItem icon={<ExploreIcon />} label="Explore" />
        <SidebarItem icon={<AllIcon />} label="All" />
      </nav>
      <hr className="my-4 border-gray-200 dark:border-gray-700" />
      <div className="mt-6">
        <SidebarItem
          label={
            <span
              className={cn(
                "text-xs tracking-wider",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              CUSTOM FEEDS
            </span>
          }
          hasDropdown
          isExpanded={expandedSections.customFeeds}
          onToggle={() => toggleSection("customFeeds")}
        >
          <div className="-ml-4">
            <SidebarItem
              label={
                <span className="flex items-center">
                  <span className="text-4xl font-thin mr-1.5 -mt-1">+</span>
                  Create Custom Feed
                </span>
              }
            />
          </div>
        </SidebarItem>
      </div>
      <hr className="my-4 border-gray-200 dark:border-gray-700" />
      <div className="mt-6">
        <SidebarItem
          label={
            <span
              className={cn(
                "text-xs tracking-wider",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              COMMUNITIES
            </span>
          }
          hasDropdown
          isExpanded={expandedSections.communities}
          onToggle={() => toggleSection("communities")}
        >
          <div className="-ml-4">
            <SidebarItem
              label={
                <span className="flex items-center">
                  <span className="text-4xl font-thin mr-1.5 -mt-1">+</span>
                  Create Community
                </span>
              }
            />
          </div>
          <div className="-ml-4">
            <SidebarItem
              icon={<ManageCommunitiesSvg />}
              label="Manage Communities"
            />
          </div>
        </SidebarItem>
      </div>
      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
        <SidebarItem
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
          <div className="space-y-1 -ml-4">
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <AboutRedditSvg />
                </div>
              }
              label="About Reddit"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <AdvertiseSideBarIconSvg />
                </div>
              }
              label="Advertise"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <RedditProBetaSvg />
                </div>
              }
              label={
                <span>
                  Reddit Pro{" "}
                  <span
                    className={cn(
                      "font-semibold text-xs ml-1",
                      isDarkMode ? "text-orange-400" : "text-orange-700"
                    )}
                  >
                    BETA
                  </span>
                </span>
              }
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <HelpSvg />
                </div>
              }
              label="Help"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <BlogSvg />
                </div>
              }
              label="Blog"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <CareersSvg />
                </div>
              }
              label="Careers"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <PressSvg />
                </div>
              }
              label="Press"
            />
          </div>

          <div className="-ml-4 space-y-1 mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <CommunitiesSvg />
                </div>
              }
              label="Communities"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <BestOfRedditSvg />
                </div>
              }
              label="Best of Reddit"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <TopTranslatedPostsSvg />
                </div>
              }
              label="Top Translated Posts"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <TopicsSvg />
                </div>
              }
              label="Topics"
            />
          </div>

          <div className="-ml-4 space-y-1 mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <RedditRulesSvg />
                </div>
              }
              label="Reddit Rules"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <PrivacyPolicySvg />
                </div>
              }
              label="Privacy Policy"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <UserAgreementSvg />
                </div>
              }
              label="User Agreement"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <AccessibilitySvg />
                </div>
              }
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
  );
};

const SidebarContentLoggedOut: React.FC<{ onGoToHome?: () => void }> = ({
  onGoToHome,
}) => {
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
    <div className="p-4">
      <nav className="space-y-1">
        <SidebarItem icon={<HomeIcon />} label="Home" onToggle={onGoToHome} />
        <SidebarItem icon={<PopularIcon />} label="Popular" />
        <SidebarItem
          icon={<AnswersIcon />}
          label={
            <span>
              Answers{" "}
              <span
                className={`text-xs font-semibold ml-1.5 ${
                  isDarkMode ? "text-orange-400" : "text-orange-700"
                }`}
              >
                BETA
              </span>
            </span>
          }
        />
      </nav>
      <hr className="my-4 border-gray-200 dark:border-gray-700" />
      <div className="mt-6">
        <SidebarItem
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
          <div className="space-y-1 -ml-4">
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <InternetCultureSvg />
                </div>
              }
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
                <SidebarItem label="Memes" />
                <SidebarItem label="Oddly Satisfying" />
                <SidebarItem label="Reddit Meta" />
                <SidebarItem label="Wholesome & Heartwarming" />
              </div>
            </SidebarItem>
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <GamesSvg />
                </div>
              }
              label="Games"
              hasDropdown
              isExpanded={expandedSections.games}
              onToggle={() => toggleSection("games")}
            >
              <div className="space-y-1 border-l border-gray-200 dark:border-gray-700 pt-3">
                <SidebarItem label="Action Games" />
                <SidebarItem label="Adventure Games" />
                <SidebarItem label="Esports" />
                <SidebarItem label="Gaming Consoles & Gear" />
                <SidebarItem label="Gaming News & Discussion" />
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
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <QAsSvg />
                </div>
              }
              label="Q&As"
              hasDropdown
              isExpanded={expandedSections.qas}
              onToggle={() => toggleSection("qas")}
            >
              <div className="space-y-1 border-l border-gray-200 dark:border-gray-700 pt-3">
                <SidebarItem label="Q&As" />
                <SidebarItem label="Stories & Confessions" />
              </div>
            </SidebarItem>
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <TechnologySvg />
                </div>
              }
              label="Technology"
              hasDropdown
              isExpanded={expandedSections.technology}
              onToggle={() => toggleSection("technology")}
            >
              <div className="space-y-1 border-l border-gray-200 dark:border-gray-700 pt-3">
                <SidebarItem label="3D Printing" />
                <SidebarItem label="Artificial Intelligence & Machine Learning" />
                <SidebarItem label="Computers & Hardware" />
                <SidebarItem label="Consumer Electronics" />
                <SidebarItem label="DIY Electronics" />
                <SidebarItem label="Programming" />
                <SidebarItem label="Software & Apps" />
                <SidebarItem label="Streaming Services" />
                <SidebarItem label="Tech News & Discussion" />
                <SidebarItem label="Virtual & Augmented Reality" />
              </div>
            </SidebarItem>
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <PopCultureSvg />
                </div>
              }
              label="Pop Culture"
              hasDropdown
              isExpanded={expandedSections.popCulture}
              onToggle={() => toggleSection("popCulture")}
            >
              <div className="space-y-1 border-l border-gray-200 dark:border-gray-700 pt-3">
                <SidebarItem label="Celebrities" />
                <SidebarItem label="Creators & Influencers" />
                <SidebarItem label="Generations & Nostalgia" />
                <SidebarItem label="Podcasts" />
                <SidebarItem label="Streamers" />
                <SidebarItem label="Tarot & Astrology" />
              </div>
            </SidebarItem>
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <MoviesTvSvg />
                </div>
              }
              label="Movies & TV"
              hasDropdown
              isExpanded={expandedSections.moviesTv}
              onToggle={() => toggleSection("moviesTv")}
            >
              <div className="space-y-1 border-l border-gray-200 dark:border-gray-700 pt-3">
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
            {showMore && (
              <>
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <AnimeSvg />
                    </div>
                  }
                  label="Anime"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <ArtsSvg />
                    </div>
                  }
                  label="Arts"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <BusinessSvg />
                    </div>
                  }
                  label="Business"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <CollectiblesSvg />
                    </div>
                  }
                  label="Collectibles & Other hobbies"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <EducationCareerSvg />
                    </div>
                  }
                  label="Education & Career"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <FashionBeautySvg />
                    </div>
                  }
                  label="Fashion & Beauty"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <FoodDrinksSvg />
                    </div>
                  }
                  label="Food & Drinks"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <HomeGardenSvg />
                    </div>
                  }
                  label="Home & Garden"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <HumanitiesLawSvg />
                    </div>
                  }
                  label="Humanities & Law"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <MusicSvg />
                    </div>
                  }
                  label="Music"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <NatureOutdoorsSvg />
                    </div>
                  }
                  label="Nature & Outdoors"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <NewsPoliticsSvg />
                    </div>
                  }
                  label="news & Politics"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <PlacesTravelSvg />
                    </div>
                  }
                  label="Places & Travel"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <ScienceSvg />
                    </div>
                  }
                  label="Science"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <SportsSvg />
                    </div>
                  }
                  label="Sports"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <SpookySvg />
                    </div>
                  }
                  label="Spooky"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <VehiclesSvg />
                    </div>
                  }
                  label="Vehicles"
                />
                <SidebarItem
                  icon={
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                      <WellnessSvg />
                    </div>
                  }
                  label="Wellness"
                />
              </>
            )}
            <button
              onClick={toggleShowMore}
              className={cn(
                "text-sm font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer",
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
          <div className="space-y-1 -ml-4">
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <AboutRedditSvg />
                </div>
              }
              label="About Reddit"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <AdvertiseSideBarIconSvg />
                </div>
              }
              label="Advertise"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <RedditProBetaSvg />
                </div>
              }
              label={
                <span>
                  Reddit Pro{" "}
                  <span
                    className={cn(
                      "font-semibold text-xs ml-1",
                      isDarkMode ? "text-orange-400" : "text-orange-700"
                    )}
                  >
                    BETA
                  </span>
                </span>
              }
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <HelpSvg />
                </div>
              }
              label="Help"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <BlogSvg />
                </div>
              }
              label="Blog"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <CareersSvg />
                </div>
              }
              label="Careers"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <PressSvg />
                </div>
              }
              label="Press"
            />
          </div>

          <div className="-ml-4 space-y-1 mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <CommunitiesSvg />
                </div>
              }
              label="Communities"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <BestOfRedditSvg />
                </div>
              }
              label="Best of Reddit"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <TopicsSvg />
                </div>
              }
              label="Topics"
            />
          </div>

          <div className="-ml-4 space-y-1 mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <RedditRulesSvg />
                </div>
              }
              label="Reddit Rules"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <PrivacyPolicySvg />
                </div>
              }
              label="Privacy Policy"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <UserAgreementSvg />
                </div>
              }
              label="User Agreement"
            />
            <SidebarItem
              icon={
                <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                  <AccessibilitySvg />
                </div>
              }
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
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onGoToHome,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <>
      {isOpen && <div className="fixed inset-0" onClick={onClose} />}
      <aside
        className={cn(
          "fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] overflow-y-auto transform transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isDarkMode ? "bg-black" : "bg-white",
          "border-r",
          isDarkMode ? "border-gray-700" : "border-gray-200"
        )}
      >
        <SignedIn>
          <SidebarContentLoggedIn onGoToHome={onGoToHome} />
        </SignedIn>
        <SignedOut>
          <SidebarContentLoggedOut onGoToHome={onGoToHome} />
        </SignedOut>
      </aside>
    </>
  );
};
