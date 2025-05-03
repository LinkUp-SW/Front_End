import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsLayoutPage from "@/components/hoc/SettingsLayoutPage";
import {
  FaArrowLeft,
  FaBan,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import useFetchData from "@/hooks/useFetchData";
import Cookies from "js-cookie";
import {
  getBlockedUsersList,
  unBlockUser,
} from "@/endpoints/settingsEndpoints";
import { BlockedUser } from "@/types";
import { timeAgo } from "@/utils";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";

const BlockingListPage: React.FC = () => {
  const token = Cookies.get("linkup_auth_token");
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BlockedUser | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { data, loading, error } = useFetchData(
    async () => (token ? getBlockedUsersList(token) : Promise.resolve(null)),
    []
  );

  useEffect(() => {
    if (data) setBlockedUsers(data.blocked_list);
  }, [data]);

  const handleBack = () => navigate("/settings/visibility");

  const handleUnblockClick = (user: BlockedUser) => {
    setSelectedUser(user);
    setShowUnblockModal(true);
    setPassword("");
    setShowPassword(false);
  };

  const handleCloseModal = () => {
    setShowUnblockModal(false);
    setSelectedUser(null);
    setPassword("");
  };

  const handleUnblock = async () => {
    if (!password) return;
    try {
      const response = await unBlockUser(
        token as string,
        selectedUser?.user_id as string,
        password
      );
      toast.success(response.message);
      setBlockedUsers((prev) =>
        prev.filter((user) => user.user_id !== selectedUser?.user_id)
      );
      handleCloseModal();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <SettingsLayoutPage>
      <div className="py-10 px-4">
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              className="flex items-center mr-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex-grow">
              Blocked Users
            </h2>
          </div>

          {loading && (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 animate-pulse">
              {Array.from({ length: 3 }).map((_, idx) => (
                <li key={idx} className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="w-24 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {error && (
            <div className="p-6 text-center text-red-600 dark:text-red-400 flex items-center justify-center space-x-2">
              <FaExclamationTriangle />
              <span>Failed to load blocked users. Please try again later.</span>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
                You’re blocking{" "}
                <span className="font-semibold">{blockedUsers.length}</span>{" "}
                users
              </div>

              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {blockedUsers.map((user) => (
                  <li
                    key={user.user_id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center space-x-4">
                      <FaBan className="text-xl text-gray-600 dark:text-gray-300" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {timeAgo(user.date)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnblockClick(user)}
                      className="text-red-500 font-semibold hover:bg-red-100 dark:hover:bg-red-700 px-3 py-1 rounded-full transition"
                    >
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Unblock Modal */}
        {showUnblockModal && selectedUser && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-[1000]">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm shadow-xl overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Unblock {selectedUser.name}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-600 dark:text-gray-300 text-xl hover:text-gray-800 dark:hover:text-gray-100"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Please enter your password to confirm unblocking.
                </p>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="appearance-none password w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <button
                  onClick={handleUnblock}
                  disabled={!password}
                  className="w-full py-2 rounded-lg font-semibold destructiveBtn transition"
                >
                  Confirm Unblock
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You won’t be able to reblock this user for the next 48 hours.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SettingsLayoutPage>
  );
};

export default BlockingListPage;
