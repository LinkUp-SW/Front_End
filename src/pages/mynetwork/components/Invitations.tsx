import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchRecievedConnections,
  ReceivedConnections,
  acceptInvitation,
  ignoreInvitation,
} from "@/endpoints/myNetwork";
import Cookies from "js-cookie";
import useFetchData from "@/hooks/useFetchData";
import { useParams } from "react-router-dom";
import { useConnectionContext } from "./ConnectionContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { editUserBio } from "@/slices/user_profile/userBioSlice";
import { toast } from "sonner";

const Invitations = () => {
  const [invitations, setInvitations] = useState<ReceivedConnections[]>([]);
  const [numberOfReceived, setNumberOfReceived] = useState(0);
  const { connectionCount, setConnectionCount } = useConnectionContext();
  const userBioState = useSelector((state: RootState) => state.userBio);
  const dispatch = useDispatch();

  const token = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const { data } = useFetchData(
    () =>
      token
        ? fetchRecievedConnections(token, id as string, 3)
        : Promise.resolve(null),
    [token]
  );

  useEffect(() => {
    if (data && data.receivedConnections) {
      setInvitations(data.receivedConnections.slice(0, 3)); // Update invitations state when data is available
      setNumberOfReceived(data.numberOfReceivedConnections || 0);
    }
  }, [data]);

  const navigate = useNavigate();

  const acceptInvitations = useCallback(
    async (userId: string) => {
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      try {
        await acceptInvitation(token, userId);

        setInvitations((prevInvitations) =>
          prevInvitations.filter((c) => c.user_id !== userId)
        );
        setNumberOfReceived((prev) => Math.max(prev - 1, 0));
        setConnectionCount(connectionCount + 1);
        dispatch(
          editUserBio({
            ...userBioState,
            number_of_connections: connectionCount + 1,
          })
        );
        toast.success("Invitation accepted!");
      } catch (error) {
        console.error("can't", error);
        toast.error("Failed to accept invitation.");
      }
    },
    [token, connectionCount, setConnectionCount]
  );

  const ignoreInvitations = useCallback(
    async (userId: string) => {
      if (!token) {
        console.error("No authentication token found.");
        return; // Optionally handle the case where token is missing
      }

      try {
        await ignoreInvitation(token, userId);

        setInvitations((prevInvitations) =>
          prevInvitations.filter((c) => c.user_id !== userId)
        );
        setNumberOfReceived((prev) => Math.max(prev - 1, 0));
        toast.success("Invitation ignored.");
      } catch (error) {
        console.error("Error", error);
        toast.error("Failed to ignore invitation.");
      }
    },
    [token]
  );

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        {numberOfReceived > 0 && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Invitations ({numberOfReceived})
          </h2>
        )}
        <button
          id="showall-invitations-button"
          className="text-blue-600 hover:underline cursor-pointer"
          onClick={() => navigate("/manage-invitations")}
        >
          Manage
        </button>
      </div>
      <ul className="space-y-4">
        {invitations.map((invite) => (
          <li
            key={invite.user_id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex-col min-[450px]:flex-row"
          >
            <Link
              to={`/user-profile/${invite.user_id}`}
              className="flex items-center space-x-4 flex-1"
            >
              <img
                src={invite.profilePicture}
                alt={invite.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">
                  {invite.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {invite.headline}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {invite.numberOfMutualConnections === 1 ? (
                    <span>
                      {invite.nameOfOneMutualConnection} is a mutual connection
                    </span>
                  ) : invite.numberOfMutualConnections > 1 ? (
                    <span>
                      {invite.nameOfOneMutualConnection} and{" "}
                      {invite.numberOfMutualConnections - 1}{" "}
                      {invite.numberOfMutualConnections - 1 === 1
                        ? "other"
                        : "others"}{" "}
                      are mutual connections
                    </span>
                  ) : null}
                </p>
              </div>
            </Link>
            <div className="flex space-x-2">
              <button
                id="ignore-invitation-button"
                onClick={() => ignoreInvitations(invite.user_id)}
                className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              >
                Ignore
              </button>
              <button
                id="accept-invitation-button"
                onClick={() => acceptInvitations(invite.user_id)}
                className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Accept
              </button>
            </div>
          </li>
        ))}
      </ul>
      {invitations.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 mt-4">
          No pending invitations
        </p>
      )}
    </div>
  );
};

export default Invitations;
