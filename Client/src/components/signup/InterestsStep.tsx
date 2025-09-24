import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignUp, useAuth } from "@clerk/clerk-react";
import { cn } from "../../lib/utils";
import { useSignUpContext } from "../../contexts/SignUpContext";

interface InterestCategory {
  title: string;
  icon: string;
  interests: string[];
}

const interestCategories: InterestCategory[] = [
  {
    title: "Popular",
    icon: "📊",
    interests: [
      "israel_bm",
      "Silksong",
      "World News",
      "Ask Reddit",
      "TopCharacterTropes",
      "Pics",
      "Pop Culture Chat",
      "NFL",
      "Tech news",
      "Europe",
    ],
  },
  {
    title: "Internet Culture",
    icon: "🌐",
    interests: [
      "Mildly infuriating",
      "SipsTea",
      "Funny",
      "Cringe & Facepalm",
      "Memes",
      "Memes Explained",
      "okkamaraderlerdc",
      "ani_bm",
      "CringeTickToks",
      "Interesting",
    ],
  },
  {
    title: "Q&As & Stories",
    icon: "💬",
    interests: [],
  },
];

const InterestsStep: React.FC = () => {
  useSignUp();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { signUpData, updateSignUpData, canProgressToStep, resetSignUpData } =
    useSignUpContext();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    signUpData.interests || []
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Popular",
    "Internet Culture",
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if user shouldn't be on this step
  useEffect(() => {
    if (!canProgressToStep("interests")) {
      navigate("/sign-up/username");
    }
  }, [canProgressToStep, navigate]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryTitle)
        ? prev.filter((c) => c !== categoryTitle)
        : [...prev, categoryTitle]
    );
  };

  const handleContinue = () => {
    if (selectedInterests.length === 0) return;

    setIsLoading(true);

    // Update our context with the selected interests
    updateSignUpData({ interests: selectedInterests });

    // User should already be signed in from UsernameStep
    // Just clear context and redirect
    resetSignUpData();
    navigate("/");
    setIsLoading(false);
  };

  const handleBack = () => {
    navigate("/sign-up/username");
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

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6 max-h-[80vh] overflow-y-auto">
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

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Interests</h1>
          <p className="text-sm text-gray-600">
            Pick things you'd like to see in your home feed.
          </p>
        </div>

        <div className="space-y-4">
          {interestCategories.map((category) => (
            <div key={category.title} className="space-y-3">
              <button
                onClick={() => toggleCategory(category.title)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-gray-900">
                    {category.title}
                  </span>
                </div>
                <svg
                  className={cn(
                    "w-5 h-5 text-gray-500 transition-transform",
                    expandedCategories.includes(category.title)
                      ? "rotate-180"
                      : ""
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {expandedCategories.includes(category.title) &&
                category.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-7">
                    {category.interests.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                          selectedInterests.includes(interest)
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                )}

              {expandedCategories.includes(category.title) &&
                category.interests.length === 0 && (
                  <div className="ml-7 text-sm text-gray-500 italic">
                    Coming soon...
                  </div>
                )}
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="pt-4">
          <button
            onClick={handleContinue}
            disabled={selectedInterests.length === 0 || isLoading}
            className={cn(
              "w-full py-3 px-4 font-medium rounded-full transition-colors",
              selectedInterests.length > 0 && !isLoading
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            {isLoading
              ? "Completing Signup..."
              : `Select at least 1 to continue`}
          </button>
        </div>

        {selectedInterests.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            {selectedInterests.length} interest
            {selectedInterests.length !== 1 ? "s" : ""} selected
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestsStep;
