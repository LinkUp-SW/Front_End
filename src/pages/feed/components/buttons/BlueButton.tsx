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
      className={`rounded-full disabled:bg-gray-300 disabled:text-black disabled:dark:bg-gray-600 disabled:dark:text-white dark:border-0
       ${className} affirmativeBtn`}
    >
      {children}
    </Button>
  );
};

export default BlueButton;
