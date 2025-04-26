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
    
    // Form data will be handled in the PageForm component
    // This just handles the navigation after successful submission
    try {
      setIsSubmitting(true);
      // The actual API call is now handled within the PageForm component
      // Here we just handle navigation upon successful form submission
      navigate('/jobs');
    } catch (error: any) {
      console.error('Error creating company:', error);
      setErrorMessage(error.message || 'Failed to create company. Please try again.');
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
    </div>
  );
};

export default WithNavBar(CompanyCreationPage);