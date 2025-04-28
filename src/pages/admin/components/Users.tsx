import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface User {
  id: string;
  firstName: string;
  secondName: string;
  email: string;
  type: "Admin" | "User";
  profilePic: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      firstName: "John",
      secondName: "Doe",
      email: "john@example.com",
      type: "Admin",
      profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: "2",
      firstName: "Jane",
      secondName: "Smith",
      email: "jane@example.com",
      type: "User",
      profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: "3",
      firstName: "Michael",
      secondName: "Johnson",
      email: "michael@example.com",
      type: "User",
      profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: "4",
      firstName: "Emily",
      secondName: "Williams",
      email: "emily@example.com",
      type: "Admin",
      profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      id: "5",
      firstName: "David",
      secondName: "Brown",
      email: "david@example.com",
      type: "User",
      profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    secondName: "",
    email: "",
    profilePic: "",
  });

  const handleAddAdmin = () => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      firstName: newAdmin.firstName,
      secondName: newAdmin.secondName,
      email: newAdmin.email,
      type: "Admin",
      profilePic: newAdmin.profilePic || "https://via.placeholder.com/150",
    };
    setUsers([...users, newUser]);
    setNewAdmin({ firstName: "", secondName: "", email: "", profilePic: "" });
    setShowForm(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <>
      <div className="bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 rounded-2xl shadow-xl p-6 transform transition duration-300 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-green-400 text-white p-2 rounded-full hover:opacity-90 transition"
          >
            <FiPlus size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-2">Profile</th>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Second Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2 text-center">Action</th> {/* Center Action title */}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2">
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{user.firstName}</td>
                  <td className="px-4 py-2">{user.secondName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.type}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td> {/* Center Trash icon */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
              Add New Admin
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={newAdmin.firstName}
                onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Second Name"
                className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={newAdmin.secondName}
                onChange={(e) => setNewAdmin({ ...newAdmin, secondName: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Profile Picture URL"
                className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={newAdmin.profilePic}
                onChange={(e) => setNewAdmin({ ...newAdmin, profilePic: e.target.value })}
              />
              <div className="flex justify-end gap-4 pt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 px-6 rounded-lg hover:opacity-80"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAdmin}
                  className="bg-gradient-to-r from-blue-500 to-green-400 text-white py-2 px-6 rounded-lg hover:opacity-90"
                >
                  Add Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
