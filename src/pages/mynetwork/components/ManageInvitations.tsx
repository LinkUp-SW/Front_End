import { useState, useEffect, useCallback, useRef } from "react";
import withSidebarAd from "@/components/hoc/withSidebarAd";
import {
  fetchRecievedConnections,
  ReceivedConnections,
  fetchSentConnections,
  SentConnections,
  acceptInvitation,
  ignoreInvitation,
  withdrawInvitation,
} from "@/endpoints/myNetwork";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components";
import WithdrawInvitationModal from "./modals/WithdrawInvitationModal";
import { useNavigate } from "react-router-dom";

const LIMIT = 10;

const ManageInvitations: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [receivedInvitations, setReceivedInvitations] = useState<
    ReceivedConnections[]
  >([]);
  const [sentInvitations, setSentInvitations] = useState<SentConnections[]>([]);
  const [receivedNextCursor, setReceivedNextCursor] = useState<string | null>(
    null
  );
  const [sentNextCursor, setSentNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [allReceivedFetched, setAllReceivedFetched] = useState(false);
  const [allSentFetched, setAllSentFetched] = useState(false);

  const token = Cookies.get("linkup_auth_token");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastCursorRef = useRef<{
    received: string | null;
    sent: string | null;
  }>({
    received: null,
    sent: null,
  });

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const isVisible = entries[0].isIntersecting;
          if (!isVisible) return;

          if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

          debounceTimeout.current = setTimeout(() => {
            if (
              activeTab === "received" &&
              receivedNextCursor &&
              !allReceivedFetched
            ) {
              if (receivedNextCursor !== lastCursorRef.current.received) {
                lastCursorRef.current.received = receivedNextCursor;
                loadMoreReceived();
              }
            } else if (
              activeTab === "sent" &&
              sentNextCursor &&
              !allSentFetched
            ) {
              if (sentNextCursor !== lastCursorRef.current.sent) {
                lastCursorRef.current.sent = sentNextCursor;
                loadMoreSent();
              }
            }
          }, 300);
        },
        { threshold: 1.0 }
      );

      if (node) observerRef.current.observe(node);
    },
    [
      loading,
      activeTab,
      receivedNextCursor,
      sentNextCursor,
      allReceivedFetched,
      allSentFetched,
    ]
  );

  const fetchInitialData = async () => {
    if (!token) return;

    if (activeTab === "received") {
      if (receivedInvitations.length > 0) return;

      try {
        const data = await fetchRecievedConnections(token, null, LIMIT);
        setReceivedInvitations(data.receivedConnections);
        setReceivedNextCursor(data.nextCursor);
        if (!data.nextCursor) setAllReceivedFetched(true);
      } catch (error) {
        console.error("Error fetching received invitations:", error);
      }
    } else {
      if (sentInvitations.length > 0) return;

      try {
        const data = await fetchSentConnections(token, null, LIMIT);
        setSentInvitations(data.sentConnections);
        setSentNextCursor(data.nextCursor);
        if (!data.nextCursor) setAllSentFetched(true);
      } catch (error) {
        console.error("Error fetching sent invitations:", error);
      }
      setLoading(false);
    }
  };

  const navigateToUser = (user_id: string) => {
    return navigate(`/user-profile/${user_id}`);
  };

  useEffect(() => {
    console.log("Received Invitations:", receivedInvitations);
    console.log("Sent Invitations:", sentInvitations);
  }, [receivedInvitations, sentInvitations]);

  useEffect(() => {
    fetchInitialData();
  }, [activeTab]);

  const loadMoreReceived = async () => {
    if (!token || !receivedNextCursor) return;
    setLoading(true);
    try {
      const data = await fetchRecievedConnections(
        token,
        receivedNextCursor,
        LIMIT
      );
      setReceivedInvitations((prev) => [...prev, ...data.receivedConnections]);
      setReceivedNextCursor(data.nextCursor);
      if (!data.nextCursor) setAllReceivedFetched(true);
    } catch (error) {
      console.error("Error loading more received invitations:", error);
    }
    setLoading(false);
  };

  const loadMoreSent = async () => {
    if (!token || !sentNextCursor) return;
    setLoading(true);
    try {
      const data = await fetchSentConnections(token, sentNextCursor, LIMIT);
      setSentInvitations((prev) => [...prev, ...data.sentConnections]);
      setSentNextCursor(data.nextCursor);
      if (!data.nextCursor) setAllSentFetched(true);
    } catch (error) {
      console.error("Error loading more sent invitations:", error);
    }
    setLoading(false);
  };

  const acceptInvitations = async (userId: string) => {
    if (!token) return;
    try {
      await acceptInvitation(token, userId);
      setReceivedInvitations((prev) =>
        prev.filter((c) => c.user_id !== userId)
      );
    } catch (error) {
      console.error("Error accepting invitation", error);
    }
  };

  const ignoreInvitations = async (userId: string) => {
    if (!token) return;
    try {
      await ignoreInvitation(token, userId);
      setReceivedInvitations((prev) =>
        prev.filter((c) => c.user_id !== userId)
      );
    } catch (error) {
      console.error("Error ignoring invitation", error);
    }
  };

  const withdrawInvitations = async (userId: string) => {
    if (!token) return;
    try {
      await withdrawInvitation(token, userId);
      setSentInvitations((prev) => prev.filter((c) => c.user_id !== userId));
    } catch (error) {
      console.error("Error withdrawing invitation", error);
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Manage Invitations
      </h2>
      <div className="flex border-b-2 border-gray-300">
        <button
          id="received-invitations-button"
          className={`w-1/2 py-2 font-semibold cursor-pointer ${
            activeTab === "received"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("received")}
        >
          Received Invitations
        </button>
        <button
          id="sent-invitations-button"
          className={`w-1/2 py-2 font-semibold cursor-pointer ${
            activeTab === "sent"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Sent Invitations
        </button>
      </div>

      <div className="space-y-4 p-4 flex-grow overflow-y-auto">
        {activeTab === "received"
          ? receivedInvitations.map((invite, index) => (
              <div
                onClick={() => navigateToUser(invite.user_id)}
                key={invite.user_id}
                ref={
                  index === receivedInvitations.length - 1
                    ? lastElementRef
                    : null
                }
                className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm"
              >
                <img
                  src={invite.profilePicture}
                  alt={invite.name}
                  onClick={() => navigateToUser(invite.user_id)}
                  className="w-14 h-14 rounded-full"
                />
                <div className="flex-1 text-center sm:text-left">
                  <p
                    className="text-lg font-medium"
                    onClick={() => navigateToUser(invite.user_id)}
                    id="user-name-link"
                  >
                    {invite.name}
                  </p>
                  <p className="text-sm text-gray-600">{invite.headline}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    id="ignore-invitation-button"
                    onClick={() => ignoreInvitations(invite.user_id)}
                    className="text-gray-600"
                  >
                    Ignore
                  </button>
                  <button
                    id="accept-invitation-button"
                    onClick={() => acceptInvitations(invite.user_id)}
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          : sentInvitations.map((invite, index) => (
              <div
                key={invite.user_id}
                ref={
                  index === sentInvitations.length - 1 ? lastElementRef : null
                }
                className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm"
              >
                <img
                  onClick={() => navigateToUser(invite.user_id)}
                  src={invite.profilePicture}
                  alt={invite.name}
                  className="w-14 h-14 cursor-pointer rounded-full"
                />
                <div className="flex-1 text-center sm:text-left">
                  <p
                    className="text-lg font-medium cursor-pointer"
                    onClick={() => navigateToUser(invite.user_id)}
                    id="user-name-link"

                  >
                    {invite.name}
                  </p>
                  <p className="text-sm text-gray-600">{invite.headline}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      id="withdraw-invitation button"
                      className="bg-gray-500 text-white px-4 py-1 rounded"
                    >
                      Withdraw
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg p-6">
                    <DialogHeader>
                      <DialogTitle></DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <WithdrawInvitationModal
                      userData={{
                        userName: invite.name,
                        userId: invite.user_id,
                      }}
                      onConfirm={() => withdrawInvitations(invite.user_id)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ))}
      </div>
    </div>
  );
};

export default withSidebarAd(ManageInvitations);
