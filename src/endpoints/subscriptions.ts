import axiosInstance from "@/services/axiosInstance";

export const initiateSubscriptionSession = async (token: string) => {
  const response = await axiosInstance.post(
    `/api/v1/user/subscription/checkout`,
    {
      platform: "web",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
