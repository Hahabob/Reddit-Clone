import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { RightSidebar } from "./RightSidebar";
import { PostFeed, type PostFeedRef } from "../Posts/PostFeed";
import CreatePost from "../Posts/CreatePost";
import { ProfilePage } from "../../pages/ProfilePage";
import { useTheme } from "../../contexts/ThemeContext";

export const MainLayout: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const postFeedRef = useRef<PostFeedRef>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isUserProfile = location.pathname.startsWith("/user/");
  const isCreatePost = location.pathname === "/create-post";

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

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0d0d0f]" : "bg-white"}`}>
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
        {isUserProfile ? (
          <ProfilePage />
        ) : isCreatePost ? (
          <div className="flex-1 flex justify-center">
            <main className="w-full max-w-2xl p-4 mr-50">
              <CreatePost />
            </main>
          </div>
        ) : (
          <div className="flex-1 flex ml-50">
            <main className="flex-1 min-h-screen max-w-2xl p-4">
              <PostFeed ref={postFeedRef} />
            </main>
            <aside className="hidden xl:block w-80 p-4">
              <RightSidebar />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
