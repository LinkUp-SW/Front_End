import React, { useState, useEffect, useCallback } from 'react';
import { getCompanyAdmins } from '@/endpoints/company';
import { toast } from 'sonner';
import { BiGroup } from 'react-icons/bi';

interface AdminViewerProps {
  companyId?: string;
  isVisible: boolean;
}

interface Admin {
  _id: string;
  first_name: string;
  last_name: string;
  headline?: string;
  profile_picture?: string;
}

const AdminViewerComponent: React.FC<AdminViewerProps> = ({ companyId, isVisible }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const fetchAdmins = useCallback(async () => {
    if (!companyId) return;
    
    try {
      setIsLoading(true);
      const response = await getCompanyAdmins(companyId);
      setAdmins(response.admins || []);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
      toast.error('Failed to load company administrators');
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (isVisible) {
      fetchAdmins();
    }
  }, [fetchAdmins, isVisible]);

  if (!isVisible) return null;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6 my-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
          <BiGroup className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          People
        </h2>
        <div className="flex justify-center items-center h-48">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 dark:border-blue-400 rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading administrators...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6 my-6">
      <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
        <BiGroup className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        Company Administrators
      </h2>
      
      {admins.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {admins.map(admin => (
            <div 
              key={admin._id} 
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-gray-700 transition-shadow bg-white dark:bg-gray-800"
            >
              <div className="flex-shrink-0 mr-3">
                {admin.profile_picture ? (
                  <img 
                    src={admin.profile_picture} 
                    alt={`${admin.first_name} ${admin.last_name}`}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/api/placeholder/100/100";
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                      {admin.first_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {admin.first_name} {admin.last_name}
                </h3>
                {admin.headline && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {admin.headline}
                  </p>
                )}
                <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                  Administrator
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-40 h-40 mb-4 flex justify-center">
            <BiGroup className="w-full h-full text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">No administrators found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
            There are no administrators listed for this company.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminViewerComponent;