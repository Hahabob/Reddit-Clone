import React from "react";
import { useParams } from "react-router-dom";
import {
  useSubredditByName,
  useJoinedSubreddits,
  useCurrentUser,
} from "../hooks";
import { useTheme } from "../contexts/ThemeContext";
import { SubredditHeader } from "../components/Subreddit/SubredditHeader";
import { SubredditPostFeed } from "../components/Subreddit/SubredditPostFeed";
import { RightSidebar } from "../components/Layout/RightSidebar";
import { cn } from "../lib/utils";

export const SubredditPage: React.FC = () => {
  const { subreddit: subredditName } = useParams<{ subreddit: string }>();
  const { isDarkMode } = useTheme();

  const {
    data: subredditResponse,
    isLoading,
    error,
  } = useSubredditByName(subredditName || "");
  const { data: currentUserData } = useCurrentUser();
  const { data: joinedSubreddits = [] } = useJoinedSubreddits(
    currentUserData?.data?._id || ""
  );

  if (!subredditName) {
    return (
      <div
        className={cn(
          "flex items-center justify-center min-h-screen",
          isDarkMode ? "bg-[#0d0d0f] text-white" : "bg-white text-black"
        )}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid subreddit</h1>
          <p className="text-gray-500">The subreddit name is missing.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center min-h-screen",
          isDarkMode ? "bg-[#0d0d0f] text-white" : "bg-white text-black"
        )}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4 mx-auto"></div>
          <p className="text-lg">Loading r/{subredditName}...</p>
        </div>
      </div>
    );
  }

  if (error || !subredditResponse?.data) {
    return (
      <div
        className={cn(
          "flex items-center justify-center min-h-screen",
          isDarkMode ? "bg-[#0d0d0f] text-white" : "bg-white text-black"
        )}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">r/{subredditName}</h1>
          <p className="text-gray-500 mb-4">
            Sorry, this community doesn't exist or has been banned.
          </p>
          <button
            onClick={() => window.history.back()}
            className={cn(
              "px-4 py-2 rounded-full font-medium",
              "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const subreddit = subredditResponse.data;
  const isJoined = joinedSubreddits.some(
    (joined: any) => joined._id === subreddit._id
  );

  return (
    <div
      className={cn("min-h-screen", isDarkMode ? "bg-[#0d0d0f]" : "bg-white")}
    >
      <div className="max-w-7xl mx-auto">
        <SubredditHeader subreddit={subreddit} isJoined={isJoined} />

        <div className="flex">
          <main className="flex-1 min-h-screen max-w-3xl">
            <SubredditPostFeed
              subredditId={subreddit._id}
              subredditName={subreddit.name}
            />
          </main>

          <aside className="hidden xl:block w-80 p-4">
            <div className="sticky top-4">
              <div
                className={cn(
                  "rounded-lg border p-4 mb-4",
                  isDarkMode
                    ? "bg-black border-gray-800"
                    : "bg-white border-gray-200"
                )}
              >
                <div className="flex items-center mb-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3",
                      isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-700"
                    )}
                  >
                    r/
                  </div>
                  <div>
                    <h3
                      className={cn(
                        "font-medium",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}
                    >
                      r/{subreddit.name}
                    </h3>
                  </div>
                </div>

                {subreddit.description && (
                  <p
                    className={cn(
                      "text-sm mb-3",
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    )}
                  >
                    {subreddit.description}
                  </p>
                )}

                <div
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  <div className="flex justify-between mb-1">
                    <span>Members</span>
                    <span className="font-medium">
                      {(
                        subreddit.memberCount || subreddit.members.length
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span className="font-medium">
                      {new Date(subreddit.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <RightSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
