import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthModalContextType {
  isOpen: boolean;
  mode: "login" | "register";
  openModal: (mode?: "login" | "register") => void;
  closeModal: () => void;
  switchMode: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};

interface AuthModalProviderProps {
  children: ReactNode;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  const openModal = (authMode: "login" | "register" = "login") => {
    setMode(authMode);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const switchMode = () => {
    setMode((current) => (current === "login" ? "register" : "login"));
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        openModal,
        closeModal,
        switchMode,
      }}>
      {children}
    </AuthModalContext.Provider>
  );
};
