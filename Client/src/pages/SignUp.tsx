import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center mb-8">
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
          </Link>
          <h2
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Sign up
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
        </div>

        {/* Clerk SignUp Component */}
        <div className="mt-8">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-orange-500 hover:bg-orange-600 text-sm normal-case",
                card: `${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`,
                headerTitle: `${isDarkMode ? "text-white" : "text-gray-900"}`,
                headerSubtitle: `${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`,
                socialButtonsBlockButton: `${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`,
                formFieldLabel: `${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`,
                formFieldInput: `${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`,
                footerActionText: `${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`,
                footerActionLink: "text-orange-500 hover:text-orange-600",
              },
            }}
            redirectUrl="/"
            signInUrl="/sign-in"
          />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
