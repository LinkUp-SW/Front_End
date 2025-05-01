import React from 'react';
import { ArrayField } from './JobForm';

interface RequirementsStepProps {
  textareaValues: {
    responsibilities: string;
    qualifications: string;
    benefits: string;
  };
  handleArrayFieldChange: (e: React.ChangeEvent<HTMLTextAreaElement>, field: ArrayField) => void;
}

const RequirementsStep: React.FC<RequirementsStepProps> = ({
  textareaValues,
  handleArrayFieldChange
}) => {
  const textareaFields: Array<{label: string, field: ArrayField, placeholder: string}> = [
    {
      label: "Responsibilities*", 
      field: "responsibilities",
      placeholder: "• Lead the development of front-end applications\n• Collaborate with design teams to implement user interface components\n• Ensure the technical feasibility of UI/UX designs\n• Optimize applications for maximum speed and scalability"
    },
    {
      label: "Qualifications*", 
      field: "qualifications",
      placeholder: "• Bachelor's degree or equivalent in Computer Science\n• 2+ years' experience in frontend development\n• Familiarity using Scrum/Agile development methodologies\n• Experience building object oriented web applications in JavaScript, HTML5, and CSS3"
    },
    {
      label: "Benefits", 
      field: "benefits",
      placeholder: "• Competitive salary and bonus structure\n• Health, dental, and vision insurance\n• 401(k) retirement plan with company match\n• Flexible work schedule and remote work options"
    }
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Requirements & Benefits</h2>
      
      {textareaFields.map(({ label, field, placeholder }) => (
        <div className="mb-5 sm:mb-6" key={field}>
          <label className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300">{label}</label>
          <textarea
            name={field}
            value={textareaValues[field]}
            onChange={(e) => handleArrayFieldChange(e, field)}
            placeholder={placeholder}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 min-h-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows={5}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter each item on a new line</p>
        </div>
      ))}
    </div>
  );
};

export default RequirementsStep;