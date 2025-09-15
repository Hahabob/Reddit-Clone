import React, { useState, useRef } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { RightSidebar } from "./RightSidebar";
import { PostFeed, type PostFeedRef } from "../Posts/PostFeed";
import { useTheme } from "../../contexts/ThemeContext";

export const MainLayout: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
            <PostFeed ref={postFeedRef} />
          </main>
          <aside className="hidden xl:block w-80">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};
