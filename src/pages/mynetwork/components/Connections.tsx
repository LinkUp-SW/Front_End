import { useState, useCallback } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import withSidebarAd from "@/components/hoc/withSidebarAd"; // Import the HOC
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Modal,
} from "@/components";
import { fetchConnections, Connection } from "@/endpoints/myNetwork";
import RemoveConnectionModal from "./modals/remove_connection_modal/RemoveConnectionModal";

const Connections: React.FC = () => {
  const [search, setSearch] = useState("");
  const [connections, setConnections] = useState<Connection[]>([]);

  const [loading, setLoading] = useState(true);

  const handleRemoveConnection = useCallback((userId: number) => {
    setConnections((prevConnections) =>
      prevConnections.filter((c) => c.id !== userId)
    );
  }, []);

  // Fetch using callback and manual trigger
  const loadConnections = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchConnections();
      setConnections(data);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useState(() => {
    loadConnections();
  });

  return (
    <div className="min-h-screen p-10 flex flex-col lg:flex-row ">
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-h-fit">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {loading ? "Loading..." : `${connections.length} connections`}
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
            .map((conn) => (
              <div
                key={conn.id}
                className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={conn.image}
                    alt={conn.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {conn.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {conn.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Connected on {conn.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Message Button */}
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md cursor-pointer">
                    Message
                  </button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="flex items-center justify-center  text-gray-700 dark:text-white cursor-pointer transition duration-200"
                        aria-label={`Remove connection with ${conn.name}`}
                      >
                        <FaTimes className="mr-2  flex-shrink-0" />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <RemoveConnectionModal
                        userData={{ userName: conn.name, userId: conn.id }}
                        onConfirm={() => handleRemoveConnection(conn.id)}
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
      </div>

      <Modal />
    </div>
  );
};

export default withSidebarAd(Connections);
