import {
  SignedIn,
  SignedOut,
  UserButton,
  useSignUp,
  useSignIn,
} from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  function CustomSignUp() {
    const { signUp } = useSignUp();
    const { signIn } = useSignIn();
    const [email, setEmail] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setPending(true);
      setError("");
      try {
        if (!signUp) throw new Error("SignUp not loaded");
        await signUp.create({ emailAddress: email });
        setSuccess(true);
      } catch (err: any) {
        setError(err.errors?.[0]?.message || err.message || "Sign up failed");
      }
      setPending(false);
    };

    const handleGoogleSignUp = async () => {
      console.log("Google button clicked"); // Debug log
      try {
        if (!signIn) throw new Error("SignIn not loaded");

        // Start OAuth flow with Google
        await signIn.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/",
          redirectUrlComplete: "/",
        });

        console.log("Google OAuth started successfully"); // Debug log
      } catch (err: any) {
        console.error("Google sign up error:", err);
        setError(
          err.errors?.[0]?.message ||
            err.message ||
            "Google sign-in failed. Please try again."
        );
      }
    };

    const handleAppleSignUp = async () => {
      try {
        if (!signIn) throw new Error("SignIn not loaded");

        await signIn.authenticateWithRedirect({
          strategy: "oauth_apple",
          redirectUrl: "/",
          redirectUrlComplete: "/",
        });
      } catch (err: any) {
        console.error("Apple sign up error:", err);
        setError(
          err.errors?.[0]?.message ||
            err.message ||
            "Apple sign-up failed. Please try again."
        );
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Sign Up
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="#" className="text-blue-600 underline">
            User Agreement
          </a>{" "}
          and acknowledge that you understand the{" "}
          <a href="#" className="text-blue-600 underline">
            Privacy Policy
          </a>
          .
        </p>

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center border border-gray-300 rounded-full py-3 mb-3 bg-white hover:bg-gray-50 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-gray-700 font-medium text-sm">
            Continue with Google
          </span>
        </button>

        {/* Apple Sign Up Button */}
        <button
          type="button"
          onClick={handleAppleSignUp}
          className="w-full flex items-center justify-center border border-gray-300 rounded-full py-3 mb-6 bg-white hover:bg-gray-50 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#000000"
              d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
            />
          </svg>
          <span className="text-gray-700 font-medium text-sm">
            Continue With Apple
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-400 text-xs font-medium uppercase">
            OR
          </span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit}>
          <div className="relative mb-2">
            <input
              type="email"
              required
              placeholder="Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-full border px-4 py-3 text-sm placeholder:text-gray-500 transition-all duration-200 ${
                email
                  ? "border-blue-500 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  : "border-gray-300 bg-gray-100 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              } focus:outline-none`}
            />
          </div>

          <div className="text-xs text-gray-500 mb-6">
            Already a redditor?{" "}
            <button
              type="button"
              onClick={() => navigate("/sign-in")}
              className="text-blue-600 underline hover:no-underline"
            >
              Log In
            </button>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={!email || pending}
            className={`w-full rounded-full py-4 text-white font-bold text-sm transition-all duration-200 ${
              email && !pending
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-gray-200 cursor-not-allowed text-gray-500"
            }`}
          >
            {pending ? "Please wait..." : "Continue"}
          </button>

          {/* Error/Success Messages */}
          {error && (
            <div className="text-red-500 text-xs mt-2 text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-xs mt-2 text-center">
              Sign up successful! Check your email for verification.
            </div>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Full page background SVG wallpaper */}
      <div className="absolute inset-0 bg-gray-200">
        <img
          src="/src/assets/standalone-auth-bg.svg"
          alt=""
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      {/* Header with Reddit logo */}
      <header className="relative z-20 bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <img
              src="/src/assets/reddit-icon-logo.svg"
              alt="Reddit"
              className="w-8 h-8"
            />
            <img
              src="/src/assets/reddit-name-letters.svg"
              alt="reddit"
              className="h-5 text-orange-500 dark:text-white"
            />
          </div>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <SignedOut>
          <CustomSignUp />
        </SignedOut>

        <SignedIn>
          <div className="bg-white shadow-xl p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Reddit!
            </h1>
            <p className="text-gray-600">You're successfully signed in.</p>
          </div>
        </SignedIn>
      </main>
    </div>
  );
}

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
