import { UserStarterInterface } from "@/types";
import axios from "axios";

export const signin = async (identifier: string, password: string) => {
  const response = await axios.post("http://localhost:3000/auth/login", {
    email: identifier,
    password,
  });
  return response.data;
};

export const verifyEmail = async (email: string) => {
  const response = await axios.post(
    "http://localhost:3000/api/v1/user/verify-email",
    { email }
  );

  return response.data;
};

export const createUserAccount = async (
  userCredentials: UserStarterInterface
) => {
  const response = await axios.post(
    "http://localhost:3000/api/v1/user/signup/starter",
    { ...userCredentials }
  );
  return response.data;
};

export const sendOTP = async (email: string) => {
  const response = await axios.post(
    "http://localhost:3000/api/v1/user/send-otp",
    { email: email }
  );
  return response.data;
};

export const verifyOTP = async (otp: string) => {
  const response = await axios.post(
    "http://localhost:3000/api/v1/user/verify-otp",
    { otp: otp }
  );
  return response.data;
};

export const initiateGoogleAuth = () => {
  window.location.href = "http://localhost:3000/auth/google";
};