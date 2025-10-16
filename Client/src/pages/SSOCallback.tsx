import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { useTheme } from "../contexts/ThemeContext";

const SSOCallback = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">r</span>
            </div>
            <span
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              reddit
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p
            className={`text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Completing sign up...
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Please wait while we finish setting up your account.
          </p>
        </div>
      </div>

      <AuthenticateWithRedirectCallback />
    </div>
  );
};

export default SSOCallback;
