import SettingsLayoutPage from "@/components/hoc/SettingsLayoutPage";
import Cookies from "js-cookie";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { InvitationsStatusEnum } from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import useFetchData from "@/hooks/useFetchData";
import {
  getInvitationRequestStatus,
  updateInvitationRequestStatus,
} from "@/endpoints/settingsEndpoints";

const ConnectionRequest = () => {
  const token = Cookies.get("linkup_auth_token");
  const navigate = useNavigate();
  const [invitationStatus, setInvitationStatus] = useState(
    InvitationsStatusEnum.everyone
  ); // Initial status
  const { data, error } = useFetchData(
    async () =>
      token ? getInvitationRequestStatus(token) : Promise.resolve(null),
    []
  );

  useEffect(() => {
    if (data) {
      setInvitationStatus(data.invitationSetting);
    }
    if (error) {
      toast.error(getErrorMessage(error));
    }
  }, [data, error]);

  const handleStatusChange = async (status: InvitationsStatusEnum) => {
    try {
      const response = await updateInvitationRequestStatus(
        token as string,
        status
      );
      setInvitationStatus(status);
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setInvitationStatus((prev) => prev);
    }
    // Handle any additional logic or state updates based on the selected status
  };

  return (
    <SettingsLayoutPage>
      <div className="py-10 px-4">
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center mr-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex-grow">
              Connection Requests
            </h2>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Change the Connection Request Settings
            </h2>

            <div className="border p-4 rounded-lg border-gray-300 dark:border-gray-600">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                Who can send connection requests?
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="everyone"
                    name="invitationStatus"
                    value={InvitationsStatusEnum.everyone}
                    checked={
                      invitationStatus === InvitationsStatusEnum.everyone
                    }
                    onChange={() =>
                      handleStatusChange(InvitationsStatusEnum.everyone)
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="everyone"
                    className="text-sm cursor-pointer text-gray-900 dark:text-gray-100"
                  >
                    Everyone
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="email"
                    name="invitationStatus"
                    value={InvitationsStatusEnum.email}
                    checked={invitationStatus === InvitationsStatusEnum.email}
                    onChange={() =>
                      handleStatusChange(InvitationsStatusEnum.email)
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="email"
                    className="text-sm cursor-pointer text-gray-900 dark:text-gray-100"
                  >
                    Email
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default ConnectionRequest;
