import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Person,
  connectWithUser,
  acceptInvitation,
} from "@/endpoints/myNetwork";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";

const People: React.FC<{
  people: Person[];
  query: string;
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
}> = ({ people, query, setPeople }) => {
  const navigate = useNavigate();
  const [connectingUserIds, setConnectingUserIds] = useState<string[]>([]);
  const [acceptingUserIds, setAcceptingUserIds] = useState<string[]>([]);
  const token = Cookies.get("linkup_auth_token");

  const navigateToUser = (user_id: string) => {
    return navigate(`/user-profile/${user_id}`);
  };

  const handleConnect = async (userId: string) => {
    if (!token) return;
    setConnectingUserIds((prev) => [...prev, userId]);
    try {
      await connectWithUser(token, userId, "");
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
      toast.error(getErrorMessage(error) || "Failed to sent connection");
    } finally {
      setConnectingUserIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleAccept = async (userId: string) => {
    if (!token) return;
    setAcceptingUserIds((prev) => [...prev, userId]);
    try {
      await acceptInvitation(token, userId);
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

  return (
    <div className="flex justify-center">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">People</h2>

        <div className="space-y-4">
          {people.slice(0, 3).map((person, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border-b last:border-none bg-white dark:bg-gray-800"
            >
              <div
                className="flex items-center space-x-4 cursor-pointer"
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
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {person.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {person.headline}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {person.location}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {person.mutual_connections.count === 1 ? (
                      <span>
                        {person.mutual_connections.suggested_name} is a mutual
                        connection
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
              {person.connection_degree === "1st" ? (
                <button
                  id="message-button"
                  className="px-4 py-2 border rounded-full text-blue-600 border-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700"
                >
                  Message
                </button>
              ) : person.is_in_received_connections ? (
                <button
                  id="accept-invitation-button"
                  onClick={() => handleAccept(person.user_id)}
                  disabled={acceptingUserIds.includes(person.user_id)}
                  className="px-4 py-2 border rounded-fullc hover:bg-green-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  {acceptingUserIds.includes(person.user_id)
                    ? "Accepting..."
                    : "Accept"}
                </button>
              ) : person.is_in_sent_connections ? (
                <button
                  id="pending-button"
                  className="px-4 py-2 border rounded-full text-gray-400 border-gray-400 cursor-not-allowed"
                >
                  Pending
                </button>
              ) : (
                <button
                  id="connect-button"
                  onClick={() => handleConnect(person.user_id)}
                  disabled={connectingUserIds.includes(person.user_id)}
                  className="px-4 py-2 border rounded-full text-gray-600 border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  {connectingUserIds.includes(person.user_id)
                    ? "Connecting..."
                    : "Connect"}
                </button>
              )}
            </div>
          ))}
        </div>
        {people.length > 3 && (
          <button
            id="see-all-people-button"
            onClick={() =>
              navigate(`/search/users?query=${encodeURIComponent(query)}`)
            }
            className="w-full mt-2 py-2 text-gray-500 dark:text-gray-400 border-t pt-2"
          >
            See all people results
          </button>
        )}
      </div>
    </div>
  );
};

export default People;
