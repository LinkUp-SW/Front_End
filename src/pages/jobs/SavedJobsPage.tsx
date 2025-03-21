// SavedJobsPage.tsx
import React from 'react';
import { WithNavBar } from '../../components';
import LeftSidebar from './components/savedJobsPageComponents/LeftSideBar';
import JobsDashboard from './components/savedJobsPageComponents/JobsDashboard';
import InterviewTipsPanel from './components/savedJobsPageComponents/InterviewTipsPanel';
import Footer from './components/savedJobsPageComponents/Footer';

const SavedJobsPage: React.FC = () => {
  return (
    <div className="min-h-screen dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <LeftSidebar />
          </div>
          
          <div className="md:col-span-6">
            <JobsDashboard />
          </div>
          
          <div className="md:col-span-3">
            <InterviewTipsPanel />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WithNavBar(SavedJobsPage);