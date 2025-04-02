import React from "react";
import { Button } from "@/components";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: "lg" | "default" | "sm" | "icon";
}

const IconButton: React.FC<IconButtonProps> = ({
  className = "",
  disabled,
  children,
  size,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled}
      size={size}
      className={`bg-transparent dark:text-neutral-200 text-black transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full hover:cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </Button>
  );
};

export default IconButton;
