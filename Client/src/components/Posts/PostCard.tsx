import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import type { RedditPost } from "../../types/reddit";
import { cn } from "../../lib/utils";

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

const UpvoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m18 15-6-6-6 6" />
  </svg>
);

const DownvoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16,6 12,2 8,6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

interface PostCardProps {
  post: RedditPost;
  viewMode?: "card" | "compact";
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  viewMode = "card",
}) => {
  const { isDarkMode } = useTheme();
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null);

  const handleVote = (type: "up" | "down") => {
    if (voteState === type) {
      setVoteState(null);
    } else {
      setVoteState(type);
    }
  };

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;

    if (diff < 3600) {
      return `${Math.floor(diff / 60)}m ago`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)}h ago`;
    } else if (diff < 2592000) {
      return `${Math.floor(diff / 86400)}d ago`;
    } else {
      return `${Math.floor(diff / 2592000)}mo ago`;
    }
  };

  const getImageUrl = (): string | undefined => {
    if (post.preview?.images?.[0]?.source?.url) {
      return post.preview.images[0].source.url.replace(/&amp;/g, "&");
    }
    if (
      post.thumbnail &&
      post.thumbnail !== "self" &&
      post.thumbnail !== "default"
    ) {
      return post.thumbnail;
    }
    return undefined;
  };

  const getVideoUrl = (): string | undefined => {
    if (post.is_video && post.media?.reddit_video?.fallback_url) {
      return post.media.reddit_video.fallback_url;
    }
    return undefined;
  };

  const formatScore = (score: number): string => {
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`;
    } else if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}k`;
    }
    return score.toString();
  };

  if (viewMode === "compact") {
    return (
      <article
        className={cn(
          "border-b py-2 px-4 hover:bg-gray-50",
          isDarkMode ? "border-gray-800 hover:bg-gray-900" : "border-gray-200"
        )}
      >
        <div className="flex items-center space-x-2">
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={() => handleVote("up")}
              className={cn(
                "p-1 rounded",
                voteState === "up"
                  ? "text-orange-500"
                  : "text-gray-400 hover:text-orange-500"
              )}
            >
              <UpvoteIcon />
            </button>
            <span
              className={cn(
                "text-xs font-medium",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}
            >
              {formatScore(post.score)}
            </span>
            <button
              onClick={() => handleVote("down")}
              className={cn(
                "p-1 rounded",
                voteState === "down"
                  ? "text-blue-500"
                  : "text-gray-400 hover:text-blue-500"
              )}
            >
              <DownvoteIcon />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>r/{post.subreddit}</span>
              <span>•</span>
              <span>u/{post.author}</span>
              <span>•</span>
              <span>{formatTimeAgo(post.created_utc)}</span>
            </div>
            <h3
              className={cn(
                "text-sm font-medium mt-1 line-clamp-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            >
              {post.title}
            </h3>
            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
              <span>{post.num_comments} comments</span>
              <span>Share</span>
              <span>Save</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "rounded-lg border mb-4 transition-colors",
        isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
      )}
    >
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-6 h-6 rounded-full",
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              )}
            ></div>
            <span
              className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}
            >
              r/{post.subreddit}
            </span>
            <span
              className={cn(
                "text-sm",
                isDarkMode ? "text-gray-500" : "text-gray-400"
              )}
            >
              • {formatTimeAgo(post.created_utc)}
            </span>
            {post.stickied && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Pinned
              </span>
            )}
            {post.over_18 && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                NSFW
              </span>
            )}
          </div>
          <button
            className={cn(
              "p-1 rounded-full",
              isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-100"
            )}
          >
            <IconWrapper size="sm">
              <MoreIcon />
            </IconWrapper>
          </button>
        </div>
      </div>

      <div className="px-4 pb-2">
        <h2
          className={cn(
            "text-lg font-medium",
            isDarkMode ? "text-white" : "text-gray-900"
          )}
        >
          {post.title}
        </h2>
      </div>

      {post.selftext && (
        <div className="px-4 pb-4">
          <p
            className={cn(
              "text-sm",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}
          >
            {post.selftext}
          </p>
        </div>
      )}

      {getVideoUrl() ? (
        <div className="px-4 pb-4">
          <div className="relative w-full bg-black rounded-lg">
            <video
              src={getVideoUrl()}
              controls
              autoPlay
              muted
              loop
              className="w-full rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      ) : getImageUrl() ? (
        <div className="px-4 pb-4">
          <img
            src={getImageUrl()}
            alt={post.title}
            className="w-full rounded-lg"
          />
        </div>
      ) : null}

      {post.url && !post.is_self && !getImageUrl() && !getVideoUrl() && (
        <div className="px-4 pb-4">
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "block p-3 rounded-lg border",
              isDarkMode
                ? "bg-gray-900 border-gray-700 hover:bg-gray-800"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}
                >
                  {post.domain}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  {post.url}
                </p>
              </div>
              <div className="text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>
          </a>
        </div>
      )}

      <div
        className={cn(
          "px-4 py-2 border-t",
          isDarkMode ? "border-gray-700" : "border-gray-200"
        )}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleVote("up")}
            className={cn(
              "flex items-center space-x-1 px-2 py-1 rounded-full transition-colors",
              voteState === "up"
                ? "bg-orange-100 text-orange-600"
                : isDarkMode
                ? "text-gray-400 hover:bg-gray-900"
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <IconWrapper size="sm">
              <UpvoteIcon />
            </IconWrapper>
            <span className="text-sm font-medium">
              {formatScore(post.score)}
            </span>
          </button>
          <button
            onClick={() => handleVote("down")}
            className={cn(
              "flex items-center space-x-1 px-2 py-1 rounded-full transition-colors",
              voteState === "down"
                ? "bg-blue-100 text-blue-600"
                : isDarkMode
                ? "text-gray-400 hover:bg-gray-900"
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <IconWrapper size="sm">
              <DownvoteIcon />
            </IconWrapper>
          </button>
          <button
            className={cn(
              "flex items-center space-x-1 px-2 py-1 rounded-full transition-colors",
              isDarkMode
                ? "text-gray-400 hover:bg-gray-900"
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <IconWrapper size="sm">
              <CommentIcon />
            </IconWrapper>
            <span className="text-sm font-medium">
              {formatScore(post.num_comments)}
            </span>
          </button>
          <button
            className={cn(
              "flex items-center space-x-1 px-2 py-1 rounded-full transition-colors",
              isDarkMode
                ? "text-gray-400 hover:bg-gray-900"
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <IconWrapper size="sm">
              <ShareIcon />
            </IconWrapper>
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </article>
  );
};
