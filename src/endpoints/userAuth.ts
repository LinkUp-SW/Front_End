import { UserLoginResponse, UserStarterInterface } from "@/types";
import axiosInstance from "@/services/axiosInstance";

export const signin = async (
  identifier: string,
  password: string
): Promise<UserLoginResponse> => {
  const response = await axiosInstance.post("/auth/login", {
    email: identifier.toLowerCase(),
    password,
  });
  return response.data;
};

export const verifyEmail = async (email: string) => {
  const response = await axiosInstance.post("/api/v1/user/verify-email", {
    email,
  });
  return response.data;
};

export const createUserAccount = async (
  userCredentials: UserStarterInterface
): Promise<UserLoginResponse> => {
  const response = await axiosInstance.post(
    "/api/v1/user/signup/starter",
    userCredentials
  );
  return response.data;
};

export const sendOTP = async (email: string) => {
  const response = await axiosInstance.post("/api/v1/user/send-otp", { email });
  return response.data;
};

export const verifyOTP = async (otp: string, email: string) => {
  const response = await axiosInstance.post("/api/v1/user/verify-otp", {
    otp,
    email,
  });
  return response.data;
};

export const initiateGoogleAuth = () => {
  window.location.href = `${axiosInstance.defaults.baseURL}/auth/google`;
};

export const initiateForgetPassword = async (email: string) => {
  const response = await axiosInstance.post("/api/v1/user/forget-password", {
    email,
  });
  return response.data;
};

export const resetPassword = async (password: string, token: string) => {
  const response = await axiosInstance.patch("/api/v1/user/reset-password", {
    password,
    token,
  });
  return response.data;
};

export const userLogOut = async () => {
  const response = await axiosInstance.get("/auth/logout");
  return response.data;
};

export const validateAuthToken = async (): Promise<{ isValid: boolean }> => {
  const response = await axiosInstance.get("/validate-token");
  return response.data;
};
