import {
  FormInput,
  FormTextarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { COUNTRY_CITY_MAP } from "@/constants";
import { Bio, Organization } from "@/types";
import { useState } from "react";

type EditUserBioModalProps = {
  userId: string;
  userData: Bio;
  intros: {
    work_experience: Organization | null;
    education: Organization | null;
  };
};

const EditUserBioModal: React.FC<EditUserBioModalProps> = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  return (
    <div>
      <FormInput
        label="First Name*"
        placeholder="John"
        id="first-name"
        name="firstName"
        onChange={(e) => {
          console.log(e);
        }}
        value=""
      />
      <FormInput
        label="Last Name*"
        placeholder="Doe"
        id="last-name"
        name="lastName"
        value=""
        onChange={(e) => {
          console.log(e);
        }}
      />
      <FormTextarea
        label="Headline* "
        placeholder="Write a brief and compelling summary about yourself"
        maxLength={200}
        value=""
        id="profile-headline"
        name="headline"
        onChange={(e) => {
          console.log(e);
        }}
      />

      <h2 className="text-xl font-bold">Location</h2>
      <section className="flex py-5 sm:flex-row flex-col gap-2">
        {/* Country Select */}
        <Select
          onValueChange={(value: string) => {
            setSelectedCountry(value);
            // Reset city when country changes
            setSelectedCity("");
          }}
        >
          <SelectTrigger
            id="country"
            name="country"
            className="flex-grow w-full border-gray-600 outline-gray-600"
          >
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
            {Object.keys(COUNTRY_CITY_MAP).map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* City Select */}
        <Select
          value={selectedCity} // Make this a controlled component
          onValueChange={(value: string) => setSelectedCity(value)}
          disabled={!selectedCountry}
        >
          <SelectTrigger
            id="city"
            name="city"
            className="flex-grow w-full border-gray-600 outline-gray-600"
          >
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
            {selectedCountry &&
              COUNTRY_CITY_MAP[selectedCountry].map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </section>
      <div>
        <h2 className="text-xl font-bold">Location</h2>
        <p className="text-xs font-semibold">
          Add or Edit your email, phone number, and more.
        </p>
      </div>
    </div>
  );
};

export default EditUserBioModal;
