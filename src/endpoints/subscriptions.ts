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

export const getSubscriptionInvoices = async (token: string) => {
  const response = await axiosInstance.get(
    `/api/v1/user/subscription/invoices`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const cancelSubscription = async (token: string) => {
  const response = await axiosInstance.post(
    `/api/v1/user/subscription/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
