import React from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  useJoinSubreddit,
  useLeaveSubreddit,
  useCurrentUser,
} from "../../hooks";
import { cn } from "../../lib/utils";
import type { BackendSubreddit } from "../../types/backend";

interface SubredditHeaderProps {
  subreddit: BackendSubreddit;
  isJoined?: boolean;
}

export const SubredditHeader: React.FC<SubredditHeaderProps> = ({
  subreddit,
  isJoined = false,
}) => {
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const { data: currentUserData } = useCurrentUser();
  const joinSubredditMutation = useJoinSubreddit();
  const leaveSubredditMutation = useLeaveSubreddit();

  const handleJoinLeave = async () => {
    if (!currentUserData?.data?._id) return;

    if (isJoined) {
      leaveSubredditMutation.mutate(subreddit._id);
    } else {
      joinSubredditMutation.mutate(subreddit._id);
    }
  };

  const formatMemberCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className={cn("relative", isDarkMode ? "bg-black" : "bg-white")}>
      {/* Banner */}
      <div className="relative h-48 lg:h-64">
        {subreddit.bannerUrl ? (
          <img
            src={subreddit.bannerUrl}
            alt={`r/${subreddit.name} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full",
              isDarkMode ? "bg-gray-800" : "bg-gray-200"
            )}
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative px-4 pb-4">
        {/* Icon and basic info */}
        <div className="flex items-end -mt-8 mb-4">
          <div className="relative">
            {subreddit.iconUrl ? (
              <img
                src={subreddit.iconUrl}
                alt={`r/${subreddit.name} icon`}
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-4 border-white bg-white"
              />
            ) : (
              <div
                className={cn(
                  "w-16 h-16 lg:w-20 lg:h-20 rounded-full border-4 border-white flex items-center justify-center text-2xl font-bold",
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-300 text-gray-700"
                )}
              >
                r/
              </div>
            )}
          </div>
          <div className="ml-4 flex-1">
            <h1
              className={cn(
                "text-2xl lg:text-3xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            >
              r/{subreddit.name}
            </h1>
            <p
              className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}
            >
              {formatMemberCount(
                subreddit.memberCount || subreddit.members.length
              )}{" "}
              members
            </p>
          </div>
          {user && (
            <div className="ml-4">
              <button
                onClick={handleJoinLeave}
                disabled={
                  joinSubredditMutation.isPending ||
                  leaveSubredditMutation.isPending
                }
                className={cn(
                  "px-6 py-2 rounded-full font-medium transition-colors",
                  isJoined
                    ? isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300 border border-gray-300"
                    : "bg-blue-600 text-white hover:bg-blue-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {joinSubredditMutation.isPending ||
                leaveSubredditMutation.isPending
                  ? "..."
                  : isJoined
                  ? "Joined"
                  : "Join"}
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        {subreddit.description && (
          <div className="mb-4">
            <p
              className={cn(
                "text-sm leading-relaxed",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}
            >
              {subreddit.description}
            </p>
          </div>
        )}

        {/* Topics */}
        {subreddit.topics && subreddit.topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {subreddit.topics.map((topic, index) => (
              <span
                key={index}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  isDarkMode
                    ? "bg-gray-800 text-gray-300 border border-gray-700"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                )}
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
