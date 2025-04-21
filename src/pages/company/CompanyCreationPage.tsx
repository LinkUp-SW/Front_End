import { useState} from 'react';
import { WithNavBar } from '@/components';
import { useNavigate } from 'react-router-dom';
import PageTypeSelection from './components/companyCreationPageComponents/PageTypeSelection';
import PageHeader from './components/companyCreationPageComponents/PageHeader';
import PageForm from './components/companyCreationPageComponents/PageForm';
import PagePreview from './components/companyCreationPageComponents/PagePreview';

const CompanyCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'company' | 'education' | null>(null);


  // Handle type selection
  const handleTypeSelection = (type: 'company' | 'education') => {
    setSelectedType(type);
  };

  // Handle back button click
  const handleBack = () => {
    setSelectedType(null);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle form submission, validation, etc.
    // For now, just navigate to a success page
    navigate('/pages/success');
  };

  return (
    <div className="min-h-screen">
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
                <PageForm type={selectedType} onSubmit={handleSubmit} />
              </div>

              {/* Preview Section */}
              <div className="md:w-1/3">
                <PagePreview type={selectedType} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WithNavBar(CompanyCreationPage);