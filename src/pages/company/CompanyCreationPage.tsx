import { useState } from 'react';
import { WithNavBar } from '@/components';
import { useNavigate } from 'react-router-dom';
import PageTypeSelection from './components/companyCreationPageComponents/PageTypeSelection';
import PageHeader from './components/companyCreationPageComponents/PageHeader';
import PageForm from './components/companyCreationPageComponents/PageForm';
import PagePreview from './components/companyCreationPageComponents/PagePreview';

const CompanyCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'company' | 'education' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState({
    logoPreview: null as string | null,
    name: '',
    description: ''
  });

  // Handle type selection
  const handleTypeSelection = (type: 'company' | 'education') => {
    setSelectedType(type);
    setErrorMessage(null);
  };

  // Handle back button click
  const handleBack = () => {
    setSelectedType(null);
    setErrorMessage(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      navigate('/jobs');
    } catch  {
      console.error('Error creating company');
      setErrorMessage('Failed to create company. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {errorMessage && (
        <div className="max-w-6xl mx-auto px-4 py-2 mt-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errorMessage}
          </div>
        </div>
      )}
      
      {!selectedType ? (
        <PageTypeSelection onSelectType={handleTypeSelection} />
      ) : (
        <>
          <PageHeader type={selectedType} onBack={handleBack} />

          {/* Content section */}
          <div className="max-w-6xl mx-auto px-4 py-6 mt-30">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Form Section */}
              <div className="flex-1 bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <PageForm 
                  type={selectedType} 
                  onSubmit={handleSubmit}
                  setPreviewData={setPreviewData}
                  isSubmitting={isSubmitting}
                />
              </div>

              {/* Preview Section */}
              <div className="md:w-1/3">
                <PagePreview 
                  type={selectedType} 
                  logoPreview={previewData.logoPreview}
                  name={previewData.name}
                  description={previewData.description}
                />
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Optional loading overlay when submitting */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
              <p>Creating your page...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithNavBar(CompanyCreationPage);