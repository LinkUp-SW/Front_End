import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  UserAuthLayout,
} from "@/components";
import {  handleSaveCredentials } from "@/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useInterceptBackNavigation } from "@/hooks/useInterceptBackNavigation";
import { COUNTRY_CITY_MAP } from "@/constants";

const LocationPage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const navigate = useNavigate();
  useInterceptBackNavigation();


  const verifyLocationCredentials = () => {
    return selectedCity.length !== 0 && selectedCountry.length !== 0;
  };

  const saveCredentials = () => {
    if (!verifyLocationCredentials()) {
      return toast.error("please select the country and the city");
    }
    handleSaveCredentials({ country: selectedCountry, city: selectedCity });

    return navigate('/signup/organization')
  };

  return (
    <main className="flex min-h-full w-full max-w-md flex-col justify-center relative pt-4">
      <header className="sm:w-full flex flex-col gap-2 items-center">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome, What's Your Location
        </h2>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">
          see people, jobs, and news in your area
        </p>
      </header>
      <section className="flex py-5 sm:flex-row flex-col gap-2">
        {/* Country Select */}
        <Select
          onValueChange={(value: string) => {
            setSelectedCountry(value);
            // Reset city when country changes
            setSelectedCity("");
          }}
        >
          <SelectTrigger id="country" name="country" className="flex-grow w-full border-gray-600 outline-gray-600">
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
          <SelectTrigger id="city" name="city" className="flex-grow w-full border-gray-600 outline-gray-600">
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
      <button
        type="button"
        onClick={saveCredentials}
        id="continue-button"
        disabled={!verifyLocationCredentials()}
        className="flex disabled:opacity-75 disabled:bg-indigo-500 disabled:cursor-not-allowed cursor-pointer w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out"
      >
        Continue
      </button>{" "}
    </main>
  );
};

export default UserAuthLayout(LocationPage);
