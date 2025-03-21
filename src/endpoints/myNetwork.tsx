import axios from "axios";

export interface FollowingFollowers {
  name: string;
  title: string;
  image: string;
}

export interface Connection {
  id: number;
  name: string;
  title: string;
  date: string;
  image: string;
}

export const fetchConnections = async (): Promise<Connection[]> => {
  try {
    const BASE_URL =
      import.meta.env.VITE_NODE_ENV !== "PROD"
        ? "/api/connections"
        : "actual-api-endpoint";

    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
      throw new Error(
        error.response?.statusText || "Failed to fetch connections"
      );
    }
    throw new Error("Unexpected error occurred");
  }
};

export const fetchFollowers = async (): Promise<FollowingFollowers[]> => {
  try {
    const BASE_URL =
      import.meta.env.VITE_NODE_ENV !== "PROD"
        ? "/api/followers"
        : "actual-api-endpoint-for-followers";

    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
      throw new Error(
        error.response?.statusText || "Failed to fetch followers"
      );
    }
    throw new Error("Unexpected error occurred");
  }
};

export const fetchFollowing = async (): Promise<FollowingFollowers[]> => {
  try {
    const BASE_URL =
      import.meta.env.VITE_NODE_ENV !== "PROD"
        ? "/api/following"
        : "actual-api-endpoint-for-following";

    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
      throw new Error(
        error.response?.statusText || "Failed to fetch following list"
      );
    }
    throw new Error("Unexpected error occurred");
  }
};