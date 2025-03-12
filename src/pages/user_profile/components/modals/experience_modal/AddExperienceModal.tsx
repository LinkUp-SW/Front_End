import {
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";

enum jobTypeEnum {
  full_time = "Full-time",
  part_time = "Part-time",
  contract = "Contract",
  temporary = "Temporary",
  other = "Other",
  volunteer = "Volunteer",
  internship = "Internship",
}

const AddExperienceModal = () => {
  return (
    <div className="max-w-5xl md:w-[35rem] w-full">
      <div className="flex flex-col mb-4">
        <h2 className="text-xl font-semibold">Add Experience</h2>
        <div className="w-full bg-gray-800 dark:bg-gray-300 h-[0.1rem] rounded-2xl" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        *Indicates required
      </p>
      <div className="flex flex-col gap-2 pt-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">Title*</p>
        <input
          type="text"
          placeholder="Ex: Retail Sales Manager"
          className="outline-gray-600 border p-2 rounded-md text-sm transition-all duration-300 ease-in-out dark:hover:border-white hover:border-black border-gray-600 focus:outline-0"
        />
      </div>
      <div className="flex flex-col gap-2 pt-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Employment Type*
        </p>
        <Select>
          <SelectTrigger className="w-full border-gray-600 outline-gray-600">
            <SelectValue placeholder="Select Employment Type" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
            {Object.values(jobTypeEnum).map((jobType) => (
              <SelectItem
                key={jobType}
                className="cursor-pointer"
                value={jobType}
              >
                {jobType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2 pt-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Company or Organization*
        </p>
        <input
          type="text"
          placeholder="Ex: Microsoft"
          className="outline-gray-600 border p-2 rounded-md text-sm transition-all duration-300 ease-in-out dark:hover:border-white hover:border-black border-gray-600 focus:outline-0"
        />
      </div>
      <div className="items-top flex pt-5 space-x-2">
        <Checkbox
          className=" data-[state=checked]:bg-green-700 data-[state=checked]:border-none dark:data-[state=checked]:bg-green-500"
          id="terms1"
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms1"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I am currently working in this role{" "}
          </label>
        </div>
      </div>

      {/* Start Date */}
      <div className="flex flex-col gap-2 pt-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">Start date*</p>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-1/2 border-gray-600 outline-gray-600">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {new Date(0, i).toLocaleString("en-US", { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-1/2 border-gray-600 outline-gray-600">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
              {Array.from({ length: 50 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* End Date */}
      <div className="flex flex-col gap-2 pt-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">End date*</p>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-1/2 border-gray-600 outline-gray-600">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {new Date(0, i).toLocaleString("en-US", { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-1/2 border-gray-600 outline-gray-600">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
              {Array.from({ length: 50 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2 pt-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
        <input
          type="text"
          placeholder="Ex: London, United Kingdom"
          className="outline-gray-600 border p-2 rounded-md text-sm transition-all duration-300 ease-in-out dark:hover:border-white hover:border-black border-gray-600 focus:outline-0"
        />
      </div>

      {/* Location Type */}
      <div className="flex flex-col gap-2 pt-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Location type
        </p>
        <Select>
          <SelectTrigger className="w-full border-gray-600 outline-gray-600">
            <SelectValue placeholder="Select Location Type" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="onsite">On-site</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Description */}
      <div className="flex flex-col gap-2 pt-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
        <textarea
          placeholder="List your major duties and successes, highlighting specific projects"
          className="outline-gray-600 border p-2 rounded-md text-sm transition-all duration-300 ease-in-out dark:hover:border-white hover:border-black border-gray-600 focus:outline-0 h-32 resize-none"
          maxLength={2000}
        />
        <div className="flex justify-end text-xs text-gray-500 dark:text-gray-400">
          <span>0/2,000</span>
        </div>
      </div>
      {/* Profile Headline */}
      <div className="flex flex-col gap-2 pt-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Profile headline
        </p>
        <input
          type="text"
          className="outline-gray-600 border p-2 rounded-md text-sm transition-all duration-300 ease-in-out dark:hover:border-white hover:border-black border-gray-600 focus:outline-0"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Appears below your name at the top of the profile
        </p>
      </div>

      {/* Job Source */}
      <div className="flex flex-col gap-2 pt-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Where did you find this job?
        </p>
        <Select>
          <SelectTrigger className="w-full border-gray-600 outline-gray-600">
            <SelectValue placeholder="Please select" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
            <SelectItem value="linkedin">LinkedIn Job Board</SelectItem>
            <SelectItem value="company-website">Company Website</SelectItem>
            <SelectItem value="referral">Employee Referral</SelectItem>
            <SelectItem value="other">Other Source</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This information will be used to improve LinkedIn’s job search
          experience.
        </p>
      </div>

      {/* Skills */}
      <div className="flex flex-col gap-2 pt-5">
        <div className="flex flex-col justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Skills
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            We recommend adding your top 5 used in this role
          </span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-blue-600 cusror-pointer border-blue-600 dark:border-blue-400 hover:bg-blue-600 dark:hover:bg-blue-300 hover:text-white dark:hover:text-gray-800 font-semibold transition-all duration-300 ease-in-out cursor-pointer border w-fit px-2 py-1.5 rounded-full dark:text-blue-400 text-sm"
        >
          <span>+</span>
          <span>Add skill</span>
        </button>
      </div>

      {/* Media */}
      <div className="flex flex-col gap-2 pt-5 pb-4">
        <div className="flex flex-col justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Media
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Learn more about media file types supported
          </span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-blue-600 cusror-pointer border-blue-600 dark:border-blue-400 hover:bg-blue-600 dark:hover:bg-blue-300 hover:text-white dark:hover:text-gray-800 font-semibold transition-all duration-300 ease-in-out cursor-pointer border w-fit px-2 py-1.5 rounded-full dark:text-blue-400 text-sm"
        >
          <span>+</span>
          <span>Add media</span>
        </button>
      </div>
    </div>
  );
};

export default AddExperienceModal;
