import React, { useState } from "react";
import { IconWrapper } from "../Icons/IconWrapper";
import { useTheme } from "../../contexts/ThemeContext";

// SVG Icons - replace with your actual SVG imports
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
  post: {
    id: string;
    subreddit: string;
    timeAgo: string;
    title: string;
    content?: string;
    imageUrl?: string;
    videoUrl?: string;
    upvotes: number;
    downvotes: number;
    comments: number;
    isPromoted?: boolean;
  };
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { isDarkMode } = useTheme();
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null);

  const handleVote = (type: "up" | "down") => {
    if (voteState === type) {
      setVoteState(null);
    } else {
      setVoteState(type);
    }
  };

  return (
    <article
      className={`rounded-lg border ${
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } mb-4`}
    >
      {/* Post Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-6 h-6 rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            ></div>
            <span
              className={`text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              r/{post.subreddit}
            </span>
            <span
              className={`text-sm ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              • {post.timeAgo}
            </span>
            {post.isPromoted && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                Promoted
              </span>
            )}
          </div>
          <button
            className={`p-1 rounded-full ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <IconWrapper size="sm">
              <MoreIcon />
            </IconWrapper>
          </button>
        </div>
      </div>

      {/* Post Title */}
      <div className="px-4 pb-2">
        <h2
          className={`text-lg font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {post.title}
        </h2>
      </div>

      {/* Post Content */}
      {post.content && (
        <div className="px-4 pb-4">
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {post.content}
          </p>
        </div>
      )}

      {/* Post Media */}
      {post.imageUrl && (
        <div className="px-4 pb-4">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full rounded-lg"
          />
        </div>
      )}

      {post.videoUrl && (
        <div className="px-4 pb-4">
          <div className="relative w-full bg-black rounded-lg">
            <video src={post.videoUrl} controls className="w-full rounded-lg">
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Upvote */}
          <button
            onClick={() => handleVote("up")}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              voteState === "up"
                ? "bg-orange-100 text-orange-600"
                : isDarkMode
                ? "text-gray-400 hover:bg-gray-800"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <IconWrapper size="sm">
              <UpvoteIcon />
            </IconWrapper>
            <span className="text-sm font-medium">{post.upvotes}</span>
          </button>

          {/* Downvote */}
          <button
            onClick={() => handleVote("down")}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              voteState === "down"
                ? "bg-blue-100 text-blue-600"
                : isDarkMode
                ? "text-gray-400 hover:bg-gray-800"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <IconWrapper size="sm">
              <DownvoteIcon />
            </IconWrapper>
            <span className="text-sm font-medium">{post.downvotes}</span>
          </button>

          {/* Comments */}
          <button
            className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              isDarkMode
                ? "text-gray-400 hover:bg-gray-800"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <IconWrapper size="sm">
              <CommentIcon />
            </IconWrapper>
            <span className="text-sm font-medium">{post.comments}</span>
          </button>

          {/* Share */}
          <button
            className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              isDarkMode
                ? "text-gray-400 hover:bg-gray-800"
                : "text-gray-500 hover:bg-gray-100"
            }`}
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
