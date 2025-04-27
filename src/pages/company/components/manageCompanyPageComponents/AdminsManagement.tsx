import React, { useState, useEffect } from 'react';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components';
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
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Display error message if present
  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-md mb-4">
        {error}
      </div>
    );
  };

  if (showAddAdmin) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 sm:p-6 dark:shadow-gray-800 w-full max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            id="back-to-admins-list"
            onClick={() => setShowAddAdmin(false)}
            className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold dark:text-white">Add {companyName} Admin</h2>
        </div>
        
        {renderError()}
        
        <div className="mb-6">
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a member to assign roles"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {searching && (
            <div className="text-center py-4">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2 dark:text-white">Search Results</h3>
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div 
                    key={user._id}
                    id={`user-result-${user._id}`}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                      selectedUser?._id === user._id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-700' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex-shrink-0 mr-3">
                      {user.profile_photo ? (
                        <img 
                          src={user.profile_photo} 
                          alt={`${user.first_name} ${user.last_name}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                            {user.first_name.charAt(0)}
                          </span>
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchQuery && !searching && searchResults.length === 0 && (
            <div className="text-center py-4 text-gray-600 dark:text-gray-400">
              No users found matching "{searchQuery}"
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              id="cancel-add-admin"
              onClick={() => setShowAddAdmin(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 mr-2"
            >
              Cancel
            </button>
            <button
              id="confirm-add-admin"
              onClick={handleAddAdmin}
              disabled={!selectedUser || submitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 ${
                !selectedUser || submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Adding...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <button 
              id="back-to-company"
              onClick={onBack} 
              className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {companyName} - Admins
            </h1>
          </div>
          <div className="flex space-x-2">
            <button
              id="open-add-admin"
              onClick={() => setShowAddAdmin(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 flex items-center"
            >
              <span className="mr-1">+</span> Add admin
            </button>
          </div>
        </div>
      </div>
      
      {renderError()}
      
      {loading ? (
        <div className="text-center py-6">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        </div>
      ) : (
        <div>
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Profile
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr key={admin._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {admin.profile_picture ? (
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={admin.profile_picture} 
                                alt={`${admin.first_name} ${admin.last_name}`} 
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                                  {admin.first_name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {admin.first_name} {admin.last_name}
                            </div>
                            {admin.headline && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {admin.headline}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          Admin
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          id={`remove-admin-${admin._id}`}
                          onClick={() => openRemoveDialog(admin)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No admins found for this company.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Remove Admin Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={(open) => {
        if (!open || !submitting) {
          setRemoveDialogOpen(open);
          if (!open) {
            setAdminToRemove(null);
          }
        }
      }}>
        <DialogContent className="w-full max-w-md p-0 bg-white dark:bg-gray-900 dark:text-gray-200">
          <DialogHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="dark:text-white">Remove {companyName} Admin</DialogTitle>
          </DialogHeader>
          
          <div className="px-4 py-4">
            {adminToRemove && (
              <>
                <div className="flex items-center justify-center my-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {adminToRemove.profile_picture ? (
                      <img 
                        src={adminToRemove.profile_picture} 
                        alt={`${adminToRemove.first_name} ${adminToRemove.last_name}`}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-gray-600 dark:text-gray-300 text-2xl font-medium">
                        {adminToRemove.first_name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <h2 className="text-lg font-medium dark:text-white">
                    {adminToRemove.first_name} {adminToRemove.last_name}
                  </h2>
                  {adminToRemove.headline && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{adminToRemove.headline}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="dark:text-gray-300">
                    You're about to remove {adminToRemove.first_name} as a {companyName} admin
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <button
                    id="cancel-remove-admin"
                    type="button"
                    onClick={() => setRemoveDialogOpen(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm-remove-admin"
                    type="button"
                    onClick={handleRemoveAdmin}
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagement;