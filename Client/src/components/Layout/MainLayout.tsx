import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { RightSidebar } from "./RightSidebar";
import { PostFeed } from "../Posts/PostFeed";
import { useTheme } from "../../contexts/ThemeContext";

export const MainLayout: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <Header onToggleSidebar={toggleSidebar} />

      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <PostFeed />
        </main>

        {/* Right Sidebar - only show on medium screens and below */}
        <div className="hidden xl:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};
