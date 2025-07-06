import React, { useState } from "react";
import { XIcon } from "../svgIcons";
import { Button } from "../ui/Button";
import { useAuth } from "../../contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  const resetForm = () => {
    setFormData({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
    setErrors([]);
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.email.trim()) {
      newErrors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push("Email is invalid");
    }

    if (mode === "register" && !formData.username.trim()) {
      newErrors.push("Username is required");
    }

    if (!formData.password) {
      newErrors.push("Password is required");
    } else if (formData.password.length < 6) {
      newErrors.push("Password must be at least 6 characters");
    }

    if (mode === "register" && formData.password !== formData.confirmPassword) {
      newErrors.push("Passwords do not match");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors([]);

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.username, formData.password);
      }

      resetForm();
      onClose();
    } catch (error: any) {
      setErrors([error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-md bg-card rounded-lg shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">
            {mode === "login" ? "Sign In" : "Sign Up"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-full hover:bg-card-hover min-h-[44px] min-w-[44px] flex items-center justify-center">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-primary mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text-primary placeholder-text-tertiary text-base"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          {/* Username Field (Register only) */}
          {mode === "register" && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-text-primary mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text-primary placeholder-text-tertiary text-base"
                placeholder="Choose a username"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text-primary placeholder-text-tertiary text-base"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password Field (Register only) */}
          {mode === "register" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-text-primary mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text-primary placeholder-text-tertiary text-base"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full mt-6">
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>
                  {mode === "login" ? "Signing In..." : "Signing Up..."}
                </span>
              </span>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </Button>

          {/* Switch Mode */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-text-secondary text-sm">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                type="button"
                onClick={switchMode}
                disabled={isLoading}
                className="ml-2 text-primary hover:text-primary-hover font-medium underline">
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
