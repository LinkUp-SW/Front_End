import { useEffect, useState } from "react";
import { AccountStatusEnum } from "@/types";
import SettingsLayoutPage from "@/components/hoc/SettingsLayoutPage";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useFetchData from "@/hooks/useFetchData";
import Cookies from "js-cookie";
import {
  getProfileVisibilty,
  updateProfileVisibilty,
} from "@/endpoints/settingsEndpoints";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";

const ProfileVisibility = () => {
  const token = Cookies.get("linkup_auth_token");
  const navigate = useNavigate();
  const [profileStatus, setProfileStatus] = useState<AccountStatusEnum>(
    AccountStatusEnum.public
  ); // Initial status
  const { data, error } = useFetchData(
    async () => (token ? getProfileVisibilty(token) : Promise.resolve(null)),
    []
  );

  useEffect(() => {
    if (data) {
      setProfileStatus(data.profileVisibility);
    }
    if (error) {
      toast.error(getErrorMessage(error));
    }
  }, [data, error]);
  const handleStatusChange = async (status: AccountStatusEnum) => {
    try {
      const response = await updateProfileVisibilty(token as string, status);
      toast.success(response.message);
      setProfileStatus(status);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setProfileStatus((prev) => prev);
    }
    // You can add any logic here based on the selected status
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
              Profile Visibility
            </h2>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Set Profile Visibility
            </h2>

            <div className="border p-4 rounded-lg border-gray-300 dark:border-gray-600">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                Who can see your profile?
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="public"
                    name="profileStatus"
                    value={AccountStatusEnum.public}
                    checked={profileStatus === AccountStatusEnum.public}
                    onChange={() =>
                      handleStatusChange(AccountStatusEnum.public)
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="public"
                    className="text-sm cursor-pointer text-gray-900 dark:text-gray-100"
                  >
                    Public
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="connections"
                    name="profileStatus"
                    value={AccountStatusEnum.connections}
                    checked={profileStatus === AccountStatusEnum.connections}
                    onChange={() =>
                      handleStatusChange(AccountStatusEnum.connections)
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="connections"
                    className="text-sm cursor-pointer text-gray-900 dark:text-gray-100"
                  >
                    Connections only
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

export default ProfileVisibility;
