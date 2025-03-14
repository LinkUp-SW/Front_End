import { Checkbox } from "@/components";

interface FormCheckboxProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  checked,
  onCheckedChange,
}) => (
  <div className="items-top flex pt-5 space-x-2">
    <Checkbox
      id={label}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="data-[state=checked]:bg-green-700 data-[state=checked]:border-none dark:data-[state=checked]:bg-green-500"
    />
    <div className="grid gap-1.5 leading-none">
      <label
        htmlFor={label}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  </div>
);

export default FormCheckbox;
