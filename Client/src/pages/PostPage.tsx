import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { cn } from "../lib/utils";
import {
  usePost,
  useComments,
  useVotePost,
  useCreateComment,
  useUser,
  useCurrentUser,
} from "../hooks";
import type { BackendComment } from "../types/backend";
import SimpleCommentInput from "../components/Posts/SimpleCommentInput";
import CommentItem from "../components/Posts/CommentItem";

interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const IconWrapper = ({
  children,
  className = "",
  size = "md",
}: IconWrapperProps) => {
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

const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const PostPage = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/comments/")[1]?.split("/")[0];
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentSuccess, setCommentSuccess] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = usePost(postId || "");
  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useComments(postId || "");

  const { data: currentUserData } = useCurrentUser();

  const { data: postAuthor } = useUser(post?.authorId || "");

  // Initialize voteState from post.userVote
  const [voteState, setVoteState] = useState<1 | -1 | 0>(0);
  useEffect(() => {
    if (post?.userVote !== undefined) {
      setVoteState(post.userVote);
    }
  }, [post?.userVote]);

  const votePostMutation = useVotePost();
  const createCommentMutation = useCreateComment();

  if (!postId) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkMode ? "bg-[#0d0d0f] text-white" : "bg-white text-black"
        }`}
      >
        <p>Post ID not found</p>
      </div>
    );
  }

  if (postLoading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkMode ? "bg-[#0d0d0f] text-white" : "bg-white text-black"
        }`}
      >
        <p>Loading post...</p>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkMode ? "bg-[#0d0d0f] text-white" : "bg-white text-black"
        }`}
      >
        <p>Error loading post: {postError?.message || "Post not found"}</p>
      </div>
    );
  }

  const formatTimeAgo = (dateString: string): string => {
    const now = Date.now();
    const postDate = new Date(dateString).getTime();
    const diff = (now - postDate) / 1000;

    if (diff < 3600) {
      return `${Math.floor(diff / 60)} minute${
        Math.floor(diff / 60) === 1 ? "" : "s"
      } ago`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)} hour${
        Math.floor(diff / 3600) === 1 ? "" : "s"
      } ago`;
    } else if (diff < 2592000) {
      return `${Math.floor(diff / 86400)} day${
        Math.floor(diff / 86400) === 1 ? "" : "s"
      } ago`;
    } else {
      return `${Math.floor(diff / 2592000)} month${
        Math.floor(diff / 2592000) === 1 ? "" : "s"
      } ago`;
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

  const getSubredditName = (): string => {
    if (typeof post?.subredditId === "object" && post.subredditId.name) {
      return post.subredditId.name;
    }
    return "unknown";
  };

  const getImageUrl = (): string | undefined => {
    if (post?.content?.type === "image") {
      return post.content.url;
    }
    if (post?.content?.type === "mixed" && post.content.images?.[0]) {
      return post.content.images[0].url;
    }
    return undefined;
  };

  const getVideoUrl = (): string | undefined => {
    if (post?.content?.type === "video") {
      return post.content.url;
    }
    return undefined;
  };

  const handleVote = async (dir: 1 | -1 | 0) => {
    const newVote = voteState === dir ? 0 : dir;
    setVoteState(newVote);

    try {
      await votePostMutation.mutateAsync({
        postId: post._id,
        dir: newVote,
      });
    } catch (error) {
      setVoteState(voteState);
    }
  };

  const handleComment = async (content: string) => {
    setCommentError(null);
    setCommentSuccess(false);
    setRetryCount(0);

    if (!currentUserData) {
      setCommentError("You must be logged in to comment.");
      return;
    }

    if (!content.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        postId: post._id,
        commentData: { content: content.trim() },
      });
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3000);
    } catch (error) {
      let errorMessage = "Unknown error occurred";
      let canRetry = false;

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as any;

        if (axiosError.response?.data?.message) {
          errorMessage = `Server error: ${axiosError.response.data.message}`;
          canRetry = axiosError.response?.status === 500;
        } else if (axiosError.response?.status === 500) {
          errorMessage = "Internal server error - please try again later";
          canRetry = true;
        } else if (axiosError.response?.status === 401) {
          errorMessage = "Authentication required - please sign in";
        } else if (axiosError.response?.status === 403) {
          errorMessage = "Permission denied";
        } else if (axiosError.response?.statusText) {
          errorMessage = axiosError.response.statusText;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setCommentError(errorMessage);

      if (canRetry && retryCount < 2) {
        setRetryCount((prev) => prev + 1);
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0d0d0f]" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto">
        {/* Post Content */}
        <article
          className={cn(
            "border-b pb-6 mb-6",
            isDarkMode ? "border-gray-800" : "border-gray-200"
          )}
        >
          {/* Post Header */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm",
                  isDarkMode ? "bg-gray-800" : "bg-blue-500"
                )}
              >
                r
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className={cn(
                      "text-sm font-medium cursor-pointer hover:underline",
                      isDarkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-blue-600"
                    )}
                    onClick={() => navigate(`/r/${getSubredditName()}`)}
                  >
                    r/{getSubredditName()}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    • Posted by u/{postAuthor?.username || "loading..."} •{" "}
                    {formatTimeAgo(post?.createdAt || new Date().toISOString())}
                  </span>
                </div>
                {(post?.isPinned || post?.isNSFW || post?.isSpoiler) && (
                  <div className="flex items-center space-x-2 mt-1">
                    {post?.isPinned && (
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded",
                          isDarkMode
                            ? "bg-green-900 text-green-300"
                            : "bg-green-100 text-green-800"
                        )}
                      >
                        Pinned
                      </span>
                    )}
                    {post?.isNSFW && (
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded",
                          isDarkMode
                            ? "bg-red-900 text-red-300"
                            : "bg-red-100 text-red-800"
                        )}
                      >
                        NSFW
                      </span>
                    )}
                    {post?.isSpoiler && (
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded",
                          isDarkMode
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-yellow-100 text-yellow-800"
                        )}
                      >
                        Spoiler
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Post Title */}
          <h1
            className={cn(
              "text-2xl font-bold mb-4",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            {post?.title}
          </h1>

          {/* Post Content */}
          {post?.content?.type === "text" && post?.content?.text && (
            <div className="mb-6">
              <p
                className={cn(
                  "text-base whitespace-pre-wrap",
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                )}
              >
                {post?.content?.text}
              </p>
            </div>
          )}

          {getVideoUrl() ? (
            <div className="mb-6">
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
            <div className="mb-6">
              <img
                src={getImageUrl()}
                alt={post?.title || "Post image"}
                className="w-full rounded-lg"
              />
            </div>
          ) : null}

          {post?.content?.type === "link" &&
            post?.content?.url &&
            !getImageUrl() &&
            !getVideoUrl() && (
              <div className="mb-6">
                <a
                  href={post?.content?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "block p-4 rounded-lg border",
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 hover:bg-gray-800"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-base font-medium",
                          isDarkMode ? "text-white" : "text-gray-900"
                        )}
                      >
                        {post.content.title || "External Link"}
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )}
                      >
                        {post.content.url}
                      </p>
                    </div>
                    <div className="text-gray-400">
                      <svg
                        className="w-6 h-6"
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

          {/* Post Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <button
                onClick={() => handleVote(1)}
                className={cn(
                  "flex items-center space-x-1 px-3 py-2 rounded-full transition-colors",
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
                <span className="text-sm font-medium">
                  {formatScore((post?.upvotes || 0) - (post?.downvotes || 0))}
                </span>
              </button>
              <button
                onClick={() => handleVote(-1)}
                className={cn(
                  "flex items-center px-3 py-2 rounded-full transition-colors ml-1",
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
            </div>

            <div
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-full",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              <IconWrapper size="sm">
                <CommentIcon />
              </IconWrapper>
              <span className="text-sm font-medium">
                {comments ? comments.length : 0} Comment
                {comments && comments.length !== 1 ? "s" : ""}
              </span>
            </div>

            <button
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-full transition-colors",
                isDarkMode
                  ? "text-gray-400 hover:bg-gray-800"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <IconWrapper size="sm">
                <ShareIcon />
              </IconWrapper>
              <span className="text-sm font-medium">Share</span>
            </button>

            <button
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-full transition-colors",
                isDarkMode
                  ? "text-gray-400 hover:bg-gray-800"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <IconWrapper size="sm">
                <SaveIcon />
              </IconWrapper>
              <span className="text-sm font-medium">Save</span>
            </button>
          </div>
        </article>

        {/* Comment Input */}
        {commentError && (
          <div
            className={cn(
              "mb-4 p-3 rounded-lg border",
              isDarkMode
                ? "bg-red-900/20 border-red-800 text-red-400"
                : "bg-red-50 border-red-200 text-red-600"
            )}
          >
            <p className="text-sm">
              <strong>Error creating comment:</strong> {commentError}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setCommentError(null)}
                className={cn(
                  "text-xs underline",
                  isDarkMode ? "text-red-300" : "text-red-500"
                )}
              >
                Dismiss
              </button>
              {retryCount < 2 && commentError.includes("Server error") && (
                <button
                  onClick={() => {
                    setCommentError(null);
                  }}
                  className={cn(
                    "text-xs underline font-medium",
                    isDarkMode ? "text-red-200" : "text-red-700"
                  )}
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
        <SimpleCommentInput
          onSubmit={handleComment}
          isLoading={createCommentMutation.isPending}
          userAvatar={currentUserData?.avatarUrl}
          username={currentUserData?.username}
          shouldReset={commentSuccess}
        />

        {/* Comments Section */}
        <div>
          <div className="mb-6">
            <h2
              className={cn(
                "text-lg font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            >
              Comments ({comments ? comments.length : 0})
            </h2>
          </div>

          {commentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <p
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}
              >
                Loading comments...
              </p>
            </div>
          ) : commentsError ? (
            <div className="flex items-center justify-center py-8">
              <p
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-red-400" : "text-red-500"
                )}
              >
                Error loading comments: {commentsError.message}
              </p>
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment: BackendComment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  postId={post?._id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p
                className={cn(
                  "text-lg font-medium mb-2",
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                )}
              >
                No comments yet
              </p>
              <p
                className={cn(
                  "text-sm mb-4",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}
              >
                Be the first to share what you think!
              </p>
              <p className="text-sm text-gray-500">
                Use the comment box above to add a comment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
