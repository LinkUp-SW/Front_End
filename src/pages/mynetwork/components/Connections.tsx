import { useState, useEffect, useCallback, useRef } from "react";
import { FaPaperPlane, FaSearch, FaTimes } from "react-icons/fa";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { editUserBio } from "@/slices/user_profile/userBioSlice";
import { toast } from "sonner";

const Connections: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const token = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const userBioState = useSelector((state: RootState) => state.userBio);
  const dispatch = useDispatch();

  const observer = useRef<IntersectionObserver | null>(null);
  const hasFetchedInitial = useRef(false); // Prevents double fetching on mount
  const [openDialogUserId, setOpenDialogUserId] = useState<string | null>(null);

  const handleRemoveConnection = useCallback(
    async (userId: string) => {
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      try {
        await removeConnections(token, userId);
        setConnections((prevConnections) =>
          prevConnections.filter((c) => c.user_id !== userId)
        );
        toast.success("Connection removed successfully!");
      } catch (error) {
        console.error("Error removing connection:", error);
        toast.error("Failed to remove connection.");
      }
    },
    [token]
  );

  const loadConnections = useCallback(async () => {
    if (!token || loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await fetchConnections(token, id as string, cursor, 7);

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

  useEffect(() => {
    dispatch(
      editUserBio({
        ...userBioState,
        number_of_connections: connections.length,
      })
    );
  }, [connections]);

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
    <div className="min-h-screen p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 flex flex-col">
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 sm:p-4 max-h-fit">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
          {loading && connections.length === 0
            ? "Loading..."
            : `${connections.length} connections`}
        </h2>

        <div className="relative w-full mb-3 sm:mb-4">
          <input
            type="text"
            placeholder="Search connections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-10 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
            aria-label="Search connections"
          />
          <FaSearch className="absolute left-3 top-2.5 sm:top-3 text-gray-500 dark:text-gray-400" />
        </div>

        <div className="space-y-3 sm:space-y-4">
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
                className="flex items-center justify-between p-2 sm:p-3 md:p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                  <img
                    src={conn.profilePicture}
                    alt={conn.name}
                    onClick={() => navigateToUser(conn.user_id)}
                    id="user-name-link"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3
                      className="text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white truncate"
                      onClick={() => navigateToUser(conn.user_id)}
                    >
                      {conn.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conn.headline}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    id="message-button"
                    className="w-full sm:w-auto px-4 py-2 border rounded-full text-blue-600 border-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
                  >
                    <FaPaperPlane/>
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
                        <FaTimes className="text-sm sm:text-base" />
                      </button>
                    </DialogTrigger>
                    <DialogContent
                      id="remove-connection-dialog-content"
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg p-4 sm:p-6"
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
          <p className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2 sm:mt-4">
            Loading more...
          </p>
        )}
      </div>
      <Modal />
    </div>
  );
};

export default withSidebarAd(Connections);
