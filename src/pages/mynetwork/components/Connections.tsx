import { useState, useEffect, useCallback, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import withSidebarAd from "@/components/hoc/withSidebarAd";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Modal,
} from "@/components";
import {
  fetchConnections,
  Connection,
  removeConnections,
} from "@/endpoints/myNetwork";
import RemoveConnectionModal from "./modals/remove_connection_modal/RemoveConnectionModal";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

const Connections: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const token = Cookies.get("linkup_auth_token");
  const { id } = useParams();

  const observer = useRef<IntersectionObserver | null>(null);
  const hasFetchedInitial = useRef(false); // Prevents double fetching on mount
  const [openDialogUserId, setOpenDialogUserId] = useState<string | null>(null);

  const handleRemoveConnection = useCallback(
    async (userId: string) => {
      if (!token) {
        console.error("No authentication token found.");
        return; // Optionally handle the case where token is missing
      }

      try {
        // Call removeConnections and pass token and userId
        await removeConnections(token, userId);

        // Update UI to remove the connection from the list
        setConnections((prevConnections) =>
          prevConnections.filter((c) => c.user_id !== userId)
        );
      } catch (error) {
        console.error("Error removing connection:", error);
        // Optionally, handle error state (e.g., show a notification)
      }
    },
    [token]
  );

  const loadConnections = useCallback(async () => {
    if (!token || loading || !hasMore) return;

    setLoading(true);
    try {
      console.log(id);
      const data = await fetchConnections(token, id as string, cursor, 7);

      // Avoid fetching twice by checking duplicates
      setConnections((prev) => {
        const existingIds = new Set(prev.map((conn) => conn.user_id));
        const newConnections = data.connections.filter(
          (conn) => !existingIds.has(conn.user_id)
        );
        return [...prev, ...newConnections];
      });

      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  }, [token, cursor, hasMore, loading]);

  useEffect(() => {
    if (!hasFetchedInitial.current) {
      hasFetchedInitial.current = true;
      loadConnections();
    }
  }, [loadConnections]);

  const lastConnectionRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadConnections();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadConnections]
  );

  const navigateToUser = (user_id: string) => {
    return navigate(`/user-profile/${user_id}`);
  };

  return (
    <div className="min-h-screen p-10 flex flex-col lg:flex-row">
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-h-fit">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {loading && connections.length === 0
            ? "Loading..."
            : `${connections.length} connections`}
        </h2>

        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Search connections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
            aria-label="Search connections"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" />
        </div>

        <div className="space-y-4">
          {connections
            .filter((conn) =>
              conn.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((conn, index) => (
              <div
                ref={
                  index === connections.length - 1 ? lastConnectionRef : null
                }
                key={conn.user_id}
                className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={conn.profilePicture}
                    alt={conn.name}
                    onClick={() => navigateToUser(conn.user_id)}
                    id="user-name-link"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3
                      className="text-lg font-medium text-gray-900 dark:text-white"
                      onClick={() => navigateToUser(conn.user_id)}
                    >
                      {conn.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {conn.headline}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="message-button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md cursor-pointer"
                  >
                    Message
                  </button>
                  <Dialog
                    open={openDialogUserId === conn.user_id}
                    onOpenChange={(open) => {
                      if (!open) setOpenDialogUserId(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <button
                        id="remove-connection-button"
                        className="flex items-center justify-center text-gray-700 dark:text-white cursor-pointer transition duration-200"
                        aria-label={`Remove connection with ${conn.name}`}
                        onClick={() => setOpenDialogUserId(conn.user_id)}
                      >
                        <FaTimes className="mr-2 flex-shrink-0" />
                      </button>
                    </DialogTrigger>
                    <DialogContent
                      id="remove-connection-dialog-content"
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg p-6"
                    >
                      <RemoveConnectionModal
                        userData={{ userName: conn.name, userId: conn.user_id }}
                        onConfirm={() => handleRemoveConnection(conn.user_id)}
                        onCancel={() => setOpenDialogUserId(null)}
                      />
                      <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
        </div>

        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading more...
          </p>
        )}
      </div>
      <Modal />
    </div>
  );
};

export default withSidebarAd(Connections);
