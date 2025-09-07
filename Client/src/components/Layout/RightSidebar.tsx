import React from "react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/utils";

export const RightSidebar: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const popularCommunities = [
    { name: "NoStupidQuestions", members: "6,570,220" },
    { name: "Minecraft", members: "8,512,590" },
    { name: "Fitness", members: "12,430,561" },
    { name: "DnD", members: "4,155,949" },
    { name: "videos", members: "26,748,233" },
  ];

  const handleLoginClick = () => {
    navigate("/sign-in");
  };

  const handleSignUpClick = () => {
    navigate("/sign-up");
  };

  return (
    <aside
      className={`w-80 h-screen overflow-y-auto ${
        isDarkMode ? "bg-black" : "bg-white"
      } border-l ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
    >
      <div className="p-4">
        {/* User Actions */}
        <div
          className={cn(
            "p-4 rounded-lg",
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          )}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-3",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            Log In / Sign Up
          </h3>
          <div className="space-y-2">
            <button
              onClick={handleLoginClick}
              className={cn(
                "w-full py-2 px-4 rounded-full font-medium transition-colors",
                "bg-orange-500 text-white hover:bg-orange-600"
              )}
            >
              Log In
            </button>
            <button
              onClick={handleSignUpClick}
              className={cn(
                "w-full py-2 px-4 rounded-full font-medium border transition-colors",
                isDarkMode
                  ? "border-gray-600 text-white hover:bg-gray-900"
                  : "border-gray-300 text-gray-900 hover:bg-gray-100"
              )}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* User Profile - Only show when signed in */}
        <SignedIn>
          <div
            className={cn(
              "p-4 rounded-lg mb-4",
              isDarkMode ? "bg-gray-800" : "bg-gray-50"
            )}
          >
            <h3
              className={cn(
                "text-lg font-semibold mb-3",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            >
              Welcome back!
            </h3>
            <div className="flex items-center justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </SignedIn>

        <div className="mt-4">
          <button
            className={cn(
              "w-full text-left p-3 rounded-lg transition-colors",
              isDarkMode
                ? "text-gray-300 hover:bg-gray-900"
                ? "text-gray-300 hover:bg-gray-900"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <span className="font-medium">Advertise on Reddit</span>
          </button>
          <button
            className={cn(
              "w-full text-left p-3 rounded-lg transition-colors",
              isDarkMode
                ? "text-gray-300 hover:bg-gray-900"
                ? "text-gray-300 hover:bg-gray-900"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <span className="font-medium">Try Reddit Pro BETA</span>
          </button>
        </div>

        <div className="mt-6">
          <h3
            className={cn(
              "text-lg font-semibold mb-3",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            POPULAR COMMUNITIES
          </h3>
          <div className="space-y-2">
            {popularCommunities.map((community, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full mr-3 ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  ></div>
                  <div>
                    <p
                      className={cn(
                        "font-medium",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}
                    >
                      r/{community.name}
                    </p>
                    <p
                      className={cn(
                        "text-sm",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}
                    >
                      {community.members} members
                    </p>
                  </div>
                </div>
                <button
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                    "bg-orange-500 text-white hover:bg-orange-600"
                  )}
                >
                  Join
                </button>
              </div>
            ))}
            <button
              className={cn(
                "w-full text-center py-2 text-sm font-medium hover:underline transition-colors",
                isDarkMode ? "text-orange-400" : "text-orange-600"
              )}
            >
              See more
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div
            className={cn(
              "p-4 rounded-lg",
              isDarkMode ? "bg-gray-900" : "bg-gray-50"
              isDarkMode ? "bg-gray-900" : "bg-gray-50"
            )}
          >
            <p
              className={cn(
                "text-sm",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}
            >
              Syko Stu released from the I and is now home resting. He sustained
              serious trauma to his head and neck area...
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
