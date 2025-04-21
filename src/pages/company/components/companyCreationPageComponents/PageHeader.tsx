interface PageHeaderProps {
    type: 'company' | 'education';
    onBack: () => void;
  }
  
  export const PageHeader: React.FC<PageHeaderProps> = ({ type, onBack }) => {
    return (
      <div className="w-full border-b border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-900 fixed top-14 left-0 z-13">
        <div className="max-w-6xl mx-auto px-6">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 my-4 group"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transform group-hover:-translate-x-1 transition-transform duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span>Back</span>
          </button>
  
          <div className="flex items-center mb-6">
            {type === 'company' ? (
              <>
                <div className="flex-shrink-0 mr-3">
                  <img 
                    src="/src/assets/company.png" 
                    alt="Company icon" 
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <p className="text-gray-800 dark:text-gray-200">Let's get started with a few details about your company.</p>
              </>
            ) : (
              <>
                <div className="flex-shrink-0 mr-3">
                  <img 
                    src="/src/assets/institution.png" 
                    alt="Educational institution icon" 
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <p className="text-gray-800 dark:text-gray-200">
                  Let's get started with a few details about your educational institute. After creating the page, you can request to get additional education features like the Alumni tool.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default PageHeader;