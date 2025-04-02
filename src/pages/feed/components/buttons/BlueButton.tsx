import { Button } from "@/components";

interface BlueButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: "lg" | "default" | "sm" | "icon";
}

const BlueButton: React.FC<BlueButtonProps> = ({
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
      className={`bg-blue-600 text-white duration-500 light:border-gray-600 dark:hover:border-2 hover:cursor-pointer dark:bg-blue-300 dark:text-black hover:bg-blue-900 dark:hover:bg-blue-200 dark:border transition-colors border-0 rounded-full ${
        disabled &&
        "bg-gray-300 text-black dark:bg-gray-600 dark:text-white dark:border-0"
      } ${className}`}
    >
      {children}
    </Button>
  );
};

export default BlueButton;
