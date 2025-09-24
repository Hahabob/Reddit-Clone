import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useSignUpContext } from "../../contexts/SignUpContext";

const genderOptions = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "I prefer not to say" },
];

const AboutStep: React.FC = () => {
  const navigate = useNavigate();
  const { signUpData, updateSignUpData, canProgressToStep } =
    useSignUpContext();
  const [selectedGender, setSelectedGender] = useState(signUpData.gender || "");

  // Redirect if user shouldn't be on this step
  React.useEffect(() => {
    if (!canProgressToStep("about")) {
      navigate("/sign-up/verify");
    }
  }, [canProgressToStep, navigate]);

  const handleContinue = () => {
    if (selectedGender) {
      updateSignUpData({ gender: selectedGender });
      navigate("/sign-up/username");
    }
  };

  const handleSkip = () => {
    updateSignUpData({ gender: "prefer-not-to-say" });
    navigate("/sign-up/username");
  };

  const handleBack = () => {
    navigate("/sign-up/verify");
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

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">
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
          <h1 className="text-2xl font-bold text-gray-900">About you</h1>
          <p className="text-sm text-gray-600">
            Tell us about yourself to improve your recommendations and ads.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-medium text-gray-900 text-center">
            How do you identify?
          </h2>

          <div className="space-y-3">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedGender(option.value)}
                className={cn(
                  "w-full py-3 px-4 rounded-full font-medium transition-colors text-left",
                  selectedGender === option.value
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {selectedGender && (
          <button
            onClick={handleContinue}
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-colors"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default AboutStep;
