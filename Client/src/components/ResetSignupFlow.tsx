import React from "react";
import { useAuth } from "@clerk/clerk-react";

const ResetSignupFlow: React.FC = () => {
  const { signOut } = useAuth();

  const handleFullReset = async () => {
    try {
      // Clear signup-related storage only (preserve theme preferences)
      localStorage.removeItem("clerk_error_count");
      sessionStorage.clear();

      // Sign out from Clerk
      await signOut();

      // Wait a bit then reload
      setTimeout(() => {
        window.location.href = "/sign-up";
      }, 1000);
    } catch (error) {
      console.error("Reset error:", error);
      // Force reload anyway
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-red-600 mb-4">Rate Limited</h2>
        <p className="text-gray-700 mb-4">
          You've hit Clerk's rate limit. This happens when there are too many
          signup attempts.
        </p>
        <p className="text-gray-600 mb-6 text-sm">
          Click below to clear all data and wait for the rate limit to reset
          (usually 1-5 minutes).
        </p>
        <button
          onClick={handleFullReset}
          className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
        >
          Reset Everything & Try Again
        </button>
        <p className="text-xs text-gray-500 mt-3">
          This will clear all browser data and sign you out completely.
        </p>
      </div>
    </div>
  );
};

export default ResetSignupFlow;
