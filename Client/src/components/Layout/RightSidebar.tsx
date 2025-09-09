import React from "react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/utils";

export const RightSidebar: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { user } = useUser();

  const popularCommunities = [
    { name: "NoStupidQuestions", members: "6,570,220" },
    { name: "Minecraft", members: "8,512,590" },
    { name: "Fitness", members: "12,430,561" },
    { name: "DnD", members: "4,155,949" },
    { name: "videos", members: "26,748,233" },
  ];

  return (
    <aside
      className={cn(
        "w-80 h-screen overflow-y-auto border-l transition-colors",
        isDarkMode ? "bg-black border-gray-700" : "bg-white border-gray-200"
      )}
    >
      <div className="p-4">
        {/* Authentication Section */}
        <SignedOut>
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
                onClick={() => navigate("/sign-in")}
                className={cn(
                  "w-full py-2 px-4 rounded-full font-medium transition-colors",
                  "bg-orange-500 text-white hover:bg-orange-600"
                )}
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/sign-up")}
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
        </SignedOut>

        {/* User Profile Section - When Signed In */}
        <SignedIn>
          <div
            className={cn(
              "p-4 rounded-lg",
              isDarkMode ? "bg-gray-900" : "bg-gray-50"
            )}
          >
            <div className="flex items-center space-x-3 mb-4">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200",
                    userButtonPopoverActionButton: isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100",
                  },
                }}
              />
              <div className="flex-1">
                <p
                  className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}
                >
                  {user?.firstName || user?.username || "User"}
                </p>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  @
                  {user?.username ||
                    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                className={cn(
                  "w-full text-left py-2 px-3 rounded-md text-sm transition-colors",
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                Profile
              </button>
              <button
                className={cn(
                  "w-full text-left py-2 px-3 rounded-md text-sm transition-colors",
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                Settings
              </button>
            </div>
          </div>
        </SignedIn>

        <div className="mt-4">
          <button
            className={cn(
              "w-full text-left p-3 rounded-lg transition-colors",
              isDarkMode
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
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg",
                  isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-100"
                )}
              >
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full mr-3",
                      isDarkMode ? "bg-gray-800" : "bg-gray-200"
                    )}
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
