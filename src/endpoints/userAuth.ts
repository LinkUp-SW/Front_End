import { UserLoginResponse, UserStarterInterface } from "@/types";
import axios from "axios";

import axiosInstance from '@/services/axiosInstance';



export const signin = async (
  identifier: string,
  password: string
): Promise<UserLoginResponse> => {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/auth/login`,
    {
      email: identifier.toLowerCase(),
      password,
    },
    { withCredentials: true } // Ensure session cookie is sent
  );
  return response.data;
};

export const verifyEmail = async (email: string) => {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/user/verify-email`,
    { email }
  );

  return response.data;
};

export const createUserAccount = async (
  userCredentials: UserStarterInterface
): Promise<UserLoginResponse> => {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/user/signup/starter`,
    { ...userCredentials },
    { withCredentials: true } // Ensure session cookie is sent
  );
  return response.data;
};

export const sendOTP = async (email: string) => {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/user/send-otp`,
    { email: email },
    { withCredentials: true } // Ensure session cookie is sent
  );
  return response.data;
};

export const verifyOTP = async (otp: string, email: string) => {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/user/verify-otp`,
    { otp: otp, email: email },
    { withCredentials: true } // Ensure session cookie is sent
  );
  return response.data;
};

export const initiateGoogleAuth = () => {
  window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
};

export const initiateForgetPassword = async (email: string) => {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/user/forget-password`,
    {
      email,
    }
  );

  return response.data;
};

export const resetPassword = async (password: string, token: string) => {
  const response = await axios.patch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/user/reset-password`,
    {
      password: password,
      token: token,
    }
  );
  return response.data;
};



export const userLogOut=async()=>{
const response =await axiosInstance.get('/auth/logout');
return response.data
}