import React from "react";
import { useParams } from "react-router-dom";
import { UserProfile } from "../components/Profile/UserProfile";
import { ProfileSidebar } from "../components/Profile/ProfileSidebar";

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  return (
    <div className="flex max-w-7xl mx-auto dark:bg-[#0d0d0f] bg-white">
      <main className="flex-1 min-h-screen max-w-2xl p-4">
        <UserProfile />
      </main>
      <aside className="hidden xl:block w-80 p-4 ml-20">
        <ProfileSidebar username={username || ""} />
      </aside>
    </div>
  );
};
