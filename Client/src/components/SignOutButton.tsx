import React from "react";
import { useAuth } from "@clerk/clerk-react";

const SignOutButton: React.FC = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to sign-up
      window.location.href = "/sign-up";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
    >
      Sign Out & Restart Signup
    </button>
  );
};

export default SignOutButton;
