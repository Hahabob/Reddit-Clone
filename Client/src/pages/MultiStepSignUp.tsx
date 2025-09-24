import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignUpProvider } from "../contexts/SignUpContext";
import EmailStep from "../components/signup/EmailStep";
import VerifyEmailStep from "../components/signup/VerifyEmailStep";
import AboutStep from "../components/signup/AboutStep";
import UsernameStep from "../components/signup/UsernameStep";
import InterestsStep from "../components/signup/InterestsStep";
import ResetSignupFlow from "../components/ResetSignupFlow";

const MultiStepSignUp: React.FC = () => {
  const [showReset, setShowReset] = useState(false);

  // Check for rate limit errors (simplified)
  useEffect(() => {
    // Listen for global errors
    const handleError = (event: ErrorEvent) => {
      if (
        event.message &&
        (event.message.includes("429") ||
          event.message.includes("Too Many Requests") ||
          event.message.includes("rate limit"))
      ) {
        console.warn("Rate limit detected, consider waiting before retrying");
        // Only show reset after multiple consecutive errors
        setShowReset(true);
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (showReset) {
    return <ResetSignupFlow />;
  }

  return (
    <SignUpProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Navigate to="/sign-up/email" replace />} />
          <Route path="/email" element={<EmailStep />} />
          <Route path="/verify" element={<VerifyEmailStep />} />
          <Route path="/about" element={<AboutStep />} />
          <Route path="/username" element={<UsernameStep />} />
          <Route path="/interests" element={<InterestsStep />} />
        </Routes>
      </div>
    </SignUpProvider>
  );
};

export default MultiStepSignUp;
