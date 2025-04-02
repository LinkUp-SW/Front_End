import { Button } from "@/components";

interface TransparentButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: "lg" | "default" | "sm" | "icon";
}

const TransparentButton: React.FC<TransparentButtonProps> = ({
  className = "",
  disabled,
  size,
  children,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled}
      size={size}
      className={`bg-transparent light:border-gray-600 light:hover:border-2 dark:hover:bg-transparent hover:cursor-pointer dark:text-blue-300 dark:border-blue-300 dark:border transition-colors dark:hover:border-2 rounded-full ${
        disabled ? "opacity-50 cursor-not-allowed dark:border-gray-500" : ""
      } ${className}`}
    >
      {children}
    </Button>
  );
};

export default TransparentButton;
