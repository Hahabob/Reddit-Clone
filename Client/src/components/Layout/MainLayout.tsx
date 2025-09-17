import React, { useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { RightSidebar } from "./RightSidebar";
import { PostFeed, type PostFeedRef } from "../Posts/PostFeed";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "@clerk/clerk-react";

export const MainLayout: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const postFeedRef = useRef<PostFeedRef>(null);
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const { user } = useUser();
  const navigate = useNavigate();

  const isUserProfile = location.pathname.startsWith("/user/");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (
    query: string,
    sort?: "relevance" | "hot" | "top" | "new" | "comments",
    time?: "hour" | "day" | "week" | "month" | "year" | "all"
  ) => {
    if (postFeedRef.current) {
      postFeedRef.current.handleSearch(query, sort, time);
    }
  };

  const handleGoToHome = () => {
    navigate("/");
    if (postFeedRef.current) {
      postFeedRef.current.goToHome();
    }
  };

  const UserProfileContent = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-lg p-6`}
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            <img
              src={user?.imageUrl || "/default-avatar.png"}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              u/{username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              0
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Posts
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              0
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Comments
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              0
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Karma
            </div>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Posts
          </h2>
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No posts yet
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-black" : "bg-white"}`}>
      <Header
        onToggleSidebar={toggleSidebar}
        onSearch={handleSearch}
        onGoToHome={handleGoToHome}
      />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onGoToHome={handleGoToHome}
        />
        <div className="flex-1 flex ml-50">
          <main className="flex-1 min-h-screen max-w-2xl">
            {isUserProfile ? (
              <UserProfileContent />
            ) : (
              <PostFeed ref={postFeedRef} />
            )}
          </main>
          <aside className="hidden xl:block w-80">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};
