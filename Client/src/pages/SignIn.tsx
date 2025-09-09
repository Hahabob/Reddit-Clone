import { useSignIn } from "@clerk/clerk-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "../lib/utils";

// Step 1: Define validation schema
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Step 2: Create TypeScript type from schema
type SignInFormData = z.infer<typeof signInSchema>;

const CustomSignIn: React.FC = () => {
  // Step 3: Set up hooks and state
  const { signIn, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  // Step 4: Set up form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  // Step 5: Handle Google sign-in
  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      console.error("Google sign-in error:", err);

      // Handle specific OAuth errors
      if (err.errors) {
        err.errors.forEach((error: any) => {
          console.error("OAuth error:", error.longMessage || error.message);
        });
      }

      // Reset loading state on error since redirect won't happen
      setIsLoading(false);
    }
    // Note: Don't set loading to false in finally block for OAuth
    // because successful OAuth will redirect away from this page
  };

  // Step 6: Handle form submission (email-only for now)
  const onSubmit = async (_data: SignInFormData) => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      // For now, we'll show a message that this is email-only
      // In a real implementation, this would trigger a password reset or magic link
      setError("email", {
        message:
          "Email-only sign-in coming soon. Please use Google sign-in for now.",
      });
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setError("email", { message: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 7: Main sign-in form
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Reddit Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src="/src/assets/reddit-logo.svg"
              alt="Reddit"
              className="w-8 h-8"
            />
          </Link>
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Log In
          </h1>

          {/* Terms Text */}
          <p className="text-xs text-center text-gray-600 mb-6">
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
          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 mb-4 border border-gray-300 rounded-full font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3"
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

          {/* Apple Sign In Button */}
          <button
            type="button"
            disabled={isLoading}
            className="w-full py-3 px-4 mb-6 border border-gray-300 rounded-full font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span>Continue With Apple</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Input */}
            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email or username *"
                className={cn(
                  "w-full px-4 py-3 rounded-full border bg-gray-100 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-transparent"
                )}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 px-4">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Log In Button */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-full transition-colors"
            >
              {isLoading ? "Signing In..." : "Log In"}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="text-center mt-4">
            <Link
              to="/reset-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
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
