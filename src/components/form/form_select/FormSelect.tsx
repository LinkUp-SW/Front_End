import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { cn } from "@/lib/utils";

interface FormSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  extraClassName?:string;
  id:string;
  name:string
}
const FormSelect: React.FC<FormSelectProps> = ({
  label,
  placeholder,
  value,
  onValueChange,
  options,
  extraClassName,
  id,
  name
}) => (
  <div className={cn("flex flex-col gap-2 pt-5",extraClassName)}>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} name={name} className="w-full border-gray-600 outline-gray-600">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default FormSelect;
