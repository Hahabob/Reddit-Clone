import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type SignUpStep =
  | "email"
  | "verify"
  | "about"
  | "username"
  | "interests"
  | "complete";

export interface SignUpData {
  email: string;
  verificationCode: string;
  emailVerified: boolean;
  gender: string;
  username: string;
  password: string;
  interests: string[];
}

interface SignUpContextType {
  currentStep: SignUpStep;
  signUpData: SignUpData;
  setCurrentStep: (step: SignUpStep) => void;
  updateSignUpData: (data: Partial<SignUpData>) => void;
  resetSignUpData: () => void;
  canProgressToStep: (step: SignUpStep) => boolean;
}

const initialSignUpData: SignUpData = {
  email: "",
  verificationCode: "",
  emailVerified: false,
  gender: "",
  username: "",
  password: "",
  interests: [],
};

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export const useSignUpContext = () => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("useSignUpContext must be used within a SignUpProvider");
  }
  return context;
};

interface SignUpProviderProps {
  children: ReactNode;
}

export const SignUpProvider: React.FC<SignUpProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("email");
  const [signUpData, setSignUpData] = useState<SignUpData>(initialSignUpData);

  const updateSignUpData = (data: Partial<SignUpData>) => {
    setSignUpData((prev) => ({ ...prev, ...data }));
  };

  const resetSignUpData = () => {
    setSignUpData(initialSignUpData);
    setCurrentStep("email");
  };

  const canProgressToStep = (step: SignUpStep): boolean => {
    switch (step) {
      case "email":
        return true;
      case "verify":
        return signUpData.email !== "";
      case "about":
        return signUpData.email !== "" && signUpData.emailVerified;
      case "username":
        return (
          signUpData.email !== "" &&
          signUpData.emailVerified &&
          signUpData.gender !== ""
        );
      case "interests":
        return (
          signUpData.email !== "" &&
          signUpData.emailVerified &&
          signUpData.gender !== "" &&
          signUpData.username !== "" &&
          signUpData.password !== ""
        );
      case "complete":
        return (
          signUpData.email !== "" &&
          signUpData.emailVerified &&
          signUpData.gender !== "" &&
          signUpData.username !== "" &&
          signUpData.password !== "" &&
          signUpData.interests.length > 0
        );
      default:
        return false;
    }
  };

  return (
    <SignUpContext.Provider
      value={{
        currentStep,
        signUpData,
        setCurrentStep,
        updateSignUpData,
        resetSignUpData,
        canProgressToStep,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
};
