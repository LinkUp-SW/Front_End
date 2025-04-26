import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { IoArrowBack } from 'react-icons/io5';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from "@/services/axiosInstance";
import Cookies from 'js-cookie';

interface Admin {
  id: string;
  name: string;
  title?: string;
  profilePicture?: string;
  connectionDegree?: string;
}

interface User {
  id: string;
  name: string;
  title?: string;
  profilePicture?: string;
  connectionDegree?: string;
}

interface AdminsManagementProps {
  organizationId: string;
  onClose: () => void;
}

const getAuthToken = () => {
  const token = Cookies.get('linkup_auth_token');
  if (!token) {
    throw new Error('Authentication required');
  }
  return token;
};

const getAuthHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const AdminsManagement: React.FC<AdminsManagementProps> = ({ organizationId, onClose }) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, [organizationId]);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getAuthToken();
      const response = await axiosInstance.get(
        `/api/v1/company/get-admins/${organizationId}`,
        getAuthHeader(token)
      );
      setAdmins(response.data.admins || []);
    } catch (error: any) {
      console.error('Failed to fetch admins:', error);
      setError('Failed to load admins. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const token = getAuthToken();
      
      // Fix: Updated the API endpoint to match your backend
      const response = await axiosInstance.get(
        `/api/v1/search/users?name=${encodeURIComponent(query)}`,
        getAuthHeader(token)
      );
      
      // Filter out users who are already admins
      const currentAdminIds = admins.map(admin => admin.id);
      const filteredResults = (response.data.users || []).filter(
        (user: User) => !currentAdminIds.includes(user.id)
      );
      
      setSearchResults(filteredResults);
    } catch (error: any) {
      console.error('Failed to search users:', error);
      setError('Failed to search for users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 2) {
      // Debounce search for better performance
      const delayDebounceFn = setTimeout(() => {
        searchUsers(query);
      }, 300);
      
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setSearchQuery('');
    setSearchResults([]);
  };

  const makeAdmin = async () => {
    if (!selectedUser) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const token = getAuthToken();
      await axiosInstance.post(
        `/api/v1/company/make-admin/${organizationId}/${selectedUser.id}`,
        {},
        getAuthHeader(token)
      );
      
      // Add new admin to the list
      setAdmins([...admins, selectedUser as Admin]);
      setSelectedUser(null);
      setIsSearchVisible(false);
      // Refresh admins list to get updated data from server
      fetchAdmins();
    } catch (error: any) {
      console.error('Failed to make admin:', error);
      setError('Failed to add admin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeAdmin = async (adminId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getAuthToken();
      await axiosInstance.delete(
        `/api/v1/company/remove-admin/${organizationId}/${adminId}`,
        getAuthHeader(token)
      );
      
      // Remove admin from the list
      setAdmins(admins.filter(admin => admin.id !== adminId));
    } catch (error: any) {
      console.error('Failed to remove admin:', error);
      setError('Failed to remove admin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to create a default avatar for users without profile pictures
  const renderAvatar = (name: string, profilePicture?: string) => {
    if (profilePicture) {
      return <img src={profilePicture} alt={name} className="w-full h-full object-cover" />;
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-medium">
        {name?.charAt(0)}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 sm:p-6 dark:shadow-gray-800 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={onClose}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <IoArrowBack className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold dark:text-white">Manage Admins</h1>
        </div>
        
        {!isSearchVisible && (
          <button
            onClick={() => setIsSearchVisible(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          >
            + Add admin
          </button>
        )}
      </div>

      {/* Info Text */}
      {!isSearchVisible && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          All admins have access to admin view, with the same permissions.
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Search UI */}
      {isSearchVisible ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium dark:text-white">Add Page admin</h2>
            <button 
              onClick={() => {
                setIsSearchVisible(false);
                setSelectedUser(null);
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <IoMdClose className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {selectedUser ? (
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                  {renderAvatar(selectedUser.name, selectedUser.profilePicture)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium dark:text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.connectionDegree && `${selectedUser.connectionDegree} • `}
                    {selectedUser.title || ''}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <IoMdClose className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <button
                onClick={makeAdmin}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 disabled:bg-blue-400"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          ) : (
            <div>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search for a member to assign role"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <IoMdClose className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 ? (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-h-80 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div 
                      key={user.id}
                      onClick={() => selectUser(user)}
                      className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                        {renderAvatar(user.name, user.profilePicture)}
                      </div>
                      <div>
                        <h3 className="font-medium dark:text-white">{user.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.connectionDegree && `${user.connectionDegree} • `}
                          {user.title || ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.length >= 2 && !isLoading ? (
                <p className="text-center text-gray-600 dark:text-gray-400 py-4">No users found</p>
              ) : null}

              {isLoading && searchQuery.length >= 2 && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Admins List */
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-700 dark:text-gray-300">Profile</div>
            <div className="font-medium text-gray-700 dark:text-gray-300">Role</div>
            <div className="font-medium text-gray-700 dark:text-gray-300 text-right">Actions</div>
          </div>

          {isLoading && admins.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : admins.length === 0 ? (
            <div className="p-6 text-center text-gray-600 dark:text-gray-400">
              No admins found. Add admins to manage your company page.
            </div>
          ) : (
            admins.map((admin) => (
              <div 
                key={admin.id}
                className="grid grid-cols-3 p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 items-center"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                    {renderAvatar(admin.name, admin.profilePicture)}
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">{admin.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {admin.connectionDegree && `${admin.connectionDegree} • `}
                      {admin.title || '--'}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                    Admin
                  </span>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => removeAdmin(admin.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-200"
                    title="Remove admin"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminsManagement;