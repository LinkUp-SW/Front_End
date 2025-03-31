import { useState, useEffect, useCallback } from "react";
import withSidebarAd from "@/components/hoc/withSidebarAd";
import { fetchRecievedConnections, ReceivedConnections, fetchSentConnections, SentConnections, acceptInvitation, ignoreInvitation, withdrawInvitation } from "@/endpoints/myNetwork";
import Cookies from "js-cookie";
import useFetchData from "@/hooks/useFetchData";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  
} from "@/components";
import WithdrawInvitationModal from "./modals/WithdrawInvitationModal";

const ManageInvitations: React.FC = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [receivedInvitations, setReceivedInvitations] = useState<ReceivedConnections[]>([]);
  const [sentInvitations, setSentInvitations] = useState<SentConnections[]>([]);
  const token = Cookies.get("linkup_auth_token");

  // Fetch received invitations
  const { data: receivedConnections } = useFetchData(
    () => (token ? fetchRecievedConnections(token) : Promise.resolve(null)),
    [token]
  );
  const { data: sentConnections } = useFetchData(
    () => (token ? fetchSentConnections(token) : Promise.resolve(null)),
    [token]
  );

  useEffect(() => {
    if (receivedConnections?.receivedConnections) {
      setReceivedInvitations(receivedConnections.receivedConnections);
    }
    if (sentConnections?.sentConnections) {
      setSentInvitations(sentConnections.sentConnections);
    }
  }, [receivedConnections, sentConnections]);

  const acceptInvitations = useCallback(
    async (userId: string) => {
      if (!token) return;
      try {
        await acceptInvitation(token, userId);
        setReceivedInvitations((prev) => prev.filter((c) => c.user_id !== userId));
      } catch (error) {
        console.error("Error accepting invitation", error);
      }
    },
    [token]
  );

  const ignoreInvitations = useCallback(
    async (userId: string) => {
      if (!token) return;
      try {
        await ignoreInvitation(token, userId);
        setReceivedInvitations((prev) => prev.filter((c) => c.user_id !== userId));
      } catch (error) {
        console.error("Error ignoring invitation", error);
      }
    },
    [token]
  );

  const withdrawInvitations = useCallback(
    async (userId: string) => {
      if (!token) return;
      try {
        await withdrawInvitation(token, userId);
        setSentInvitations((prev) => prev.filter((c) => c.user_id !== userId));
      } catch (error) {
        console.error("Error withdrawing invitation", error);
      }
    },
    [token]
  );

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all flex flex-col max-h-fit">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Manage Invitations</h2>
      <div className="flex border-b-2 border-gray-300">
        <button
          className={`w-1/2 text-center py-2 font-semibold cursor-pointer ${
            activeTab === "received" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("received")}
        >Received Invitations</button>
        <button
          className={`w-1/2 text-center py-2 font-semibold cursor-pointer ${
            activeTab === "sent" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("sent")}
        >Sent Invitations</button>
      </div>

      <div className="space-y-4 p-4 flex-grow min-h-0">
        {activeTab === "received"
          ? receivedInvitations.map((invite) => (
              <div key={invite.user_id} className="flex flex-col sm:flex-row items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <img src={invite.profilePicture} alt={invite.name} className="w-14 h-14 rounded-full border border-gray-300" />
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{invite.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invite.headline}</p>
                </div>
                <div className="flex space-x-2 sm:ml-auto">
                  <button onClick={() => ignoreInvitations(invite.user_id)} className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Ignore</button>
                  <button onClick={() => acceptInvitations(invite.user_id)} className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">Accept</button>
                </div>
              </div>
            ))
          : sentInvitations.map((invite) => (
              <div key={invite.user_id} className="flex flex-col sm:flex-row items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <img src={invite.profilePicture} alt={invite.name} className="w-14 h-14 rounded-full border border-gray-300" />
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{invite.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invite.headline}</p>
                </div>
                <div className="flex justify-center sm:justify-start sm:w-auto sm:ml-auto">
                  <Dialog>
                    <DialogTrigger>
                      <button className="px-4 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600">Withdraw</button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>
                      <WithdrawInvitationModal userData={{ userName: invite.name, userId: invite.user_id }} onConfirm={() => withdrawInvitations(invite.user_id)} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default withSidebarAd(ManageInvitations);