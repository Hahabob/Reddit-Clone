import { SignedIn, SignedOut, UserButton, useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();

  function CustomSignIn() {
    const { signIn } = useSignIn();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setPending(true);
      setError("");
      try {
        if (!signIn) throw new Error("SignIn not loaded");

        const result = await signIn.create({
          identifier: email,
          password: password,
        });

        if (result.status === "complete") {
          // Redirect to home page or wherever you want
          window.location.href = "/";
        }
      } catch (err: any) {
        setError(err.errors?.[0]?.message || err.message || "Sign in failed");
      }
      setPending(false);
    };

    const handleGoogleSignIn = async () => {
      try {
        if (!signIn) throw new Error("SignIn not loaded");

        await signIn.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/",
          redirectUrlComplete: "/",
        });
      } catch (err: any) {
        console.error("Google sign in error:", err);
        setError(
          err.errors?.[0]?.message ||
            err.message ||
            "Google sign-in failed. Please try again."
        );
      }
    };

    const handleAppleSignIn = async () => {
      try {
        if (!signIn) throw new Error("SignIn not loaded");

        await signIn.authenticateWithRedirect({
          strategy: "oauth_apple",
          redirectUrl: "/",
          redirectUrlComplete: "/",
        });
      } catch (err: any) {
        console.error("Apple sign in error:", err);
        setError(
          err.errors?.[0]?.message ||
            err.message ||
            "Apple sign-in failed. Please try again."
        );
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Log In
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

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
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

        {/* Apple Sign In Button */}
        <button
          type="button"
          onClick={handleAppleSignIn}
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

        {/* Email and Password Form */}
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <input
              type="email"
              required
              placeholder="Email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-100 px-4 py-3 text-sm placeholder:text-gray-500 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
            <span className="absolute right-4 top-3 text-red-500 text-sm">
              *
            </span>
          </div>

          <div className="relative mb-4">
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border-2 border-blue-500 bg-white px-4 py-3 text-sm placeholder:text-gray-500 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
            <span className="absolute right-4 top-3 text-red-500 text-sm">
              *
            </span>
          </div>

          <div className="text-left mb-4">
            <button
              type="button"
              className="text-blue-600 text-sm hover:underline"
            >
              Forget password?
            </button>
          </div>

          <div className="text-xs text-gray-500 mb-6">
            New to Reddit?{" "}
            <button
              type="button"
              onClick={() => navigate("/sign-up")}
              className="text-blue-600 underline hover:no-underline"
            >
              Sign Up
            </button>
          </div>

          {/* Log In Button */}
          <button
            type="submit"
            disabled={!email || !password || pending}
            className={`w-full rounded-full py-4 text-white font-bold text-sm transition-all duration-200 ${
              email && password && !pending
                ? "bg-gray-400 hover:bg-gray-500"
                : "bg-gray-200 cursor-not-allowed text-gray-500"
            }`}
          >
            {pending ? "Logging in..." : "Log In"}
          </button>

          {/* Error Messages */}
          {error && (
            <div className="text-red-500 text-xs mt-2 text-center">{error}</div>
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
              src="/src/assets/reddit-logo.svg"
              alt="Reddit"
              className="w-8 h-8"
            />
            <img
              src="/src/assets/reddit-logo-name.svg"
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
          <CustomSignIn />
        </SignedOut>

        <SignedIn>
          <div className="bg-white shadow-xl p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome back to Reddit!
            </h1>
            <p className="text-gray-600">You're successfully signed in.</p>
            <button
              onClick={() => (window.location.href = "/")}
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600"
            >
              Go to Home
            </button>
          </div>
        </SignedIn>
      </main>
    </div>
  );
}
