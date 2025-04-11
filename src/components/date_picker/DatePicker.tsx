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
  id: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  month,
  year,
  onMonthChange,
  onYearChange,
  disabled = false,
  id,
}) => {
  return (
    <div id={`${id}-container`} className="flex flex-col gap-2 pt-5">
      <p
        id={`${id}-label`}
        className="text-sm text-gray-500 dark:text-gray-400"
      >
        {label}
      </p>
      <div id={`${id}-selects`} className="flex gap-2">
        {/* Month Selector */}
        <Select value={month} onValueChange={onMonthChange} disabled={disabled}>
          <SelectTrigger
            id={`${id}-month-trigger`}
            className="w-1/2 border-gray-600 outline-gray-600"
            disabled={disabled}
          >
            <SelectValue id={`${id}-month-value`} placeholder="Month" />
          </SelectTrigger>
          <SelectContent
            id={`${id}-month-content`}
            className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const monthName = new Date(0, i).toLocaleString("en-US", {
                month: "long",
              });
              return (
                <SelectItem
                  id={`${id}-month-item-${i + 1}`}
                  key={i}
                  value={String(i + 1)}
                >
                  {monthName}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Year Selector */}
        <Select value={year} onValueChange={onYearChange} disabled={disabled}>
          <SelectTrigger
            id={`${id}-year-trigger`}
            className="w-1/2 border-gray-600 outline-gray-600"
            disabled={disabled}
          >
            <SelectValue id={`${id}-year-value`} placeholder="Year" />
          </SelectTrigger>
          <SelectContent
            id={`${id}-year-content`}
            className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
          >
            {Array.from({ length: 50 }, (_, i) => {
              const currentYear = new Date().getFullYear();
              const yearOption = currentYear - i;
              return (
                <SelectItem
                  id={`${id}-year-item-${yearOption}`}
                  key={yearOption}
                  value={String(yearOption)}
                >
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
