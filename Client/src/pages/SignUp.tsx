import { useSignUp } from "@clerk/clerk-react";
import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "../lib/utils";

// Step 1: Define validation schema
const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Step 2: Create TypeScript type from schema
type SignUpFormData = z.infer<typeof signUpSchema>;

const CustomSignUp: React.FC = () => {
  // Step 3: Set up hooks and state
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Step 4: Set up form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  // Step 5: Handle Google sign-up
  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      console.error("Google sign-up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 6: Handle form submission
  const onSubmit = async (data: SignUpFormData) => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      // Create the user account
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerificationStep(true);
    } catch (err: any) {
      console.error("Sign up error:", err);

      // Handle specific errors
      if (err.errors) {
        err.errors.forEach((error: any) => {
          if (error.meta?.paramName === "email_address") {
            setError("email", { message: error.longMessage });
          } else if (error.meta?.paramName === "password") {
            setError("password", { message: error.longMessage });
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 7: Handle email verification
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        navigate("/");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 8: Render verification step if needed
  if (verificationStep) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-4 py-12 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-md w-full space-y-8">
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
              Check your email
            </h2>
            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              We sent a verification code to your email
            </p>
          </div>

          <form onSubmit={handleVerification} className="space-y-4">
            <div>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                className={cn(
                  "w-full px-4 py-3 rounded-lg border transition-colors",
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                )}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-full transition-colors"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 9: Main sign-up form
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

        {/* Form */}
        <div className="mt-8">
          <div
            className={cn(
              "p-8 rounded-lg border",
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            )}
          >
            {/* Google Sign Up Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className={cn(
                "w-full py-3 px-4 mb-4 border rounded-full font-medium transition-colors flex items-center justify-center space-x-2",
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
              )}
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

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={cn(
                    "w-full border-t",
                    isDarkMode ? "border-gray-600" : "border-gray-300"
                  )}
                />
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={cn(
                    "px-2",
                    isDarkMode
                      ? "bg-gray-800 text-gray-400"
                      : "bg-white text-gray-500"
                  )}
                >
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Input */}
              <div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-colors",
                    errors.email
                      ? "border-red-500"
                      : isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500"
                  )}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-colors",
                    errors.password
                      ? "border-red-500"
                      : isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500"
                  )}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-full transition-colors"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            {/* Terms */}
            <p
              className={cn(
                "mt-4 text-xs text-center",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              By continuing, you agree to our{" "}
              <Link
                to="/user-agreement"
                className="text-orange-500 hover:text-orange-600"
              >
                User Agreement
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="text-orange-500 hover:text-orange-600"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
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

export default CustomSignUp;
