import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "../../lib/utils";
import { useSignUpContext } from "../../contexts/SignUpContext";

const usernamePasswordSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type UsernamePasswordFormData = z.infer<typeof usernamePasswordSchema>;

const UsernameStep: React.FC = () => {
  const { signUp, isLoaded, setActive } = useSignUp();
  const navigate = useNavigate();
  const { signUpData, updateSignUpData, canProgressToStep, resetSignUpData } =
    useSignUpContext();
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UsernamePasswordFormData>({
    resolver: zodResolver(usernamePasswordSchema),
    defaultValues: {
      username: signUpData.username || "",
      password: signUpData.password || "",
    },
  });

  const watchedUsername = watch("username");

  // Redirect if user shouldn't be on this step
  useEffect(() => {
    if (!canProgressToStep("username")) {
      navigate("/sign-up/about");
    }
  }, [canProgressToStep, navigate]);

  // Generate a random username when component mounts
  useEffect(() => {
    if (!signUpData.username) {
      const generateUsername = () => {
        const adjectives = [
          "Super",
          "Cool",
          "Amazing",
          "Awesome",
          "Great",
          "Smart",
          "Fast",
        ];
        const nouns = ["Cat", "Dog", "Bear", "Lion", "Eagle", "Tiger", "Wolf"];
        const adjective =
          adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const number = Math.floor(Math.random() * 9999);
        return `${adjective}${noun}${number}`;
      };

      setValue("username", generateUsername());
    }
  }, [setValue, signUpData.username]);

  // Check username availability with debouncing
  useEffect(() => {
    if (!watchedUsername || watchedUsername.length < 3) {
      setIsUsernameAvailable(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        // Simulate API call to check username availability
        // In real implementation, you'd call your backend API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // For now, let's say usernames starting with 'taken' are not available
        const available = !watchedUsername.toLowerCase().startsWith("taken");
        setIsUsernameAvailable(available);
      } catch (error) {
        console.error("Error checking username:", error);
        setIsUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [watchedUsername]);

  const generateNewUsername = () => {
    const adjectives = [
      "Super",
      "Cool",
      "Amazing",
      "Awesome",
      "Great",
      "Smart",
      "Fast",
    ];
    const nouns = ["Cat", "Dog", "Bear", "Lion", "Eagle", "Tiger", "Wolf"];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 9999);
    setValue("username", `${adjective}${noun}${number}`);
  };

  const onSubmit = async (data: UsernamePasswordFormData) => {
    if (isUsernameAvailable === false) return;
    if (!isLoaded) return;

    setIsSubmitting(true);

    // Store in context first
    updateSignUpData({
      username: data.username,
      password: data.password,
    });

    // Check if we don't have a signUp object - user might already be signed in
    if (!signUp) {
      console.log(
        "No signUp object available - user might already be signed in"
      );
      resetSignUpData();
      navigate("/");
      return;
    }

    try {
      console.log("Current signup status before update:", signUp.status);
      console.log("Signup object:", signUp);

      // Check if signup is already complete
      if (signUp.status === "complete") {
        console.log("Signup is already complete! Setting active session...");
        await setActive({ session: signUp.createdSessionId });
        resetSignUpData();
        navigate("/");
        return;
      }

      console.log("Updating signup with username and password...");

      // Update the Clerk signup with username and password
      const updatedSignUp = await signUp.update({
        username: data.username,
        password: data.password,
      });

      console.log("Updated signup status:", updatedSignUp.status);
      console.log("Updated signup object:", updatedSignUp);

      // Check if the signup is now complete
      if (updatedSignUp.status === "complete") {
        console.log("Signup complete after update! Setting active session...");

        // Set the active session
        await setActive({ session: updatedSignUp.createdSessionId });

        // Clear signup context
        resetSignUpData();

        console.log("Redirecting to home...");
        // Redirect to home - user should now be signed in
        navigate("/");
      } else {
        console.log(
          "Signup not complete after update, continuing to interests..."
        );
        // If not complete, continue to interests step
        navigate("/sign-up/interests");
      }
    } catch (error: any) {
      console.error("Username/password setup error:", error);
      console.error("Error details:", error.errors || error.message);

      // Check if the error indicates user is already signed in
      if (
        error.message?.includes("already signed in") ||
        error.message?.includes("signed in")
      ) {
        console.log(
          "User appears to be already signed in, redirecting to home..."
        );
        resetSignUpData();
        navigate("/");
        return;
      }

      // For other errors, continue to interests step as fallback
      console.log("Continuing to interests step as fallback...");
      navigate("/sign-up/interests");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/sign-up/about");
  };

  const getUsernameStatus = () => {
    if (isCheckingUsername) return null;
    if (isUsernameAvailable === true) return "available";
    if (isUsernameAvailable === false) return "taken";
    return null;
  };

  const usernameStatus = getUsernameStatus();

  return (
    <div className="w-full max-w-md px-4 py-12">
      {/* Reddit Logo */}
      <div className="text-center mb-8">
        <Link to="/" className="inline-block">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">r</span>
            </div>
            <span className="text-xl font-bold text-gray-900">reddit</span>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">
        {/* Header with back button */}
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Create your username and password
          </h1>
          <p className="text-sm text-gray-600">
            Reddit is anonymous, so your username is what you'll go by here.
            Choose wisely—because once you get a name, you can't change it.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Username*
            </label>
            <div className="relative">
              <input
                {...register("username")}
                type="text"
                className={cn(
                  "w-full px-4 py-3 pr-12 rounded-lg border bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                  errors.username
                    ? "border-red-500 bg-red-50"
                    : usernameStatus === "available"
                    ? "border-green-500 bg-green-50"
                    : usernameStatus === "taken"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                )}
              />

              {/* Status indicators */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                {isCheckingUsername && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                )}
                {usernameStatus === "available" && (
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                <button
                  type="button"
                  onClick={generateNewUsername}
                  className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Username feedback */}
            {errors.username ? (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            ) : usernameStatus === "available" ? (
              <p className="text-sm text-green-500">Nice! Username available</p>
            ) : usernameStatus === "taken" ? (
              <p className="text-sm text-red-500">
                That username isn't available. Try another.
              </p>
            ) : null}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password*
            </label>
            <input
              {...register("password")}
              type="password"
              className={cn(
                "w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
              )}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={
              usernameStatus === "taken" || isCheckingUsername || isSubmitting
            }
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-full transition-colors"
          >
            {isSubmitting ? "Completing Signup..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernameStep;
