import React from 'react';
import { RecentSearch } from '../types';

interface RecentSearchesProps {
  searches: RecentSearch[];
  onClear: () => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onClear }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Recent job searches</h2>
        <button 
          onClick={onClear}
          className="text-gray-600 hover:text-blue-600 text-sm"
        >
          Clear
        </button>
      </div>
      
      <div className="divide-y">
        {searches.map((search, index) => (
          <div key={index} className="p-4">
            <div className="text-blue-600 font-medium">{search.query}</div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-sm text-gray-600">
                {search.alert ? 'Alert On · ' : ''}{search.location} · {search.applyOn ? 'Apply on LinkedIn' : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
