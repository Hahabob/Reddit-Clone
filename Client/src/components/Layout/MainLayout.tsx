import React, { useState, useRef } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { RightSidebar } from "./RightSidebar";
import { PostFeed, type PostFeedRef } from "../Posts/PostFeed";
import { useTheme } from "../../contexts/ThemeContext";

export const MainLayout: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn] = useState(false);
  const postFeedRef = useRef<PostFeedRef>(null);

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
    if (postFeedRef.current) {
      postFeedRef.current.goToHome();
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-black" : "bg-gray-50"}`}>
      <Header
        onToggleSidebar={toggleSidebar}
        onSearch={handleSearch}
        onGoToHome={handleGoToHome}
        isLoggedIn={isLoggedIn}
      />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onGoToHome={handleGoToHome} />
        <main className="flex-1 min-h-screen">
          <PostFeed ref={postFeedRef} />
        </main>
        <aside className="hidden xl:block">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
};
