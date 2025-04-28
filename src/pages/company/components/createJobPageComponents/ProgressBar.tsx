import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return 'Job details';
      case 2: return 'Requirements & benefits';
      case 3: return 'Review and publish';
      default: return '';
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
        {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
      </h1>
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
        <div 
          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;