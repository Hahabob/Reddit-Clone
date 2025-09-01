import React, { useState, useEffect } from "react";
import { PostCard } from "./PostCard";
import { useTheme } from "../../contexts/ThemeContext";
import { useSocket } from "../../contexts/SocketContext";

// Mock data - replace with real data from your API
const mockPosts = [
  {
    id: "1",
    subreddit: "WatchPeopleDieInside",
    timeAgo: "19 hr. ago",
    title: "Tourist Decide to Ignore the White Lines.",
    videoUrl: "/sample-video.mp4",
    upvotes: 39000,
    downvotes: 12000,
    comments: 1250,
  },
  {
    id: "2",
    subreddit: "news",
    timeAgo: "2 hr. ago",
    title: "Giuliani injured in crash.",
    imageUrl: "/sample-image.jpg",
    upvotes: 8500,
    downvotes: 1200,
    comments: 340,
  },
  {
    id: "3",
    subreddit: "InternationalNews",
    timeAgo: "4 hr. ago",
    title: "Global Sumud Flotilla launch.",
    imageUrl: "/sample-image2.jpg",
    upvotes: 12000,
    downvotes: 800,
    comments: 560,
  },
  {
    id: "4",
    subreddit: "Fauxmoi",
    timeAgo: "6 hr. ago",
    title: "Remembering Princess Diana.",
    imageUrl: "/sample-image3.jpg",
    upvotes: 25000,
    downvotes: 500,
    comments: 1200,
  },
  {
    id: "5",
    subreddit: "logzillaAI",
    timeAgo: "1 hr. ago",
    title:
      "This isn't an alert. It's your promotion. LogZilla AI gets to the root in plain English.",
    content: "I DON'T WANT DASHBOARDS",
    upvotes: 150,
    downvotes: 50,
    comments: 25,
    isPromoted: true,
  },
];

export const PostFeed: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { socket, isConnected } = useSocket();
  const [posts, setPosts] = useState(mockPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top" | "rising">("hot");

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
    // Here you would typically fetch posts with the new sort order
    // For now, we'll just update the state
  };

  if (error) {
    return (
      <div
        className={`p-8 text-center ${
          isDarkMode ? "text-red-400" : "text-red-600"
        }`}
      >
        <p className="text-lg font-medium">Error loading posts: {error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            // Retry loading posts
            setTimeout(() => setLoading(false), 1000);
          }}
          className={`mt-4 px-4 py-2 rounded-full ${
            isDarkMode
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto lg:max-w-6xl">
      {/* Sort Options */}
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
            {(["hot", "new", "top", "rising"] as const).map((sort) => (
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

      {/* Posts */}
      <div className="p-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-white border-gray-200"
                } p-4`}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <div
                    className={`w-6 h-6 rounded-full ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-4 w-32 rounded ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`h-6 w-3/4 rounded mb-2 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-4 w-full rounded ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Connection Status */}
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
};
