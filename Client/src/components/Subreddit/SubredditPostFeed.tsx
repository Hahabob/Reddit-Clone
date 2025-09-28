import React, { useState, useEffect } from "react";
import { PostCard } from "../Posts/PostCard";
import { SearchResults } from "../Search/SearchResults";
import { SortDropdown } from "../Posts/SortDropdown";
import { ViewDropdown } from "../Posts/ViewDropdown";
import { LocationDropdown } from "../Posts/LocationDropdown";
import { useTheme } from "../../contexts/ThemeContext";
import { useSocket } from "../../contexts/SocketContext";
import { useSubredditPosts, useSearchPosts } from "../../hooks";
import type { BackendPost } from "../../types/backend";
import { cn } from "../../lib/utils";

interface SubredditPostFeedProps {
  subredditId: string;
  subredditName: string;
}

export const SubredditPostFeed: React.FC<SubredditPostFeedProps> = ({
  subredditId,
  subredditName,
}) => {
  const { isDarkMode } = useTheme();
  const { socket, isConnected } = useSocket();
  const [sortBy, setSortBy] = useState<
    "best" | "hot" | "new" | "top" | "rising"
  >("hot");
  const [viewMode, setViewMode] = useState<"card" | "compact">("card");
  const [location, setLocation] = useState<string>("everywhere");
  const [searchQuery, setSearchQuery] = useState("");

  // Use backend hooks for data fetching
  const {
    data: postsResponse,
    isLoading: loading,
    error,
  } = useSubredditPosts(subredditId);

  const {
    data: searchResponse,
    isLoading: isSearching,
    error: searchError,
  } = useSearchPosts(searchQuery, { subreddit: subredditName });

  const posts = postsResponse?.data || [];
  const searchResults = searchResponse?.data || [];

  useEffect(() => {
    if (socket) {
      return () => {
        socket.off("newPost");
        socket.off("postUpdate");
      };
    }
  }, [socket]);

  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort);
  };

  const handleViewChange = (newView: typeof viewMode) => {
    setViewMode(newView);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRetrySearch = () => {
    handleSearch(searchQuery);
  };

  if (error) {
    return (
      <div
        className={cn(
          "p-8 text-center",
          isDarkMode ? "text-red-400" : "text-red-600"
        )}
      >
        <p className="text-lg font-medium">Error loading posts</p>
        <button
          onClick={() => window.location.reload()}
          className={cn(
            "mt-4 px-4 py-2 rounded-full",
            "bg-orange-500 text-white hover:bg-orange-600"
          )}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto lg:max-w-6xl">
      {isSearching || searchQuery ? (
        <SearchResults
          posts={searchResults}
          loading={isSearching}
          error={searchError?.message || null}
          query={searchQuery}
          subreddit={subredditName}
          onRetry={handleRetrySearch}
        />
      ) : (
        <>
          <div
            className={cn(
              "p-4 border-b transition-colors",
              isDarkMode ? "border-gray-900 bg-black" : "border-gray-200"
            )}
          >
            <div className="flex items-center space-x-1">
              <SortDropdown
                currentSort={sortBy}
                onSortChange={handleSortChange}
              />
              <LocationDropdown
                currentLocation={location}
                onLocationChange={handleLocationChange}
              />
              <ViewDropdown
                currentView={viewMode}
                onViewChange={handleViewChange}
              />
            </div>
          </div>
          <div className="p-4">
            {loading && posts.length === 0 ? (
              <div
                className={cn(
                  "min-h-screen",
                  isDarkMode ? "bg-gray-900" : "bg-white"
                )}
              >
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "animate-pulse rounded-lg border p-4",
                        isDarkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                      )}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full",
                            isDarkMode ? "bg-gray-700" : "bg-gray-300"
                          )}
                        />
                        <div
                          className={cn(
                            "h-4 w-20 rounded",
                            isDarkMode ? "bg-gray-700" : "bg-gray-300"
                          )}
                        />
                      </div>
                      <div
                        className={cn(
                          "h-6 w-3/4 rounded mb-2",
                          isDarkMode ? "bg-gray-700" : "bg-gray-300"
                        )}
                      />
                      <div
                        className={cn(
                          "h-4 w-full rounded",
                          isDarkMode ? "bg-gray-700" : "bg-gray-300"
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={viewMode === "compact" ? "space-y-1" : "space-y-4"}
              >
                {posts.length === 0 && !loading ? (
                  <div className="text-center py-16">
                    <div
                      className={cn(
                        "text-lg font-medium mb-2",
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      No posts yet
                    </div>
                    <p
                      className={cn(
                        "text-sm",
                        isDarkMode ? "text-gray-500" : "text-gray-500"
                      )}
                    >
                      Be the first to post in r/{subredditName}!
                    </p>
                  </div>
                ) : (
                  posts.map((post: BackendPost) => (
                    <PostCard key={post._id} post={post} viewMode={viewMode} />
                  ))
                )}
                {loading && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {!isConnected && (
        <div
          className={cn(
            "fixed bottom-4 right-4 p-3 rounded-lg",
            isDarkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
          )}
        >
          <p className="text-sm">Disconnected from server</p>
        </div>
      )}
    </div>
  );
};
