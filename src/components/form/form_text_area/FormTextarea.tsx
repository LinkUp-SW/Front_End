interface FormTextareaProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  maxLength: number;
}
const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  maxLength,
}) => (
  <div className="flex flex-col gap-2 pt-5">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className="outline-gray-600 border p-2 rounded-md text-sm transition-all duration-300 ease-in-out dark:hover:border-white hover:border-black border-gray-600 focus:outline-0 h-32 resize-none"
    />
    <div className="flex justify-end text-xs text-gray-500 dark:text-gray-400">
      <span>
        {value.length}/{maxLength}
      </span>
    </div>
  </div>
);

export default FormTextarea;
