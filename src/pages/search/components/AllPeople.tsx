import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  getusers,
  connectWithUser,
  acceptInvitation,
} from "@/endpoints/myNetwork";
import { Person, UsersResponse, Pagination } from "@/endpoints/myNetwork";
import withSidebarAd from "@/components/hoc/withSidebarAd";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import manOnChair from "../../../assets/man_on_chair.svg";
import { FaPaperPlane } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { socketService } from "@/services/socket";

const AllPeople: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("query") || "";
  const [people, setPeople] = useState<Person[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 5,
    pages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [connectionFilter, setConnectionFilter] = useState<
    "all" | "1st" | "2nd" | "3rd"
  >("all");
  const [loading, setLoading] = useState(false);
  const [connectingUserIds, setConnectingUserIds] = useState<string[]>([]);
  const [acceptingUserIds, setAcceptingUserIds] = useState<string[]>([]);
  const token = Cookies.get("linkup_auth_token");
  const [openDialogUserId, setOpenDialogUserId] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState<string>("");
  const [emailTouched, setEmailTouched] = useState<boolean>(false);

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response: UsersResponse = await getusers(
        token,
        query,
        connectionFilter === "all" ? "" : connectionFilter,
        currentPage,
        pagination.limit
      );
      setPeople(response.people);
      setPagination({ ...response.pagination, limit: 5 });
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token, query, connectionFilter, currentPage, pagination.limit]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToUser = (user_id: string) => {
    navigate(`/user-profile/${user_id}`);
  };

  const handleConnect = async (userId: string, email: string) => {
    if (!token) return;
    setConnectingUserIds((prev) => [...prev, userId]);
    try {
      await connectWithUser(token, userId, email);
      socketService.sendNotification(
        userId as string,
        Cookies.get("linkup_user_id") as string,
        "connection_request",
        undefined,
        "new connection request"
      );

      toast.success("Connection request sent successfully!");
      setPeople((prev) =>
        prev.map((person) =>
          person.user_id === userId
            ? { ...person, is_in_sent_connections: true }
            : person
        )
      );
    } catch (error) {
      console.error("Connection failed", error);
      toast.error(getErrorMessage(error) || "Failed to send connection");
    } finally {
      setConnectingUserIds((prev) => prev.filter((id) => id !== userId));
      setOpenDialogUserId(null);
      setEmailInput("");
      setEmailTouched(false);
    }
  };

  const handleAccept = async (userId: string) => {
    if (!token) return;
    setAcceptingUserIds((prev) => [...prev, userId]);
    try {
      await acceptInvitation(token, userId);
      socketService.sendNotification(userId as string, Cookies.get('linkup_user_id') as string, 'connection_accepted',undefined,'Connection Accepted')
      toast.success("Connection accepted!");
      setPeople((prev) =>
        prev.map((person) =>
          person.user_id === userId
            ? {
                ...person,
                connection_degree: "1st",
                is_in_received_connections: false,
                is_in_sent_connections: false,
              }
            : person
        )
      );
    } catch (error) {
      console.error("Accepting invitation failed", error);
      toast.error("Failed to accept connection.");
    } finally {
      setAcceptingUserIds((prev) => prev.filter((id) => id !== userId));
    }
  };
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="flex justify-center px-2">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 flex flex-col overflow-hidden">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          All People
        </h2>

        <div className="mb-4 flex flex-wrap gap-2">
          {["all", "1st", "2nd", "3rd"].map((degree) => (
            <button
              id="connections-filter"
              key={degree}
              onClick={() => {
                setConnectionFilter(degree as "all" | "1st" | "2nd" | "3rd");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                connectionFilter === degree
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {degree === "all" ? "All" : `${degree} Degree`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {people.length > 0 ? (
                people.map((person) => (
                  <div
                    key={person.user_id}
                    className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-4 border-b last:border-none bg-white dark:bg-gray-800"
                  >
                    <div
                      className="flex items-center space-x-4 cursor-pointer w-full"
                      onClick={() => navigateToUser(person.user_id)}
                    >
                      {person.profile_photo ? (
                        <img
                          src={person.profile_photo}
                          alt={person.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {person.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 overflow-hidden">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                          {person.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                          {person.headline}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {person.location}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {person.mutual_connections.count === 1 ? (
                            <span>
                              {person.mutual_connections.suggested_name} is a
                              mutual connection
                            </span>
                          ) : person.mutual_connections.count > 1 ? (
                            <span>
                              {person.mutual_connections.suggested_name} and{" "}
                              {person.mutual_connections.count - 1}{" "}
                              {person.mutual_connections.count - 1 === 1
                                ? "other"
                                : "others"}{" "}
                              are mutual connections
                            </span>
                          ) : null}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:ml-4 w-full sm:w-auto text-right">
                      {person.connection_degree === "1st" ? (
                        <button
                          id="message-button"
                          className="w-full sm:w-auto px-4 py-2 border rounded-full text-blue-600 border-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
                        >
                          <FaPaperPlane />
                          Message
                        </button>
                      ) : person.is_in_received_connections ? (
                        <button
                          id="accept-invitation-button"
                          onClick={() => handleAccept(person.user_id)}
                          disabled={acceptingUserIds.includes(person.user_id)}
                          className="w-full sm:w-auto px-4 py-2 border rounded-full text-green-600 border-green-600 hover:bg-green-100 dark:hover:bg-gray-700 disabled:opacity-50"
                          style={{ minWidth: "118px" }}
                        >
                          {acceptingUserIds.includes(person.user_id)
                            ? "Accepting..."
                            : "Accept"}
                        </button>
                      ) : person.is_in_sent_connections ? (
                        <button
                          id="pending-button"
                          className="w-full sm:w-auto px-4 py-2 border rounded-full text-gray-400 border-gray-400 cursor-not-allowed flex items-center justify-center"
                          style={{ minWidth: "118px" }}
                        >
                          Pending
                        </button>
                      ) : (
                        <button
                          id="connect-button"
                          onClick={() =>
                            person.is_connect_by_email
                              ? setOpenDialogUserId(person.user_id)
                              : handleConnect(person.user_id, "")
                          }
                          disabled={connectingUserIds.includes(person.user_id)}
                          className="w-full sm:w-auto px-4 py-2 border rounded-full text-blue-600 border-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <IoPersonAdd />
                          {connectingUserIds.includes(person.user_id)
                            ? "Connecting..."
                            : "Connect"}
                        </button>
                      )}

                      {/* Email Dialog */}
                      <Dialog
                        open={!!openDialogUserId}
                        onOpenChange={() => {
                          setOpenDialogUserId(null);
                          setEmailInput("");
                          setEmailTouched(false);
                        }}
                      >
                        <DialogContent className="dark:bg-gray-800 dark:text-white">
                          <DialogHeader>
                            <DialogTitle className="dark:text-white">
                              Enter Email to Connect
                            </DialogTitle>
                            <DialogDescription className="dark:text-gray-300">
                              This user requires email verification to connect.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-2 mt-4">
                            <Input
                              type="email"
                              placeholder="Enter email"
                              value={emailInput}
                              onChange={(e) => {
                                setEmailInput(e.target.value);
                                setEmailTouched(true);
                              }}
                              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                            {!isValidEmail(emailInput) && emailTouched && (
                              <p className="text-sm text-red-500">
                                The email you entered is invalid.
                              </p>
                            )}
                            <Button
                              onClick={() =>
                                openDialogUserId &&
                                handleConnect(openDialogUserId, emailInput)
                              }
                              disabled={
                                !emailInput ||
                                !isValidEmail(emailInput) ||
                                connectingUserIds.includes(
                                  openDialogUserId || ""
                                )
                              }
                              className={`${
                                emailInput && isValidEmail(emailInput)
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-gray-300 text-gray-600"
                              } rounded-md px-4 py-2 transition-colors duration-200`}
                            >
                              {connectingUserIds.includes(
                                openDialogUserId || ""
                              )
                                ? "Connecting..."
                                : "Submit"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                  <img
                    src={manOnChair}
                    alt="No results"
                    className="w-40 h-40 mb-4"
                  />
                  <p>No people found.</p>
                </div>
              )}
            </div>

            {pagination.pages > 1 && (
              <div className="flex flex-wrap justify-center mt-6 gap-2">
                <button
                  id="previous-button"
                  onClick={() =>
                    paginate(currentPage > 1 ? currentPage - 1 : 1)
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded disabled:opacity-50 bg-gray-100"
                >
                  &lt; Previous
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  id="next-button"
                  onClick={() =>
                    paginate(
                      currentPage < pagination.pages
                        ? currentPage + 1
                        : pagination.pages
                    )
                  }
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-1 rounded disabled:opacity-50 bg-gray-100"
                >
                  Next &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default withSidebarAd(AllPeople);
