import { useEffect, useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Cookies from "js-cookie";
import { getAllUsers, createAdmin, DeleteUser } from "@/endpoints/admin";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface User {
  id: string;
  user_id: string;
  short_id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string;
  is_admin: boolean;
  created_at: string;
}

const Users = () => {
  const token = Cookies.get("linkup_auth_token") || "";
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const limit = 10;

  const [showForm, setShowForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");

  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      const res = await getAllUsers(token, (page - 1) * limit, limit);
      setUsers(res.data.users);
      setTotalPages(Math.ceil(res.data.total_count / limit));
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setNewAdmin({ ...newAdmin, email });

    if (!email) {
      setEmailError("");
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleAddAdmin = async () => {
    if (emailError) {
      toast.error("Please fix the email error before submitting");
      return;
    }

    if (!validateEmail(newAdmin.email)) {
      setEmailError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await createAdmin(token, {
        email: newAdmin.email,
        password: newAdmin.password,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
      });

      setNewAdmin({ firstName: "", lastName: "", email: "", password: "" });
      setShowForm(false);
      toast.success("Admin created successfully!");

      fetchUsers(currentPage);
    } catch (error) {
      console.error("Failed to create admin", error);
      toast.error("Failed to create admin");
    }
  };

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      const result = await DeleteUser(token, userToDelete);
      if (result.success) {
        toast.success("Account deleted successfully");
        fetchUsers(currentPage);
      } else {
        toast.error(result.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to delete account");
      } else {
        toast.error("Failed to delete account");
      }
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 rounded-2xl shadow-xl p-4 sm:p-6 transform transition duration-300 mb-12">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Users
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-green-400 text-white p-2 rounded-full hover:opacity-90 transition"
          >
            <FiPlus size={20} />
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-[600px] sm:min-w-full w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-2">Profile</th>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.short_id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-2">
                    <img
                      src={user.profile_picture}
                      alt="Profile"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 break-words">{user.first_name}</td>
                  <td className="px-4 py-2 break-words">{user.last_name}</td>
                  <td className="px-4 py-2 break-words">{user.email}</td>
                  <td className="px-4 py-2">{user.short_id}</td>
                  <td className="px-4 py-2">
                    {user.is_admin ? "Admin" : "User"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => handleDeleteClick(user.id)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </DialogTrigger>
                        {userToDelete === user.id && (
                          <DialogContent className="bg-white dark:bg-gray-800">
                            <DialogHeader>
                              <DialogTitle className="text-gray-900 dark:text-white">
                                Are you absolutely sure?
                              </DialogTitle>
                              <DialogDescription className="text-gray-600 dark:text-gray-300">
                                This action cannot be undone. This will
                                permanently delete this account and remove all
                                their data from our servers.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setUserToDelete(null)}
                                className="text-gray-900 dark:text-white"
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                              >
                                {isDeleting ? "Deleting..." : "Delete Account"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        )}
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
              Loading users...
            </div>
          )}
        </div>

        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <FiChevronLeft size={20} />
          </button>

          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
              Add New Admin
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={newAdmin.firstName}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, firstName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={newAdmin.lastName}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, lastName: e.target.value })
                }
              />
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className={`w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    emailError ? "border-red-500 dark:border-red-500" : ""
                  }`}
                  value={newAdmin.email}
                  onChange={handleEmailChange}
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {emailError}
                  </p>
                )}
              </div>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
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
                  disabled={!!emailError}
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
