import { cn } from "@/lib/utils";

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  helperText?: string;
  helperTextType?: string;
  type?: string;
  extraClassName?: string;
  id: string;
  name: string;
  limit?: number;
}
const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  helperText,
  helperTextType,
  type,
  extraClassName,
  id,
  name,
  limit,
}) => (
  <div className={cn("flex flex-col gap-2 pt-5", extraClassName)}>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <input
      id={id}
      name={name}
      type={type || "text"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={limit}
      className="outline-gray-600 border p-2 rounded-md text-sm transition-all duration-300 ease-in-out dark:hover:border-white hover:border-black border-gray-600 focus:outline-0"
    />
    {helperText && (
      <p
        className={`text-xs   ${
          helperTextType?.toLowerCase() === "error"
            ? "text-red-500 dark:text-red-400"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {helperText}
      </p>
    )}
  </div>
);

export default FormInput;
