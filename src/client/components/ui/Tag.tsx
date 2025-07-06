import React from "react";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

const baseClasses =
  "inline-flex items-center justify-center font-medium transition-colors";

const variantClasses = {
  default:
    "bg-card hover:bg-card-hover text-text-secondary hover:text-text-primary",
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-accent text-white hover:bg-accent/90",
};

const sizeClasses = {
  sm: "px-2 py-1 text-xs rounded-md",
  md: "px-3 py-1 text-sm rounded-full",
  lg: "px-4 py-2 text-base rounded-full",
};

export const Tag: React.FC<TagProps> = ({
  children,
  variant = "default",
  size = "md",
  clickable = false,
  onClick,
  className = "",
}) => {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
    clickable ? "cursor-pointer" : ""
  } ${className}`;

  if (clickable || onClick) {
    return (
      <button className={classes} onClick={onClick}>
        {children}
      </button>
    );
  }

  return <span className={classes}>{children}</span>;
};
