import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { cn } from "../lib/utils";

const CustomSignIn = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error("Google sign-in error:", err);
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_apple",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error("Apple sign-in error:", err);
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !email) return;

    setIsLoading(true);
    setError("");

    try {
      // Start the sign-in process
      await signIn.create({
        identifier: email,
      });

      // Send the email verification code
      const emailCodeFactor = signIn.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );

      if (emailCodeFactor && "emailAddressId" in emailCodeFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });
      }

      setVerificationStep(true);
    } catch (err: any) {
      console.error("Email sign-in error:", err);

      if (err.errors) {
        err.errors.forEach((error: any) => {
          if (error.code === "form_identifier_not_found") {
            setError("No account found with this email. Please sign up first.");
          } else {
            setError(
              error.longMessage || "Something went wrong. Please try again."
            );
          }
        });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const completeSignIn = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: verificationCode,
      });

      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });
        navigate("/");
      }
    } catch (err: any) {
      console.error("Verification error:", err);

      if (err.errors) {
        err.errors.forEach((error: any) => {
          setError(error.longMessage || "Invalid code. Please try again.");
        });
      } else {
        setError("Invalid code. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Verification step UI
  if (verificationStep) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-4 py-12 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <img
                src="/src/assets/reddit-logo.svg"
                alt="Reddit"
                className="w-8 h-8"
              />
            </Link>
          </div>

          <div
            className={`rounded-2xl shadow-lg border p-8 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-2xl font-bold text-center mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Check your email
            </h2>
            <p
              className={`text-sm text-center mb-6 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              We sent a verification code to <strong>{email}</strong>
            </p>

            <form onSubmit={handleVerification} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter verification code"
                  className={cn(
                    "w-full px-4 py-3 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-100 border-transparent text-gray-900 placeholder-gray-500"
                  )}
                  required
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500 px-4">{error}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-full transition-colors cursor-pointer"
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setVerificationStep(false);
                  setVerificationCode("");
                  setError("");
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Back to sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src="/src/assets/reddit-logo.svg"
              alt="Reddit"
              className="w-8 h-8"
            />
          </Link>
        </div>
        <div
          className={`rounded-2xl shadow-lg border p-8 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h1
            className={`text-2xl font-bold text-center mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Log In
          </h1>
          <p
            className={`text-xs text-center mb-6 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            By continuing, you agree to our{" "}
            <Link
              to="/user-agreement"
              className="text-blue-600 hover:underline"
            >
              User Agreement
            </Link>{" "}
            and acknowledge that you understand the{" "}
            <Link
              to="/privacy-policy"
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            aria-label="Sign in with Google"
            className={`w-full py-3 px-4 mb-4 border rounded-full font-medium transition-colors flex items-center justify-center space-x-3 cursor-pointer ${
              isDarkMode
                ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={handleAppleSignIn}
            disabled={isLoading}
            aria-label="Sign in with Apple"
            className={`w-full py-3 px-4 mb-6 border rounded-full font-medium transition-colors flex items-center justify-center space-x-3 cursor-pointer ${
              isDarkMode
                ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span>Continue With Apple</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`w-full border-t ${
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-2 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-400"
                    : "bg-white text-gray-500"
                }`}
              >
                OR
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={cn(
                  "w-full px-4 py-3 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-100 border-transparent text-gray-900 placeholder-gray-500",
                  error
                    ? isDarkMode
                      ? "border-red-500 bg-red-900/20"
                      : "border-red-500 bg-red-50"
                    : ""
                )}
                required
              />
              {error && (
                <p className="mt-1 text-sm text-red-500 px-4">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-full transition-colors cursor-pointer"
            >
              {isLoading ? "Sending code..." : "Log In"}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            New to Reddit?{" "}
            <Link
              to="/sign-up"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomSignIn;
