import axiosInstance from "@/services/axiosInstance";
import { CommentDBType, CommentType, PostDBObject, PostType } from "@/types";
import axios from "axios";

export const getFeedPosts = async (): Promise<PostType[]> => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? "/api/posts"
        : "actual api endpoint"
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getPostComments = async (): Promise<CommentType[]> => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? "/api/postComments"
        : "actual api endpoint"
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSinglePost = async (postId: string): Promise<PostType> => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? `/api/posts/${postId}`
        : `actual api endpoint/${postId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSingleComments = async (
  postId: string
): Promise<CommentType[]> => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? `/api/postComments/${postId}`
        : `actual api endpoint/${postId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPostReactions = async (): Promise<any> => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? "/api/postReactions"
        : "actual api endpoint"
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deletePost = async (postId: string, token: string) => {
  const response = await axiosInstance.delete(`api/v1/post/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteComment = async (
  postPayload: { comment_id: string; post_id: string },
  token: string
) => {
  const response = await axiosInstance.delete(
    `api/v1/post/comment/${postPayload.post_id}/${postPayload.comment_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const editComment = async (
  postPayload: {
    post_id: string;
    comment_id: string;
    content: string;
    media: string;
    tagged_users: string[];
  },
  token: string
) => {
  const response = await axiosInstance.patch(`api/v1/post/comment`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: postPayload,
  });
  return response.data;
};

export const createPost = async (postPayload: PostDBObject, token: string) => {
  const response = await axiosInstance.post("api/v1/post/posts", postPayload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createComment = async (
  postPayload: CommentDBType,
  token: string
) => {
  const response = await axiosInstance.post(
    `api/v1/post/comment/${postPayload.post_id}`,
    postPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("HERE", response);

  return response.data;
};

export const getReactions = async (
  postPayload: any,
  postId: string,
  token: string
) => {
  const response = await axiosInstance.get(`api/v1/post/reaction/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      commentId: postPayload.commentId,
      cursor: postPayload.cursor,
      limit: postPayload.limit,
      targetType: postPayload.targetType,
      specificReaction: postPayload.specificReaction,
    },
  });

  return response.data;
};

export const deleteReaction = async (
  postPayload: any,
  postId: string,
  token: string
) => {
  const response = await axiosInstance.delete(
    `api/v1/post/reaction/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: postPayload,
    }
  );

  return response.data;
};

export const createReaction = async (
  postPayload: any,
  postId: string,
  token: string
) => {
  const response = await axiosInstance.post(
    `api/v1/post/reaction/${postId}`,
    postPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const savePost = async (postId: string, token: string) => {
  const response = await axiosInstance.post(
    `api/v1/post/save-post`,
    { postId: postId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const unsavePost = async (postId: string, token: string) => {
  const response = await axiosInstance.delete(`api/v1/post/save-post`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { postId: postId },
  });

  return response.data;
};

export const getSavedPosts = async (
  postPayload: {
    limit: number;
    cursor: number;
  },
  token: string
) => {
  const response = await axiosInstance.get(`api/v1/post/save-post`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: postPayload, // Use params instead of data for GET requests
  });

  return response.data;
};

export const fetchSinglePost = async (
  postId: string,
  token: string,
  cursor: number,
  limit: number
) => {
  try {
    const response = await axiosInstance.get(`api/v1/post/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        cursor: cursor,
        limit: limit,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
