// InterviewTipsPanel.tsx
import React from 'react';

const InterviewTipsPanel: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
        Noha, learn what hiring managers look for in answers to top interview questions
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <img src="/api/placeholder/48/48" alt="Professional headshot" className="w-12 h-12 rounded-full" />
          <p className="ml-3 text-gray-800 dark:text-gray-200">Tell me about something you've accomplished that you are proud of.</p>
        </div>
        
        <div className="flex items-center">
          <img src="/api/placeholder/48/48" alt="Professional headshot" className="w-12 h-12 rounded-full" />
          <p className="ml-3 text-gray-800 dark:text-gray-200">Where do you see yourself in 5 years?</p>
        </div>
        
        <div className="flex items-center">
          <img src="/api/placeholder/48/48" alt="Professional headshot" className="w-12 h-12 rounded-full" />
          <p className="ml-3 text-gray-800 dark:text-gray-200">Tell me about yourself.</p>
        </div>
      </div>
      
      <button className="w-full mt-4 text-center py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
        See all questions
      </button>
    </div>
  );
};

export default InterviewTipsPanel;