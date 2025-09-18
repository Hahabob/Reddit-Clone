import React, { useState, useEffect } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/utils";
import { subredditsApi } from "../../services/redditApi";
import type { RedditSubreddit } from "../../types/reddit";

export const RightSidebar: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [showAll, setShowAll] = useState(false);
  const [popularCommunities, setPopularCommunities] = useState<
    RedditSubreddit[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularCommunities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await subredditsApi.getPopular({ limit: 10 });
        setPopularCommunities(
          response.data.children.map((child) => child.data)
        );
      } catch (err) {
        setError("Failed to load popular communities");
        console.error("Error fetching popular communities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCommunities();
  }, []);

  const displayedCommunities = showAll
    ? popularCommunities
    : popularCommunities.slice(0, 5);

  const formatMemberCount = (count: number): string => {
    return count.toLocaleString();
  };

  return (
    <aside
      className={cn(
        "w-80 h-screen overflow-y-auto transition-colors sticky top-10",
        isDarkMode ? "bg-black" : "bg-white"
      )}
    >
      <SignedOut>
        <div className="p-4 flex flex-col h-full">
          <div className="flex-1">
            <div className="mt-6">
              <div
                className={cn(
                  "rounded-lg p-1 ml-2 mr-8",
                  isDarkMode ? "bg-gray-900" : "bg-gray-100"
                )}
              >
                <h3
                  className={cn(
                    "text-xs font-semibold mb-5 pl-3",
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  POPULAR COMMUNITIES
                </h3>
                <div className="space-y-1 pl-5">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-4">
                      <p
                        className={cn(
                          "text-sm",
                          isDarkMode ? "text-red-400" : "text-red-500"
                        )}
                      >
                        {error}
                      </p>
                    </div>
                  ) : (
                    <>
                      {displayedCommunities.map((community) => (
                        <div
                          key={community.id}
                          className="flex items-center justify-between py-2 px-1 rounded cursor-pointer"
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="flex-shrink-0 mr-3">
                              {community.icon_img ? (
                                <img
                                  src={community.icon_img}
                                  alt={community.display_name}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div
                                  className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                  )}
                                >
                                  r/
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-white" : "text-gray-800"
                                )}
                              >
                                r/{community.display_name}
                              </p>
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                )}
                              >
                                {formatMemberCount(community.subscribers)}{" "}
                                members
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {popularCommunities.length > 5 && (
                        <button
                          onClick={() => setShowAll(!showAll)}
                          className={cn(
                            "text-xs font-medium px-3 py-2 mb-4 -ml-2 rounded-full transition-colors cursor-pointer",
                            isDarkMode
                              ? "text-white hover:text-white hover:bg-gray-900"
                              : "text-black hover:text-black hover:bg-gray-300"
                          )}
                        >
                          {showAll ? "See less" : "See more"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto mb-10">
            <div className="mr-1">
              <div className="space-y-1 text-xs text-gray-500 hover:text-black dark:hover:text-gray-300 p-1">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <a href="#" className="hover:underline">
                    Reddit Rules
                  </a>
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                  <a href="#" className="hover:underline">
                    User Agreement
                  </a>
                  <a href="#" className="hover:underline">
                    Accessibility
                  </a>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  Reddit Inc. © 2025. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="p-4 flex flex-col h-full">
          <div className="flex-1"></div>
          <div className="mt-auto mb-6">
            <div className="mr-1">
              <div className="space-y-1 text-xs text-gray-500 hover:text-black dark:hover:text-gray-300 p-1">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <a href="#" className="hover:underline">
                    Reddit Rules
                  </a>
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                  <a href="#" className="hover:underline">
                    User Agreement
                  </a>
                  <a href="#" className="hover:underline">
                    Accessibility
                  </a>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 mb-10">
                  Reddit Inc. © 2025. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </aside>
  );
};
