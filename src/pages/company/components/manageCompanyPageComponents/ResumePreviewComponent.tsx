import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ResumePreviewComponentProps {
  resumeUrl: string;
  applicantName: string;
}

const ResumePreviewComponent: React.FC<ResumePreviewComponentProps> = ({ resumeUrl, applicantName }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  useEffect(()=>{
console.log(resumeUrl)
  },[resumeUrl])

  // Function to handle opening the preview
  const handleOpenPreview = () => {
    setIsLoading(true);
    setPreviewError(false);
    setIsPreviewOpen(true);
  };

  // Function to handle direct download
  const handleDirectDownload = () => {
    window.open(resumeUrl, '_blank');
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Actions buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleOpenPreview}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors duration-200"
        >
          Preview Resume
        </button>
        
        <button
          onClick={handleDirectDownload}
          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-3 py-1 rounded transition-colors duration-200"
        >
          Download Resume
        </button>
      </div>

      {/* Preview modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-medium dark:text-white">
                Resume: {applicantName}
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal content */}
            <div className="flex-1 overflow-auto p-4">
              {isLoading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}

              {previewError ? (
                <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-red-800 dark:text-red-200">Unable to Access Resume</h3>
                  <p className="mt-2 text-red-700 dark:text-red-300">The resume file could not be accessed. It may have been moved, edited, or deleted.</p>
                  <div className="mt-4">
                    <button
                      onClick={handleDirectDownload}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600"
                    >
                      Try Direct Link
                    </button>
                    <button
                      onClick={() => setIsPreviewOpen(false)}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <iframe
                  src={resumeUrl}
                  className="w-full h-[70vh] border-0"
                  onLoad={() => {
                    setIsLoading(false);
                  }}
                  onError={(e) => {
                    console.error('Resume preview failed to load:', resumeUrl, e);
                    setIsLoading(false);
                    setPreviewError(true);
                    toast.error("Failed to load resume preview");
                  }}
                  title={`${applicantName}'s Resume`}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreviewComponent;