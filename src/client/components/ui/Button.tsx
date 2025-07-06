import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const baseClasses =
  "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses = {
  primary: "bg-primary hover:bg-primary-hover text-white focus:ring-primary",
  secondary:
    "bg-card hover:bg-card-hover text-text-primary border border-border focus:ring-primary",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
  ghost:
    "text-text-secondary hover:text-text-primary hover:bg-card-hover focus:ring-primary",
  danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
};

const sizeClasses = {
  sm: "px-3 py-2 text-sm rounded-md min-h-[36px] sm:min-h-[32px]",
  md: "px-4 py-2 text-base rounded-lg min-h-[44px] sm:min-h-[40px]",
  lg: "px-6 py-3 text-lg rounded-xl min-h-[48px] sm:min-h-[44px]",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  icon,
  ...props
}) => {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
