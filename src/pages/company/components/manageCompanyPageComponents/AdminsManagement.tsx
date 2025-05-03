import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  getCompanyAdmins, 
  searchUsers, 
  makeUserAdmin, 
  removeAdmin,
  Admin,
  User
} from '@/endpoints/company';

interface AdminManagementProps {
  companyId: string;
  companyName: string;
  onBack?: () => void;
}

const AdminManagement: React.FC<AdminManagementProps> = ({ companyId, companyName, onBack }) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Dialog state
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [adminToRemove, setAdminToRemove] = useState<Admin | null>(null);

  // Fetch admins when component mounts
  useEffect(() => {
    fetchAdmins();
  }, [companyId]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCompanyAdmins(companyId);
      setAdmins(response.admins || []);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Failed to load admins. Please try again.');
      toast.error('Failed to load admins. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setSearching(true);
      setError(null);
      const response = await searchUsers(searchQuery);
      setSearchResults(response.results || []);
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Failed to search users. Please try again.');
      toast.error('Failed to search users. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!selectedUser) return;
    
    try {
      setSubmitting(true);
      setError(null);
      await makeUserAdmin(companyId, selectedUser._id);
      
      // Reset state and refresh admins list
      setSelectedUser(null);
      setSearchQuery('');
      setSearchResults([]);
      setShowAddAdmin(false);
      
      // Show success toast
      toast.success(`${selectedUser.first_name} ${selectedUser.last_name} has been added as an admin.`);
      
      // Fetch updated list of admins
      await fetchAdmins();
    } catch (err) {
      console.error('Error adding admin:', err);
      setError('Failed to add admin. Please try again.');
      toast.error('Failed to add admin. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const openRemoveDialog = (admin: Admin) => {
    setAdminToRemove(admin);
    setRemoveDialogOpen(true);
  };

  const handleRemoveAdmin = async () => {
    if (!adminToRemove) return;
    
    try {
      setSubmitting(true);
      setError(null);
      await removeAdmin(companyId, adminToRemove._id);
      
      // Close dialog
      setRemoveDialogOpen(false);
      setAdminToRemove(null);
      
      // Show success toast
      toast.success(`${adminToRemove.first_name} ${adminToRemove.last_name} has been removed as an admin.`);
      
      // Refresh admins list
      await fetchAdmins();
    } catch (err) {
      console.error('Error removing admin:', err);
      setError('Failed to remove admin. Please try again.');
      toast.error('Failed to remove admin. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Search when query changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearchUsers();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Display error message if present
  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg mb-6 animate-fadeIn flex items-center">
        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd"></path>
        </svg>
        <span>{error}</span>
      </div>
    );
  };

  const AddAdminView = () => (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-gray-800 w-full max-w-4xl mx-auto transition-all duration-300 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center border-b border-gray-100 dark:border-gray-800 p-4 md:p-6">
        <button 
          id="back-to-admins-list"
          onClick={() => setShowAddAdmin(false)}
          className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-full transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Back to admins list">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="text-lg md:text-xl font-bold dark:text-white truncate">Add {companyName} Admin</h2>
      </div>
      
      <div className="p-4 md:p-6">
        {renderError()}
        
        <div className="mb-6">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a member to assign admin role"
              className="w-full ps-10 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white shadow-sm"
            />
          </div>

          {searching && (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3 dark:text-white">Search Results</h3>
              <div className="space-y-3">
                {searchResults.map((user) => (
                  <div 
                    key={user._id}
                    id={`user-result-${user._id}`}
                    className={`flex items-center p-3 md:p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedUser?._id === user._id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-700 shadow-md' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex-shrink-0 mr-3 md:mr-4">
                      {user.profile_photo ? (
                        <img 
                          src={user.profile_photo} 
                          alt={`${user.first_name} ${user.last_name}`}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                        />
                      ) : (
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-medium">
                          {user.first_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {user.first_name} {user.last_name}
                      </p>
                      {user.headline && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {user.headline}
                        </p>
                      )}
                    </div>
                    {selectedUser?._id === user._id && (
                      <div className="ml-2 md:ml-4 flex-shrink-0">
                        <div className="bg-blue-500 dark:bg-blue-600 rounded-full p-1">
                          <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchQuery && !searching && searchResults.length === 0 && (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-gray-600 dark:text-gray-400">No users found matching "{searchQuery}"</p>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-3">
            <button
              id="cancel-add-admin"
              onClick={() => setShowAddAdmin(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              id="confirm-add-admin"
              onClick={handleAddAdmin}
              disabled={!selectedUser || submitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200 ${
                !selectedUser || submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : 'Add Admin'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const RemoveAdminDialog = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Remove {companyName} Admin</h3>
        </div>
        
        <div className="px-4 md:px-6 py-4">
          {adminToRemove && (
            <>
              <div className="flex items-center justify-center my-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-4 ring-white dark:ring-gray-800">
                  {adminToRemove.profile_picture ? (
                    <img 
                      src={adminToRemove.profile_picture} 
                      alt={`${adminToRemove.first_name} ${adminToRemove.last_name}`}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                      <span className="text-xl md:text-2xl font-medium">
                        {adminToRemove.first_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {adminToRemove.first_name} {adminToRemove.last_name}
                </h2>
                {adminToRemove.headline && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{adminToRemove.headline}</p>
                )}
              </div>
              
              <div className="mb-6 text-center">
                <p className="text-gray-700 dark:text-gray-300">
                  You're about to remove {adminToRemove.first_name} as a {companyName} admin
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="px-4 md:px-6 py-4 bg-gray-50 dark:bg-gray-800 flex justify-end space-x-3">
          <button
            id="cancel-remove-admin"
            onClick={() => setRemoveDialogOpen(false)}
            className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            id="confirm-remove-admin"
            onClick={handleRemoveAdmin}
            disabled={submitting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Removing...
              </span>
            ) : 'Remove Admin'}
          </button>
        </div>
      </div>
    </div>
  );

  if (showAddAdmin) {
    return <AddAdminView />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
          <div className="flex items-center">
            <button 
              id="back-to-company"
              onClick={onBack} 
              className="mr-3 md:mr-4 p-1.5 md:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-full transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Back to company"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white flex items-center flex-wrap">
              <span className="truncate max-w-xs">{companyName}</span>
              <span className="mx-2 text-gray-400">·</span>
              <span className="text-blue-600 dark:text-blue-400">Admins</span>
            </h1>
          </div>
          <div>
            <button
              id="open-add-admin"
              onClick={() => setShowAddAdmin(true)}
              className="px-3 md:px-4 py-1.5 md:py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Admin
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        {renderError()}
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admins...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            {admins.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Profile
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {admins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors duration-150">
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10">
                              {admin.profile_picture ? (
                                <img 
                                  className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800" 
                                  src={admin.profile_picture} 
                                  alt={`${admin.first_name} ${admin.last_name}`} 
                                />
                              ) : (
                                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                  <span className="text-base md:text-lg font-medium">
                                    {admin.first_name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-3 md:ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {admin.first_name} {admin.last_name}
                              </div>
                              {admin.headline && (
                                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {admin.headline}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <span className="px-2 md:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            Admin
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            id={`remove-admin-${admin._id}`}
                            onClick={() => openRemoveDialog(admin)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                            aria-label={`Remove ${admin.first_name} as admin`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <svg className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400">No admins found for this company</p>
                <p className="mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-500">Click "Add Admin" to get started</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Remove Admin Dialog */}
      {removeDialogOpen && <RemoveAdminDialog />}
    </div>
  );
};

export default AdminManagement;