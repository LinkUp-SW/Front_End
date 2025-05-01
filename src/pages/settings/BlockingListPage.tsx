import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayoutPage from '@/components/hoc/SettingsLayoutPage';
import { FaArrowLeft, FaBan } from 'react-icons/fa';
import { blockedUsers, BlockedUser } from '@/endpoints/blockList';

const BlockingListPage: React.FC = () => {
  const navigate = useNavigate();
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BlockedUser | null>(null);
  const [password, setPassword] = useState('');

  const handleBack = () => {
    navigate('/settings/visibility');
  };

  const handleUnblockClick = (user: BlockedUser) => {
    setSelectedUser(user);
    setShowUnblockModal(true);
  };

  const handleCloseModal = () => {
    setShowUnblockModal(false);
    setSelectedUser(null);
    setPassword('');
  };

  const handleUnblock = () => {
    // In a real implementation, this would make an API call to unblock the user
    console.log(`Unblocking user: ${selectedUser?.name}`);
    handleCloseModal();
  };

  return (
    <SettingsLayoutPage>
      <div className="py-10 px-4 m-0">
        <div className="w-full max-w-[790px] mx-auto bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden p-0">
          <div className="flex items-center py-4 px-6 border-b border-[rgba(0,0,0,0.08)]">
            <button 
              className="flex items-center bg-transparent border-0 cursor-pointer text-[rgba(0,0,0,0.6)] text-sm font-semibold mr-4"
              onClick={handleBack}
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <h2 className="text-xl font-semibold text-[rgba(0,0,0,0.9)] m-0 flex-grow">
              Blocking
            </h2>
          </div>

          <div className="py-2 px-6 text-sm text-[rgba(0,0,0,0.6)]">
            You're currently blocking {blockedUsers.length} people
          </div>

          <ul className="m-0 p-0 list-none">
            {blockedUsers.map((user) => (
              <li key={user.id} className="flex items-center justify-between py-4 px-6 border-t border-[rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-3">
                  <FaBan className="text-[rgba(0,0,0,0.6)] text-lg" />
                  <div>
                    <div className="text-base font-semibold text-[rgba(0,0,0,0.9)]">{user.name}</div>
                    <div className="text-sm text-[rgba(0,0,0,0.6)]">{user.blockedDate}</div>
                  </div>
                </div>
                <button 
                  className="bg-transparent border-0 text-[#0891b2] font-semibold text-base cursor-pointer py-1.5 px-2 rounded transition-colors duration-200 ease-in-out hover:bg-[rgba(8,145,178,0.08)] hover:underline"
                  onClick={() => handleUnblockClick(user)}
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Unblock Modal */}
      {showUnblockModal && selectedUser && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-[1000]">
          <div className="bg-white rounded-lg w-[350px] max-w-[90%] shadow-lg relative">
            <div className="flex justify-between items-center pt-5 px-6 pb-0">
              <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.9)] m-0">Enter Password</h3>
              <button 
                className="bg-transparent border-0 cursor-pointer text-xl text-[rgba(0,0,0,0.6)]"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-[rgba(0,0,0,0.9)] mb-4">
                Enter your password to unblock this member. You will not be able to reblock this member for 48 hours after unblocking
              </p>
              <label htmlFor="password" className="block text-sm text-[rgba(0,0,0,0.9)] mb-2 after:content-['_*'] after:text-[#b24020]">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full py-2.5 px-3 border border-[rgba(0,0,0,0.3)] rounded text-sm mb-4 focus:outline-none focus:border-[#0a66c2] focus:shadow-[0_0_0_1px_#0a66c2]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between px-6 pb-5">
              <button 
                className="font-semibold border-0 rounded-2xl py-2 px-4 cursor-pointer transition-colors duration-200 ease-in-out"
                onClick={handleUnblock} 
                disabled={!password}
                style={{ 
                  backgroundColor: password ? '#0891b2' : 'rgba(0, 0, 0, 0.08)',
                  color: password ? 'white' : 'rgba(0, 0, 0, 0.6)'
                }}
              >
                Unblock member
              </button>
              <a href="#" className="text-[#0a66c2] text-sm font-semibold no-underline cursor-pointer hover:underline">
                Forgot password
              </a>
            </div>
          </div>
        </div>
      )}
    </SettingsLayoutPage>
  );
};

export default BlockingListPage;