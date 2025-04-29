import { useState } from 'react';

interface PagePreviewProps {
  type: 'company' | 'education';
  logoPreview?: string | null;
  name?: string;
  description?: string;
}

export const PagePreview: React.FC<PagePreviewProps> = ({ 
  type, 
  logoPreview, 
  name, 
  description 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Truncate description if it's longer than 100 characters
  const truncatedDescription = description && description.length > 100 && !expanded
    ? description.substring(0, 100) + '...'
    : description;
    
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white">Page preview</h2>
        <svg className="w-5 h-5 ml-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 rounded p-6">
        <div className="bg-white dark:bg-gray-800 rounded p-4">
          <div className="mb-4 w-24 h-24 bg-gray-200 rounded flex overflow-hidden">
            {logoPreview ? (
              <img 
                src={logoPreview} 
                alt={`${name || (type === 'company' ? 'Company' : 'Institution')} logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="w-1/3 h-full bg-gray-400"></div>
                <div className="w-1/3 h-full bg-gray-500"></div>
                <div className="w-1/3 h-full bg-blue-400"></div>
              </>
            )}
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-1 break-words max-w-full overflow-hidden">
            {name || (type === 'company' ? 'Company name' : 'Institution name')}
          </h3>
          <div className="min-h-12">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 break-words max-w-full overflow-hidden">
              {truncatedDescription || 'Tagline'}
            </p>
            {description && description.length > 100 && (
              <button 
                onClick={() => setExpanded(!expanded)} 
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Industry</p>
        </div>
      </div>
    </div>
  );
};

export default PagePreview;