import axiosInstance from "@/services/axiosInstance";

export interface Following {
  user_id: string;
  name: string;
  headline: string;
  profilePicture: string;
}
export interface FollowingResponse {
  following: Following[];
  nextCursor: string;
}

export interface Followers {
  user_id: string;
  name: string;
  headline: string;
  profilePicture: string;
  following: boolean;
}

export interface FollowersResponse {
  followers: Followers[];
  nextCursor: string;
}

export interface Connection {
  user_id: string;
  name: string;
  headline: string;
  profilePicture: string;
  date: Date;
}

export interface ConnectionResponse {
  connections: Connection[];
  nextCursor: string;
}

export interface ConnectionsNumber {
  user_id: string;
  number_of_connections: number;
}

export interface ReceivedConnections {
  user_id: string;
  name: string;
  headline: string;
  profilePicture: string;
  numberOfMutualConnections: number;
  nameOfOneMutualConnection: string;
  date: Date;
}

export interface ReceivedConnectionsResponse {
  receivedConnections: ReceivedConnections[];
  numberOfReceivedConnections: number;
  nextCursor: string;
}

export interface SentConnections {
  user_id: string;
  name: string;
  headline: string;
  profilePicture: string;
  date: Date;
}

export interface SentConnectionsResponse {
  sentConnections: SentConnections[];
  nextCursor: string;
}

export const fetchConnections = async (
  token: string,
  userId: string,
  cursor: string | null,
  limit: number
): Promise<ConnectionResponse> => {
  const response = await axiosInstance.get(
    `/api/v1/user/my-network/invite-connect/connections/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { cursor, limit },
    }
  );
  console.log("Connections response:", response.data);
  return response.data;
};

export const removeConnections = async (
  token: string,
  userId: string
): Promise<void> => {
  // Call the API with the dynamic userId in the URL
  const response = await axiosInstance.delete(
    `/api/v1/user/my-network/connections/remove/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("Remove connection response:", response.data);
  return response.data;
};

export const fetchFollowers = async (
  token: string,
  cursor: string | null,
  limit: number
): Promise<FollowersResponse> => {
  const response = await axiosInstance.get(
    "/api/v1/user/my-network/network-manager/followers",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { cursor, limit },
    }
  );
  console.log("Followers response:", response.data);
  return response.data;
};

export const fetchFollowing = async (
  token: string,
  cursor: string | null,
  limit: number
): Promise<FollowingResponse> => {
  const response = await axiosInstance.get(
    "/api/v1/user/my-network/network-manager/following",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { cursor, limit },
    }
  );
  console.log("Following response:", response.data);
  return response.data;
};

export const fetchConnectionsNumber = async (
  token: string
): Promise<ConnectionsNumber> => {
  const response = await axiosInstance.get(
    "/api/v1/user/my-network/connections/count",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("Connections number response:", response.data);
  return response.data;
};

export const fetchRecievedConnections = async (
  token: string,
  cursor: string | null,
  limit: number
): Promise<ReceivedConnectionsResponse> => {
  const response = await axiosInstance.get(
    "/api/v1/user/my-network/invitation-manager/received",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { cursor, limit }
    }
  );
  return response.data;
};

export const fetchSentConnections = async (
  token: string,
  cursor: string | null,
  limit: number
): Promise<SentConnectionsResponse> => {
  const response = await axiosInstance.get(
    "/api/v1/user/my-network/invitation-manager/sent",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { cursor, limit }
    }
  );
  return response.data;
};

export const unfollowUser = async (
  token: string,
  userId: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(
    `/api/v1/user/unfollow/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const followUser = async (
  token: string,
  userId: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.post(
    `/api/v1/user/follow/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const acceptInvitation = async (
  token: string,
  userId: string
): Promise<{message:string}> => {
  const response = await axiosInstance.post(
    `/api/v1/user/accept/${userId}`,
    {}, // Empty body if no additional data is required
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
export const ignoreInvitation = async (
  token: string,
  userId: string
): Promise<void> => {
  const response = await axiosInstance.delete(
    `/api/v1/user/my-network/invitation-manager/ignore/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        userId: userId,
      },
    }
  );
  return response.data;
};

export const withdrawInvitation = async (
  token: string,
  userId: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(
    `/api/v1/user/my-network/invitation-manager/withdraw/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const connectWithUser = async (
  token: string,
  userId: string,
  email: string
) => {
  const response = await axiosInstance.post(
    `/api/v1/user/connect/${userId}`,
    {
      email: email,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const removeUserFromConnection = async (
  token: string,
  userId: string
) => {
  const response = await axiosInstance.delete(
    `/api/v1/user/my-network/connections/remove/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
