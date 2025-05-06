import React from "react";
import { JobFormData, WorkMode, CompanySearchResult } from "./JobForm";
import companyImg from "@/assets/company.png";
interface ValidationErrors {
  title?: boolean;
  location?: boolean;
  salary?: boolean;
  salaryNegative?: boolean;
  salaryInvalid?: boolean;
}

interface JobDetailsStepProps {
  jobData: JobFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleWorkModeChange: (mode: WorkMode) => void;
  isFreeJob: boolean;
  showCompanyResults: boolean;
  isSearching: boolean;
  companySearchResults: CompanySearchResult[];
  companySearchQuery: string;
  handleSelectCompany: (company: CompanySearchResult) => void;
  validationErrors: ValidationErrors;
  validateSalary: (value: string) => void;
}

const JobDetailsStep: React.FC<JobDetailsStepProps> = ({
  jobData,
  handleInputChange,
  handleWorkModeChange,
  isFreeJob,
  showCompanyResults,
  isSearching,
  companySearchResults,
  companySearchQuery,
  handleSelectCompany,
  validationErrors,
  validateSalary,
}) => {
  // Handle salary input change with validation
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    validateSalary(e.target.value);
  };

  return (
    <>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        * Indicates required
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Job details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job title*
              {validationErrors.title && (
                <span className="text-red-500 ml-1">Required</span>
              )}
            </label>
            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleInputChange}
              placeholder="Frontend Developer"
              className={`w-full border ${
                validationErrors.title
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
              required
              maxLength={50}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-500">
                Please enter a job title
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company*
            </label>
            <input
              type="text"
              name="company"
              value={jobData.company}
              onChange={handleInputChange}
              onFocus={() => isFreeJob}
              placeholder="Your Company"
              className={`w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 ${
                isFreeJob
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-100 dark:bg-gray-700"
              } text-gray-900 dark:text-gray-300`}
              disabled={!isFreeJob}
              required
              maxLength={50}
            />

            {/* Company search results dropdown */}
            {isFreeJob && showCompanyResults && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto company-dropdown">
                {isSearching ? (
                  <div className="p-2 text-gray-500 dark:text-gray-400 text-center">
                    Searching...
                  </div>
                ) : companySearchResults.length > 0 ? (
                  companySearchResults.map((company) => (
                    <div
                      key={company._id}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center border-b border-gray-100 dark:border-gray-700"
                      onClick={() => handleSelectCompany(company)}
                      onMouseDown={(e) => e.preventDefault()} // Prevent blur event from hiding dropdown
                    >
                      <img
                        src={company.logo || companyImg}
                        alt={company.name}
                        className="w-8 h-8 mr-3 rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {company.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Click to select
                        </p>
                      </div>
                    </div>
                  ))
                ) : companySearchQuery.length >= 2 ? (
                  <div className="p-2 text-gray-500 dark:text-gray-400 text-center">
                    No companies found
                  </div>
                ) : (
                  <div className="p-2 text-gray-500 dark:text-gray-400 text-center">
                    Type at least 2 characters
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Work mode*
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {(["On-site", "Remote", "Hybrid"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleWorkModeChange(mode)}
                className={`py-2 px-4 rounded ${
                  jobData.workMode === mode
                    ? "bg-blue-100 dark:bg-blue-900 border border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-300"
                    : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job location*
              {validationErrors.location && (
                <span className="text-red-500 ml-1">Required</span>
              )}
            </label>
            <input
              type="text"
              name="location"
              value={jobData.location}
              onChange={handleInputChange}
              placeholder="Cairo, Egypt"
              className={`w-full border ${
                validationErrors.location
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
              required
              maxLength={50}
            />
            {validationErrors.location && (
              <p className="mt-1 text-sm text-red-500">
                Please enter a job location
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Experience level*
            </label>
            <div className="relative">
              <select
                name="experience_level"
                value={jobData.experience_level}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="Internship">Internship</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Associate">Associate</option>
                <option value="Mid-Senior">Mid-Senior</option>
                <option value="Director">Director</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Salary range*
            {validationErrors.salary && (
              <span className="text-red-500 ml-1">Required</span>
            )}
            {validationErrors.salaryNegative && (
              <span className="text-red-500 ml-1">Cannot be negative</span>
            )}
            {validationErrors.salaryInvalid && (
              <span className="text-red-500 ml-1">Invalid format</span>
            )}
          </label>
          <input
            type="text"
            name="salary"
            value={jobData.salary}
            onChange={handleSalaryChange}
            placeholder="50000"
            className={`w-full border ${
              validationErrors.salary ||
              validationErrors.salaryNegative ||
              validationErrors.salaryInvalid
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
            required
            maxLength={50}
          />
          {validationErrors.salary && (
            <p className="mt-1 text-sm text-red-500">
              Please enter a salary range
            </p>
          )}
          {validationErrors.salaryNegative && (
            <p className="mt-1 text-sm text-red-500">
              Salary cannot be negative
            </p>
          )}
          {validationErrors.salaryInvalid && (
            <p className="mt-1 text-sm text-red-500">
              Please enter a valid salary (e.g. "$50,000", "$50k-$70k", or
              "50000-70000")
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
          Description
        </label>
        <div className="border border-gray-300 dark:border-gray-600 rounded p-2 mb-2 bg-white dark:bg-gray-800">
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleInputChange}
            placeholder="The ideal candidate will be responsible for designing, developing, testing, and debugging responsive web and mobile applications..."
            className="w-full border-none focus:ring-0 min-h-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows={8}
            maxLength={500}
          />
        </div>
      </div>
    </>
  );
};

export default JobDetailsStep;
