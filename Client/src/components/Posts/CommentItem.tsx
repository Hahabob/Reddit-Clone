import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/utils";
import { useVoteComment, useCreateComment, useUser } from "../../hooks";
import type { BackendComment } from "../../types/backend";
import CommentEditor from "./CommentEditor";

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

const ReplyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 17l3-3-3-3" />
    <path d="M21 17v-6a4 4 0 0 0-4-4H7" />
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

interface CommentItemProps {
  comment: BackendComment;
  postId: string;
  depth?: number;
  maxDepth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  depth = 0,
  maxDepth = 5,
}) => {
  const { isDarkMode } = useTheme();
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [voteState, setVoteState] = useState<1 | -1 | 0>(comment.userVote || 0);

  const { data: commentAuthor } = useUser(comment.authorId);

  const voteCommentMutation = useVoteComment();
  const createCommentMutation = useCreateComment();

  // Update voteState when comment.userVote changes
  React.useEffect(() => {
    setVoteState(comment.userVote || 0);
  }, [comment.userVote]);

  const formatTimeAgo = (dateString: string): string => {
    const now = Date.now();
    const commentDate = new Date(dateString).getTime();
    const diff = (now - commentDate) / 1000;

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

  const formatScore = (score: number): string => {
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`;
    } else if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}k`;
    }
    return score.toString();
  };

  const handleVote = async (dir: 1 | -1 | 0) => {
    const newVote = voteState === dir ? 0 : dir;
    setVoteState(newVote);

    try {
      await voteCommentMutation.mutateAsync({
        commentId: comment._id,
        dir: newVote,
      });
    } catch {
      setVoteState(voteState);
    }
  };

  const handleReply = async (content: string) => {
    try {
      await createCommentMutation.mutateAsync({
        postId,
        commentData: {
          content,
          parentId: comment._id,
        },
      });
      setIsReplying(false);
    } catch {
      // Silently handle errors - no action needed
    }
  };

  const marginLeft = Math.min(depth * 20, maxDepth * 20);

  return (
    <div
      className={cn(
        "border-l-2 transition-colors",
        depth > 0
          ? isDarkMode
            ? "border-gray-700 ml-4"
            : "border-gray-300 ml-4"
          : "border-transparent"
      )}
      style={{ marginLeft: depth > 0 ? `${marginLeft}px` : "0" }}
    >
      <div className="pl-4 py-3">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
              {commentAuthor?.avatarUrl ? (
                <img
                  src={commentAuthor.avatarUrl}
                  alt={commentAuthor.username || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "w-full h-full flex items-center justify-center text-xs font-medium",
                    isDarkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {commentAuthor?.username
                    ? commentAuthor.username[0].toUpperCase()
                    : "U"}
                </div>
              )}
            </div>
            <span
              className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}
            >
              u/{commentAuthor?.username || "loading..."}
            </span>
            <span
              className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              • {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          <button
            className={cn(
              "p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            )}
          >
            <IconWrapper size="sm">
              <MoreIcon />
            </IconWrapper>
          </button>
        </div>

        {/* Comment Content */}
        <div className="mb-3">
          {comment.isDeleted ? (
            <p
              className={cn(
                "text-sm italic",
                isDarkMode ? "text-gray-500" : "text-gray-400"
              )}
            >
              [deleted]
            </p>
          ) : (
            <p
              className={cn(
                "text-sm whitespace-pre-wrap",
                isDarkMode ? "text-gray-100" : "text-gray-800"
              )}
            >
              {comment.content}
            </p>
          )}
        </div>

        {/* Comment Actions */}
        {!comment.isDeleted && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVote(1)}
              className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded-full transition-colors",
                voteState === 1
                  ? "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400"
                  : isDarkMode
                  ? "text-gray-400 hover:bg-gray-800"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <IconWrapper size="sm">
                <UpvoteIcon />
              </IconWrapper>
              <span className="text-xs font-medium">
                {formatScore(comment.upvotes - comment.downvotes)}
              </span>
            </button>

            <button
              onClick={() => handleVote(-1)}
              className={cn(
                "flex items-center px-2 py-1 rounded-full transition-colors",
                voteState === -1
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                  : isDarkMode
                  ? "text-gray-400 hover:bg-gray-800"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <IconWrapper size="sm">
                <DownvoteIcon />
              </IconWrapper>
            </button>

            <button
              onClick={() => setIsReplying(!isReplying)}
              className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded-full transition-colors",
                isDarkMode
                  ? "text-gray-400 hover:bg-gray-800"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <IconWrapper size="sm">
                <ReplyIcon />
              </IconWrapper>
              <span className="text-xs font-medium">Reply</span>
            </button>

            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className={cn(
                  "flex items-center space-x-1 px-2 py-1 rounded-full transition-colors text-xs font-medium",
                  isDarkMode
                    ? "text-gray-400 hover:bg-gray-800"
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                {showReplies ? "Hide" : "Show"} {comment.replies.length} repl
                {comment.replies.length === 1 ? "y" : "ies"}
              </button>
            )}
          </div>
        )}

        {/* Reply Editor */}
        {isReplying && (
          <div className="mt-4">
            <CommentEditor
              onSubmit={handleReply}
              onCancel={() => setIsReplying(false)}
              placeholder="Add a reply..."
              isLoading={createCommentMutation.isPending}
              submitButtonText="Reply"
            />
          </div>
        )}

        {/* Nested Replies */}
        {showReplies &&
          comment.replies &&
          comment.replies.length > 0 &&
          depth < maxDepth && (
            <div className="mt-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  postId={postId}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                />
              ))}
            </div>
          )}

        {/* Load More Link for Deep Nesting */}
        {depth >= maxDepth && comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            <button
              className={cn(
                "text-sm font-medium underline",
                isDarkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              )}
            >
              Continue this thread →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
