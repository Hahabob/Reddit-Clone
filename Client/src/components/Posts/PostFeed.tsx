import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { PostCard } from "./PostCard";
import { SearchResults } from "../Search/SearchResults";
import { useTheme } from "../../contexts/ThemeContext";
import { useSocket } from "../../contexts/SocketContext";
import { redditApiService } from "../../services/redditApi";
import type { RedditPost } from "../../types/reddit";
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
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "hot" | "new" | "top" | "rising" | "controversial"
  >("hot");
  const [after, setAfter] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<RedditPost[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const loadPosts = async (sort: typeof sortBy, loadMore: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      // Add minimum loading time for better UX
      const [response] = await Promise.all([
        redditApiService.posts.getHomePosts(sort, {
          limit: 25,
          after: loadMore ? after : undefined,
        }),
        new Promise((resolve) => setTimeout(resolve, 300)), // Minimum 300ms loading
      ]);

      const newPosts = response.data.children.map((child) => child.data);

      if (loadMore) {
        setPosts((prev) => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      setAfter(response.data.after);
      setHasMore(!!response.data.after);
    } catch (err) {
      console.error("Error loading posts:", err);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load posts on component mount and when sort changes
  useEffect(() => {
    loadPosts(sortBy);
  }, [sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (socket) {
      // Listen for new posts
      socket.on("newPost", (newPost) => {
        setPosts((prev) => [newPost, ...prev]);
      });

      // Listen for post updates
      socket.on("postUpdate", (updatedPost) => {
        setPosts((prev) =>
          prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
        );
      });

      return () => {
        socket.off("newPost");
        socket.off("postUpdate");
      };
    }
  }, [socket]);

  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort);
    setAfter(undefined);
    setHasMore(true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadPosts(sortBy, true);
    }
  };

  const handleSearch = async (
    query: string,
    sort: "relevance" | "hot" | "top" | "new" | "comments" = "relevance",
    time: "hour" | "day" | "week" | "month" | "year" | "all" = "all"
  ) => {
    try {
      setIsSearching(true);
      setSearchError(null);
      setSearchQuery(query);

      const response = await redditApiService.posts.searchPosts(
        query,
        sort,
        time,
        25
      );

      const searchPosts = response.data.children.map((child) => child.data);
      setSearchResults(searchPosts);
    } catch (err) {
      console.error("Error searching posts:", err);
      setSearchError("Failed to search posts. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleRetrySearch = () => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  const goToHome = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
    loadPosts(sortBy);
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
        <p className="text-lg font-medium">Error loading posts: {error}</p>
        <button
          onClick={() => loadPosts(sortBy)}
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
          error={searchError}
          query={searchQuery}
          onRetry={handleRetrySearch}
        />
      ) : (
        <>
          <div
            className={`p-4 border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-4">
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Sort by:
              </span>
              <div className="flex space-x-2">
                {(
                  ["hot", "new", "top", "rising", "controversial"] as const
                ).map((sort) => (
                  <button
                    key={sort}
                    onClick={() => handleSortChange(sort)}
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      sortBy === sort
                        ? isDarkMode
                          ? "bg-orange-500 text-white"
                          : "bg-orange-500 text-white"
                        : isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4">
            {loading && posts.length === 0 ? (
              <div
                className={`min-h-screen ${
                  isDarkMode ? "bg-gray-900" : "bg-white"
                }`}
              ></div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                {hasMore && !loading && (
                  <div className="flex justify-center py-4">
                    <button
                      onClick={handleLoadMore}
                      className={`px-6 py-2 rounded-full font-medium ${
                        isDarkMode
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : "bg-orange-500 text-white hover:bg-orange-600"
                      }`}
                    >
                      Load More
                    </button>
                  </div>
                )}
                {loading && posts.length > 0 && (
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
          className={`fixed bottom-4 right-4 p-3 rounded-lg ${
            isDarkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
          }`}
        >
          <p className="text-sm">Disconnected from server</p>
        </div>
      )}
    </div>
  );
});
