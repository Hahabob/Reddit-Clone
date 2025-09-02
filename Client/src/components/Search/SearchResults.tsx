import React from "react";
import { PostCard } from "../Posts/PostCard";
import { useTheme } from "../../contexts/ThemeContext";
import type { RedditPost } from "../../types/reddit";
import { cn } from "../../lib/utils";

interface SearchResultsProps {
  posts: RedditPost[];
  loading: boolean;
  error: string | null;
  query: string;
  subreddit?: string;
  onRetry: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  posts,
  loading,
  error,
  query,
  subreddit,
  onRetry,
}) => {
  const { isDarkMode } = useTheme();

  if (loading) {
    return (
      <div className="p-8">
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
                    "w-6 h-6 rounded-full",
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  )}
                ></div>
                <div
                  className={cn(
                    "h-4 w-32 rounded",
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  )}
                ></div>
              </div>
              <div
                className={cn(
                  "h-6 w-3/4 rounded mb-2",
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                )}
              ></div>
              <div
                className={cn(
                  "h-4 w-full rounded",
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                )}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "p-8 text-center",
          isDarkMode ? "text-red-400" : "text-red-600"
        )}
      >
        <div className="mb-4">
          <svg
            className={cn(
              "mx-auto h-12 w-12",
              isDarkMode ? "text-red-400" : "text-red-600"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">Search Error</p>
        <p className="text-sm mb-4">{error}</p>
        <button
          onClick={onRetry}
          className={cn(
            "px-4 py-2 rounded-full font-medium",
            "bg-orange-500 text-white hover:bg-orange-600"
          )}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div
        className={cn(
          "p-8 text-center",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}
      >
        <div className="mb-4">
          <svg
            className={cn(
              "mx-auto h-12 w-12",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">No results found</p>
        <p className="text-sm">
          {subreddit
            ? `No posts found for "${query}" in r/${subreddit}`
            : `No posts found for "${query}"`}
        </p>
        <div className="mt-4 text-xs space-y-1">
          <p>Try:</p>
          <p>• Different keywords</p>
          <p>• Broader search terms</p>
          <p>• Different subreddit</p>
          <p>• Different time period</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div
        className={cn(
          "mb-4 pb-4 border-b",
          isDarkMode ? "border-gray-700" : "border-gray-200"
        )}
      >
        <h2
          className={cn(
            "text-lg font-semibold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}
        >
          Search Results
        </h2>
        <p
          className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}
        >
          {posts.length} result{posts.length !== 1 ? "s" : ""} for{" "}
          <span className="font-medium">"{query}"</span>
          {subreddit && (
            <span>
              {" "}
              in <span className="font-medium">r/{subreddit}</span>
            </span>
          )}
        </p>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
