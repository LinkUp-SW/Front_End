import {
  OrganizationSearch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@/components";
import { getSchoolsList } from "@/endpoints/userProfile";
import { Organization, UserStarterInterface } from "@/types";
import React, { useEffect, useState } from "react";

interface SchoolFormData {
  school: Organization;
  schoolStartYear: string;
  schoolEndYear: string;
  birthDate?: Date;
}

interface StudentFormProps {
  setPartialUserStarterData: React.Dispatch<
    React.SetStateAction<Partial<UserStarterInterface>>
  >;
}

const StudentForm: React.FC<StudentFormProps> = ({
  setPartialUserStarterData,
}) => {
  const [is16OrAbove, setIs16OrAbove] = useState(true);
  const [formData, setFormData] = useState<SchoolFormData>({
    school: { _id: "", name: "", logo: "" },
    schoolStartYear: "",
    schoolEndYear: "",
    birthDate: undefined,
  });

  // Local state for birth date fields.
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");

  // Update form data for a specific field.
  const handleChange = (field: keyof SchoolFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // When all birth date fields are set, update the birthDate in formData.
  useEffect(() => {
    if (birthDay && birthMonth && birthYear) {
      const date = new Date(
        Number(birthYear),
        Number(birthMonth) - 1,
        Number(birthDay)
      );
      handleChange("birthDate", date);
    }
  }, [birthDay, birthMonth, birthYear]);

  // Reset birth date if user toggles back to over 16.
  useEffect(() => {
    if (is16OrAbove) {
      handleChange("birthDate", undefined);
      setBirthDay("");
      setBirthMonth("");
      setBirthYear("");
    }
  }, [is16OrAbove]);

  // Propagate local formData changes (including is16OrAbove) to the parent state.
  useEffect(() => {
    setPartialUserStarterData({ ...formData, is16OrAbove });
  }, [formData, is16OrAbove, setPartialUserStarterData]);

  // Generate an array of years from current year to current year - 49 for school years.
  const currentYear = new Date().getFullYear();
  const schoolYears = Array.from({ length: 60 }, (_, i) =>
    String(currentYear + 10 - i)
  );

  // Options for birth date fields.
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
  // For birth year, generate options from current year down to 1900.
  const birthYears = Array.from({ length: currentYear - 1899 }, (_, i) =>
    String(currentYear - i)
  );

  return (
    <section className="flex w-full py-2 flex-col items-center">
      <OrganizationSearch
        label="School or College/University*"
        selectedOrganization={formData.school}
        onSelect={(org) =>
          setFormData((prev) => ({
            ...prev,
            school: org,
          }))
        }
        fetchOrganizations={(query) =>
          getSchoolsList(query).then((res) => res.data)
        }
        placeholder="Enter your school/college name"
        id="school-name"
        name="schoolName"
      />

      <div className="flex w-full min-[26rem]:flex-row flex-col gap-4 mt-4">
        <Select
          value={formData.schoolStartYear}
          onValueChange={(value: string) =>
            handleChange("schoolStartYear", value)
          }
        >
          <SelectTrigger
            id="school-start-year"
            name="schoolStarterYear"
            className="w-full border-gray-600 outline-gray-600"
          >
            <SelectValue placeholder="Start Year" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
            {schoolYears.map((yearOption) => (
              <SelectItem
                className="cursor-pointer"
                key={yearOption}
                value={yearOption}
              >
                {yearOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={formData.schoolEndYear}
          onValueChange={(value: string) =>
            handleChange("schoolEndYear", value)
          }
        >
          <SelectTrigger
            name="schoolEndYear"
            id="school-end-year"
            className="w-full border-gray-600 outline-gray-600"
          >
            <SelectValue placeholder="End Year" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
            {schoolYears.map((yearOption) => (
              <SelectItem
                className="cursor-pointer"
                key={yearOption}
                value={yearOption}
              >
                {yearOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-start w-full py-2 items-center space-x-2">
        <Switch
          checked={is16OrAbove}
          onCheckedChange={(checked: boolean) => setIs16OrAbove(checked)}
          id="is-above-16"
          name="is16Above16"
          className="dark:data-[state=checked]:bg-green-400 cursor-pointer data-[state=checked]:bg-green-600"
        />
        <label htmlFor="is-above-16">I'm over 16</label>
      </div>

      {/* If the user is not over 16, show birth date selection */}
      {!is16OrAbove && (
        <div className="flex w-full flex-col gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your birth date
          </p>
          <div className="flex w-full gap-4">
            <Select
              value={birthDay}
              onValueChange={(value: string) => setBirthDay(value)}
            >
              <SelectTrigger
                id="birth-day"
                name="birthDay"
                className="w-full cursor-pointer border-gray-600 outline-gray-600"
              >
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-900 cursor-pointer dark:border-gray-600 dark:text-white">
                {days.map((dayOption) => (
                  <SelectItem
                    className="cursor-pointer"
                    key={dayOption}
                    value={dayOption}
                  >
                    {dayOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={birthMonth}
              onValueChange={(value: string) => setBirthMonth(value)}
            >
              <SelectTrigger
                id="birth-month"
                name="birthMonth"
                className="w-full cursor-pointer border-gray-600 outline-gray-600"
              >
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-900 cursor-pointer dark:border-gray-600 dark:text-white">
                {months.map((monthOption) => (
                  <SelectItem
                    className="cursor-pointer"
                    key={monthOption}
                    value={monthOption}
                  >
                    {monthOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={birthYear}
              onValueChange={(value: string) => setBirthYear(value)}
            >
              <SelectTrigger
                id="birth-year"
                name="birthYear"
                className="w-full cursor-pointer border-gray-600 outline-gray-600"
              >
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-900 cursor-pointer dark:border-gray-600 dark:text-white">
                {birthYears.map((yearOption) => (
                  <SelectItem
                    className="cursor-pointer"
                    key={yearOption}
                    value={yearOption}
                  >
                    {yearOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentForm;
