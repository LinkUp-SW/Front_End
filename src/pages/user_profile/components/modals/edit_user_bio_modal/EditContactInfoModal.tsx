import React, { useState, useEffect } from "react";
import {
  FormInput,
  FormTextarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components";
import { BioFormData } from "@/types";
import { COUNTRY_PHONE_CODE_MAP } from "@/constants";

interface EditContactInfoModalProps {
  contactInfoData: BioFormData["contact_info"];
  handleUserBioChange: (
    field: keyof BioFormData["contact_info"],
    value: string | number
  ) => void;
  setOpenContactInfoModal: (open: boolean) => void;
}

const EditContactInfoModal: React.FC<EditContactInfoModalProps> = ({
  contactInfoData,
  handleUserBioChange,
  setOpenContactInfoModal,
}) => {
  // Local state for form fields
  const [localData, setLocalData] = useState<BioFormData["contact_info"]>({
    country_code:
      contactInfoData.country_code ?? Object.values(COUNTRY_PHONE_CODE_MAP)[0],
    phone_number: contactInfoData.phone_number,
    address: contactInfoData.address,
    birthday: contactInfoData.birthday ?? "",
    website: contactInfoData.website ?? "",
  });

  // Local state for birthday selects
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");

  // Generate options
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) =>
    String(currentYear - i)
  );

  // Initialize form on open or when contactInfoData changes
  useEffect(() => {
    setLocalData({
      country_code:
        contactInfoData.country_code ??
        Object.values(COUNTRY_PHONE_CODE_MAP)[0],
      phone_number: contactInfoData.phone_number,
      address: contactInfoData.address,
      birthday: contactInfoData.birthday ?? "",
      website: contactInfoData.website ?? "",
    });
    if (contactInfoData.birthday) {
      const [y, m, d] = contactInfoData.birthday.split("-");
      setBirthYear(y);
      setBirthMonth(String(Number(m)));
      setBirthDay(String(Number(d)));
    } else {
      setBirthDay("");
      setBirthMonth("");
      setBirthYear("");
    }
  }, [contactInfoData]);

  // Sync birthday selects to localData.birthday
  useEffect(() => {
    if (birthDay && birthMonth && birthYear) {
      const iso = new Date(
        Number(birthYear),
        Number(birthMonth) - 1,
        Number(birthDay)
      )
        .toISOString()
        .split("T")[0];
      setLocalData((prev) => ({ ...prev, birthday: iso }));
    }
  }, [birthDay, birthMonth, birthYear]);

  const onCancel = () => {
    // reset local state to original
    setLocalData({
      country_code:
        contactInfoData.country_code ??
        Object.values(COUNTRY_PHONE_CODE_MAP)[0],
      phone_number: contactInfoData.phone_number,
      address: contactInfoData.address,
      birthday: contactInfoData.birthday ?? "",
      website: contactInfoData.website ?? "",
    });
    // reset selects
    if (contactInfoData.birthday) {
      const [y, m, d] = contactInfoData.birthday.split("-");
      setBirthYear(y);
      setBirthMonth(String(Number(m)));
      setBirthDay(String(Number(d)));
    } else {
      setBirthYear("");
      setBirthMonth("");
      setBirthDay("");
    }
    setOpenContactInfoModal(false);
  };

  const onSave = () => {
    // commit changes
    handleUserBioChange("country_code", localData.country_code);
    handleUserBioChange("phone_number", localData.phone_number);
    handleUserBioChange("address", localData.address);
    handleUserBioChange("birthday", localData.birthday);
    // close
    setOpenContactInfoModal(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end flex-wrap gap-2">
        {/* country code select */}
        <div className="flex flex-1/5 flex-col min-w-20 md:max-w-24 gap-2 pt-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Country Code
          </p>

          <Select
            value={localData.country_code}
            onValueChange={(code) =>
              setLocalData((prev) => ({ ...prev, country_code: code }))
            }
          >
            <SelectTrigger
              className="flex-grow w-full border-gray-700 dark:border-gray-600"
              id="country-code-select"
              name="country_code"
            >
              <SelectValue placeholder="+20" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:text-white">
              {Object.entries(COUNTRY_PHONE_CODE_MAP).map(([country, code]) => (
                <SelectItem key={country} value={code}>
                  {country} ({code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FormInput
          label="Phone Number"
          id="phone-number"
          name="phone_number"
          placeholder="ex: 1012345678"
          value={
            localData.phone_number > 0 ? String(localData.phone_number) : ""
          }
          onChange={(e) =>
            setLocalData((prev) => ({
              ...prev,
              phone_number: Number(e.target.value) || 0,
            }))
          }
          extraClassName="flex-grow flex-4/5 min-w-36"
        />
      </div>

      <FormTextarea
        label="Address"
        name="address"
        id="address"
        placeholder="Your address"
        maxLength={100}
        value={localData.address}
        onChange={(e) =>
          setLocalData((prev) => ({ ...prev, address: e.target.value }))
        }
      />

      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Birthday</h2>
        <div className="flex gap-2 flex-grow flex-wrap">
          <Select value={birthDay} onValueChange={setBirthDay}>
            <SelectTrigger
              className="flex-grow min-w-36 dark:border-gray-600 border-gray-700"
              id="birth-day"
              name="birth_day"
            >
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:text-white">
              {days.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={birthMonth} onValueChange={setBirthMonth}>
            <SelectTrigger
              className="flex-grow min-w-36 dark:border-gray-600 border-gray-700"
              id="birth-month"
              name="birth_month"
            >
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:text-white">
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={birthYear} onValueChange={setBirthYear}>
            <SelectTrigger
              className="flex-grow min-w-36 dark:border-gray-600 border-gray-700"
              id="birth-year"
              name="birth_year"
            >
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:text-white">
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <footer className="w-full flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="destructiveBtn px-2 py-1.5 rounded-xl font-semibold"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="affirmativeBtn px-4 font-semibold text-white py-1.5 rounded-xl"
        >
          Save
        </button>
      </footer>
    </div>
  );
};

export default EditContactInfoModal;
