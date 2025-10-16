import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { PostCard } from "./PostCard";
import { SearchResults } from "../Search/SearchResults";
import { SortDropdown } from "./SortDropdown";
import { ViewDropdown } from "./ViewDropdown";
import { LocationDropdown } from "./LocationDropdown";
import { useTheme } from "../../contexts/ThemeContext";
import { useSocket } from "../../contexts/SocketContext";
import { usePostsFeed, usePostsSort, useSearchPosts } from "../../hooks";
import type { BackendPost } from "../../types/backend";
import { cn } from "../../lib/utils";

export interface PostFeedRef {
  handleSearch: (
    query: string,
    sort?: "relevance" | "hot" | "top" | "new" | "comments",
    time?: "hour" | "day" | "week" | "month" | "year" | "all"
  ) => void;
  goToHome: () => void;
}

export const PostFeed = forwardRef<PostFeedRef>((_, ref) => {
  const { isDarkMode } = useTheme();
  const { socket, isConnected } = useSocket();
  const [sortBy, setSortBy] = useState<
    "best" | "hot" | "new" | "top" | "rising"
  >("best");
  const [viewMode, setViewMode] = useState<"card" | "compact">("card");
  const [location, setLocation] = useState<string>("everywhere");
  const [searchQuery, setSearchQuery] = useState("");

  // Use different hooks based on sort type
  // For best/hot/new, use feed parameter
  // For top/rising, use sort parameter
  const useFeedQuery =
    sortBy === "best" || sortBy === "hot" || sortBy === "new";

  const feedType =
    sortBy === "best" ? "home" : sortBy === "hot" ? "popular" : "new";

  const feedQueryResult = usePostsFeed(feedType as "home" | "popular" | "new");
  const sortQueryResult = usePostsSort(
    sortBy as "hot" | "new" | "top" | "rising",
    "all" // default time filter for top
  );

  // Use the appropriate result based on which query should be active
  const {
    data: postsResponse,
    isLoading: loading,
    error,
  } = useFeedQuery ? feedQueryResult : sortQueryResult;

  const {
    data: searchResponse,
    isLoading: isSearching,
    error: searchError,
  } = useSearchPosts(searchQuery);

  const posts = Array.isArray(postsResponse?.data) ? postsResponse.data : [];
  const searchResults = Array.isArray(searchResponse?.data)
    ? searchResponse.data
    : [];

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

  const handleSearch = (
    query: string,
    _sort?: "relevance" | "hot" | "top" | "new" | "comments",
    _time?: "hour" | "day" | "week" | "month" | "year" | "all"
  ) => {
    setSearchQuery(query);
  };

  const handleRetrySearch = () => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  const goToHome = () => {
    setSearchQuery("");
  };

  useImperativeHandle(ref, () => ({
    handleSearch,
    goToHome,
  }));

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
              ></div>
            ) : (
              <div
                className={viewMode === "compact" ? "space-y-1" : "space-y-4"}
              >
                {Array.isArray(posts) &&
                  posts.map((post: BackendPost) => (
                    <PostCard key={post._id} post={post} viewMode={viewMode} />
                  ))}
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
});
