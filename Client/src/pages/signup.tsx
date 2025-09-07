import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const { isDarkMode } = useTheme();
import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header
        className={`${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } border-b`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link to="/" className="flex items-center">
            <img
              src="/src/assets/reddit-logo.svg"
              alt="Reddit"
              className="h-8 w-8 mr-2"
  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header
        className={`${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } border-b`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link to="/" className="flex items-center">
            <img
              src="/src/assets/reddit-logo.svg"
              alt="Reddit"
              className="h-8 w-8 mr-2"
            />
            <span
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              reddit
            </span>
          </Link>
            <span
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              reddit
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-lg p-8`}
          >
            <div className="text-center mb-6">
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Sign up
              </h1>
              <p
                className={`mt-2 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                By continuing, you agree to our User Agreement and acknowledge
                that you understand the Privacy Policy.
              </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-lg p-8`}
          >
            <div className="text-center mb-6">
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Sign up
              </h1>
              <p
                className={`mt-2 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                By continuing, you agree to our User Agreement and acknowledge
                that you understand the Privacy Policy.
              </p>
            </div>

            {/* Clerk SignUp Component */}
            <div className="flex justify-center">
              <SignUp
                signInUrl="/sign-in"
                redirectUrl="/"
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-orange-500 hover:bg-orange-600",
                    card: isDarkMode ? "bg-gray-800" : "bg-white",
                    headerTitle: isDarkMode ? "text-white" : "text-gray-900",
                    headerSubtitle: isDarkMode
                      ? "text-gray-400"
                      : "text-gray-600",
                    socialButtonsBlockButton: isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50",
                    formFieldInput: isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900",
                    formFieldLabel: isDarkMode
                      ? "text-gray-300"
                      : "text-gray-700",
                    footerActionLink: "text-orange-500 hover:text-orange-600",
                  },
                }}
              />
            </div>

            {/* Clerk SignUp Component */}
            <div className="flex justify-center">
              <SignUp
                signInUrl="/sign-in"
                redirectUrl="/"
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-orange-500 hover:bg-orange-600",
                    card: isDarkMode ? "bg-gray-800" : "bg-white",
                    headerTitle: isDarkMode ? "text-white" : "text-gray-900",
                    headerSubtitle: isDarkMode
                      ? "text-gray-400"
                      : "text-gray-600",
                    socialButtonsBlockButton: isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50",
                    formFieldInput: isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900",
                    formFieldLabel: isDarkMode
                      ? "text-gray-300"
                      : "text-gray-700",
                    footerActionLink: "text-orange-500 hover:text-orange-600",
                  },
                }}
              />
            </div>

            <div className="mt-6 text-center">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Already a redditor?{" "}
                <Link
                  to="/sign-in"
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Log In
                </Link>
              </p>
            </div>
            <div className="mt-6 text-center">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Already a redditor?{" "}
                <Link
                  to="/sign-in"
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`${
          isDarkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-600"
        } border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="#" className="hover:underline">
              User Agreement
            </Link>
            <Link to="#" className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:underline">
              Content Policy
            </Link>
            <Link to="#" className="hover:underline">
              Moderator Code of Conduct
            </Link>
          </div>
          <div className="text-center mt-4 text-xs">
            <p>Reddit Inc © 2024. All rights reserved.</p>
          </div>
        </div>
      </footer>
        </div>
      </footer>
    </div>
  );
};
};

import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header
        className={`${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } border-b`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link to="/" className="flex items-center">
            <img
              src="/src/assets/reddit-logo.svg"
              alt="Reddit"
              className="h-8 w-8 mr-2"
            />
            <span
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              reddit
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-lg p-8`}
          >
            <div className="text-center mb-6">
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Sign up
              </h1>
              <p
                className={`mt-2 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                By continuing, you agree to our User Agreement and acknowledge
                that you understand the Privacy Policy.
              </p>
            </div>

            {/* Clerk SignUp Component */}
            <div className="flex justify-center">
              <SignUp
                signInUrl="/sign-in"
                redirectUrl="/"
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-orange-500 hover:bg-orange-600",
                    card: isDarkMode ? "bg-gray-800" : "bg-white",
                    headerTitle: isDarkMode ? "text-white" : "text-gray-900",
                    headerSubtitle: isDarkMode
                      ? "text-gray-400"
                      : "text-gray-600",
                    socialButtonsBlockButton: isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50",
                    formFieldInput: isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900",
                    formFieldLabel: isDarkMode
                      ? "text-gray-300"
                      : "text-gray-700",
                    footerActionLink: "text-orange-500 hover:text-orange-600",
                  },
                }}
              />
            </div>

            <div className="mt-6 text-center">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Already a redditor?{" "}
                <Link
                  to="/sign-in"
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`${
          isDarkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-600"
        } border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="#" className="hover:underline">
              User Agreement
            </Link>
            <Link to="#" className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:underline">
              Content Policy
            </Link>
            <Link to="#" className="hover:underline">
              Moderator Code of Conduct
            </Link>
          </div>
          <div className="text-center mt-4 text-xs">
            <p>Reddit Inc © 2024. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignUpPage;
