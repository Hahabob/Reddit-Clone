import React, { useState, useRef } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
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
        <div className="hidden xl:block">
          <SignedOut>
            <RightSidebar />
          </SignedOut>
          <SignedIn>
            <div
              className={`w-80 h-screen overflow-y-auto ${
                isDarkMode ? "bg-gray-900" : "bg-white"
              } border-l ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};
