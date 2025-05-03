import { Switch } from "@/components";
import {
  getMessagingRequestStatus,
  updateMessagingRequestStatus,
} from "@/endpoints/settingsEndpoints";
import useFetchData from "@/hooks/useFetchData";
import { getErrorMessage } from "@/utils/errorHandler";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AllowMessagingToggler = () => {
  const token = Cookies.get("linkup_auth_token");
  const [allowConnectionsOnly, setAllowConnectionsOnly] = useState(false);
  const { data, error } = useFetchData(
    async () =>
      token ? getMessagingRequestStatus(token) : Promise.resolve(null),
    []
  );
  useEffect(() => {
    if (data) {
      setAllowConnectionsOnly(data.messagingRequests);
    }
    if (error) {
      toast.error(getErrorMessage(error));
    }
  }, [data, error]);

  const handleMessagingRequest = async () => {
    try {
      const response = await updateMessagingRequestStatus(
        token as string,
        !allowConnectionsOnly
      );
      setAllowConnectionsOnly((prev) => !prev);
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setAllowConnectionsOnly((prev) => prev);
    }
  };

  return (
    <div className="flex justify-between items-center py-4 px-6 border-b border-[rgba(0,0,0,0.08)] last:border-b-0 transition-colors duration-200 ease-in-out hover:bg-[rgba(0,0,0,0.03)] dark:border-[rgba(255,255,255,0.12)] dark:hover:bg-[rgba(255,255,255,0.12)]  cursor-pointer">
      <h2 className="inline-flex flex-col gap-2">
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Manage Messaging Requests
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          By enabling this, only connections and premium members can send you a
          direct message.
        </span>
      </h2>

      <div className="flex items-center justify-center text-[#0891b2] dark:text-[#1d4ed8] w-8 h-8 rounded-full transition-colors duration-200 ease-in-out hover:bg-[rgba(8,145,178,0.08)] dark:hover:bg-[rgba(255,255,255,0.12)]">
        <Switch
          id="theme-toggler"
          name="themeToggler"
          checked={allowConnectionsOnly}
          onCheckedChange={handleMessagingRequest}
          className={`
                dark:data-[state=checked]:bg-blue-400 cursor-pointer data-[state=checked]:bg-blue-600
              `}
        />
      </div>
    </div>
  );
};

export default AllowMessagingToggler;
