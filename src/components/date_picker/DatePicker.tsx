import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";

interface DatePickerProps {
  label: string;
  month: string;
  year: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  disabled?: boolean;
}
const DatePicker: React.FC<DatePickerProps> = ({
  label,
  month,
  year,
  onMonthChange,
  onYearChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2 pt-5">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <div className="flex gap-2">
        <Select value={month} onValueChange={onMonthChange} disabled={disabled}>
          <SelectTrigger
            className="w-1/2 border-gray-600 outline-gray-600"
            disabled={disabled}
          >
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
            {Array.from({ length: 12 }, (_, i) => {
              const monthName = new Date(0, i).toLocaleString("en-US", {
                month: "long",
              });
              return (
                <SelectItem key={i} value={String(i + 1)}>
                  {monthName}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Select value={year} onValueChange={onYearChange} disabled={disabled}>
          <SelectTrigger
            className="w-1/2 border-gray-600 outline-gray-600"
            disabled={disabled}
          >
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
            {Array.from({ length: 50 }, (_, i) => {
              const currentYear = new Date().getFullYear();
              const yearOption = currentYear - i;
              return (
                <SelectItem key={yearOption} value={String(yearOption)}>
                  {yearOption}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
export default DatePicker;
