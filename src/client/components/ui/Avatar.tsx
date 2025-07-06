import React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = "md",
  className = "",
}) => {
  const initials = name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const baseClasses = `rounded-full overflow-hidden flex items-center justify-center font-bold ${sizeClasses[size]} ${className}`;

  if (src) {
    return (
      <div className={baseClasses}>
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${baseClasses} bg-gray-500 text-white`}>{initials}</div>
  );
};
