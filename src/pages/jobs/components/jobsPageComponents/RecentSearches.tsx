import React from 'react';
import { RecentSearch } from '../../types';

interface RecentSearchesProps {
  searches: RecentSearch[];
  onClear: () => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onClear }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 transition-colors">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent job searches</h2>
        <button 
          id="clear-recent-searches-btn"
          onClick={onClear}
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
        >
          Clear
        </button>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {searches.map((search, index) => (
          <div key={index} className="p-4">
            <div className="text-blue-600 dark:text-blue-400 font-medium">{search.query}</div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {search.alert ? 'Alert On · ' : ''}{search.location} · {search.applyOn ? 'Apply on Linkup' : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;