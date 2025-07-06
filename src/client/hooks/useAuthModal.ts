import { useState, useCallback } from "react";

export const useAuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  const openModal = useCallback((authMode: "login" | "register" = "login") => {
    setMode(authMode);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const switchMode = useCallback(() => {
    setMode((current) => (current === "login" ? "register" : "login"));
  }, []);

  return {
    isOpen,
    mode,
    openModal,
    closeModal,
    switchMode,
  };
};
