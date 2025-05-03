import { Switch } from "@/components";
import {
  getFollowPrimaryStatus,
  toggleFollowPrimary,
} from "@/endpoints/settingsEndpoints";
import useFetchData from "@/hooks/useFetchData";
import { getErrorMessage } from "@/utils/errorHandler";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FollowPrimaryToggler = () => {
  const token = Cookies.get("linkup_auth_token");
  const [isFollowPrimary, setIsFollowPrimary] = useState(false);
  const { data, error } = useFetchData(
    async () => (token ? getFollowPrimaryStatus(token) : Promise.resolve(null)),
    []
  );
  useEffect(() => {
    if (data) {
      setIsFollowPrimary(data.isFollowPrimary);
    }
    if (error) {
      toast.error(getErrorMessage(error));
    }
  }, [data, error]);

  const handleFollowPrimaryToggle = async () => {
    try {
      const response = await toggleFollowPrimary(
        token as string,
        !isFollowPrimary
      );
      setIsFollowPrimary((prev) => !prev);
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setIsFollowPrimary((prev) => prev);
    }
  };

  return (
    <div className="flex justify-between items-center py-4 px-6 border-b border-[rgba(0,0,0,0.08)] last:border-b-0 transition-colors duration-200 ease-in-out hover:bg-[rgba(0,0,0,0.03)] dark:border-[rgba(255,255,255,0.12)] dark:hover:bg-[rgba(255,255,255,0.12)]  cursor-pointer">
      <span className="text-base text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)]">
        Follow Primary
      </span>
      <div className="flex items-center justify-center text-[#0891b2] dark:text-[#1d4ed8] w-8 h-8 rounded-full transition-colors duration-200 ease-in-out hover:bg-[rgba(8,145,178,0.08)] dark:hover:bg-[rgba(255,255,255,0.12)]">
        <Switch
          id="theme-toggler"
          name="themeToggler"
          checked={isFollowPrimary}
          onCheckedChange={handleFollowPrimaryToggle}
          className={`
                dark:data-[state=checked]:bg-blue-400 cursor-pointer data-[state=checked]:bg-blue-600
              `}
        />
      </div>
    </div>
  );
};

export default FollowPrimaryToggler;
