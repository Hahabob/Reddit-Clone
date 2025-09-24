import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useSignUpContext } from "../../contexts/SignUpContext";

const VerifyEmailStep: React.FC = () => {
  const { signUp, isLoaded, setActive } = useSignUp();
  const navigate = useNavigate();
  const { signUpData, updateSignUpData, canProgressToStep, resetSignUpData } =
    useSignUpContext();
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if user shouldn't be on this step
  React.useEffect(() => {
    if (!canProgressToStep("verify")) {
      navigate("/sign-up/email");
    }
  }, [canProgressToStep, navigate]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError("");

    try {
      console.log("Signup status before verification:", signUp.status);

      // Only verify the email, don't complete the signup yet
      const verificationResult = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      console.log("Verification result status:", verificationResult.status);
      console.log("Verification result:", verificationResult);

      // Check if verification completed the signup
      if (verificationResult.status === "complete") {
        console.log("Signup was completed during email verification!");
        // Set active session and redirect to home
        await setActive({ session: verificationResult.createdSessionId });
        resetSignUpData();
        // Go home - user is now signed in
        navigate("/");
        return;
      }

      // Store the verification code for later use
      updateSignUpData({
        verificationCode: verificationCode,
        emailVerified: true,
      });

      // Move to next step if not complete
      navigate("/sign-up/about");
    } catch (err: any) {
      console.error("Verification error:", err);
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || !signUp) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err: any) {
      console.error("Resend code error:", err);
    }
  };

  const handleBack = () => {
    navigate("/sign-up/email");
  };

  const handleSkip = () => {
    // In Reddit, you can skip email verification in some cases
    updateSignUpData({ emailVerified: true });
    navigate("/sign-up/about");
  };

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

      <div className="space-y-8">
        {/* Header with back button and skip */}
        <div className="flex items-center justify-between">
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
          <button
            onClick={handleSkip}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Skip
          </button>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Verify your email
          </h1>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code we sent to{" "}
            <span className="font-medium">{signUpData.email}</span>
          </p>
        </div>

        <form onSubmit={handleVerification} className="space-y-6">
          <div>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Verification code"
              maxLength={6}
              className={cn(
                "w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-lg tracking-wider",
                error ? "border-red-500 bg-red-50" : "border-gray-300"
              )}
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
            )}
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Didn't get an email?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                className="text-blue-600 hover:underline font-medium"
              >
                Resend in 0:20
              </button>
            </p>

            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-full transition-colors"
            >
              {isLoading ? "Verifying..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailStep;
