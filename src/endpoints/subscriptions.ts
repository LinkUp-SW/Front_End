import axiosInstance from "@/services/axiosInstance";
import { Subscription } from "@/types";

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

export const getSubscriptionStatus = async (
  token: string
): Promise<{ subscription: Subscription }> => {
  const response = await axiosInstance.get(`/api/v1/user/subscription/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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

export const resumeSubscription = async (token: string) => {
  const response = await axiosInstance.post(
    `/api/v1/user/subscription/resume`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
