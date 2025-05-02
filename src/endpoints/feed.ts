import axiosInstance from "@/services/axiosInstance";
import { CommentDBType, CommentType, PostDBObject, PostType } from "@/types";
import axios from "axios";

// Add this new interface for link preview data
export interface LinkPreviewData {
  title: string;
  description: string;
  image: string | null;
  favicon: string | null;
  domain: string;
}

// Add the new fetch link preview function
export const fetchLinkPreview = async (
  url: string
): Promise<LinkPreviewData> => {
  try {
    // Extract domain for basic information
    const domain = new URL(url).hostname.replace("www.", "");

    // Initialize with basic data based on domain
    let previewData: LinkPreviewData = {
      title: domain,
      description: "",
      image: null,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      domain: domain,
    };

    // Handle special cases for common sites with predictable metadata
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = extractYoutubeId(url);
      if (videoId) {
        previewData = {
          ...previewData,
          title: "YouTube Video",
          description: "Watch this video on YouTube",
          image: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        };
      }
    } else if (url.includes("twitter.com") || url.includes("x.com")) {
      previewData = {
        ...previewData,
        title: "Twitter Post",
        description: "View this post on Twitter/X",
        image:
          "https://abs.twimg.com/responsive-web/web/icon-default.604e2486a34a2f6e.png",
      };
    } else if (url.includes("github.com")) {
      previewData = {
        ...previewData,
        title: "GitHub Repository",
        description: "View this repository on GitHub",
        image:
          "https://github.githubassets.com/assets/github-logo-55c5b9a1fe28.png",
      };
    } else if (url.includes("linkedin.com")) {
      previewData = {
        ...previewData,
        title: "LinkedIn",
        description: "View this profile or post on LinkedIn",
        image: "https://static.licdn.com/sc/h/5bukxbhy9xsil5mb7c2wulfbx",
      };
    } else if (url.includes("instagram.com")) {
      previewData = {
        ...previewData,
        title: "Instagram Post",
        description: "View this post on Instagram",
        image:
          "https://www.instagram.com/static/images/ico/favicon-200.png/ab6eff595bb1.png",
      };
    } else {
      // For other domains, try to fetch better data using a CORS proxy or OpenGraph API
      try {
        // Option 1: Use an open API service like Microlink (has free tier with limitations)
        const response = await axios.get(
          `https://api.microlink.io/?url=${encodeURIComponent(url)}`
        );
        if (response.data?.data) {
          const data = response.data.data;
          previewData = {
            title: data.title || previewData.title,
            description: data.description || previewData.description,
            image: data.image?.url || previewData.image,
            favicon: data.logo?.url || previewData.favicon,
            domain: previewData.domain,
          };
        }
      } catch (proxyError) {
        console.log("Could not fetch enhanced metadata:", proxyError);
        // Continue with basic preview data
      }
    }

    return previewData;
  } catch (error) {
    console.log("Error creating link preview:", error);

    // Return basic fallback for invalid URLs
    return {
      title: url,
      description: "",
      image: null,
      favicon: null,
      domain: "unknown",
    };
  }
};

// Helper function to extract YouTube video ID
function extractYoutubeId(url: string): string | null {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7]?.length === 11 ? match[7] : null;
}

export const getPostsFeed = async (
  token: string,
  postPayload: {
    cursor: number;
    limit: number;
    replyLimit?: number | 3;
  }
): Promise<{ posts: PostType[]; next_cursor: number | null }> => {
  const response = await axiosInstance.get(`/api/v2/post/posts/feed`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: postPayload,
  });
  console.log("GetPostsFeed:", response.data);

  // Filter out null posts and transform the rest
  const validPosts = (response.data.posts || []).filter(
    (post: PostType) => post !== null
  );

  const transformedPosts = validPosts.map((post: PostType) => ({
    ...post,
    comments_data: {
      comments: [], // Empty initially
      count: post.comments_count || 0,
      next_cursor: 0,
      isLoading: false,
      hasInitiallyLoaded: false,
    },
  }));

  console.log("Returned:", {
    posts: transformedPosts,
    next_cursor: response.data.next_cursor,
  });

  return {
    posts: transformedPosts.map((post: PostType) => ({
      ...post,
      author: {
        ...post.author,
        connection_degree: "1st",
      },
    })),
    next_cursor: response.data.next_cursor,
  };
};

export const fetchSinglePost = async (
  postId: string,
  token: string
): Promise<PostType> => {
  try {
    const response = await axiosInstance.get(`api/v2/post/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 5,
        replyLimit: 2,
      },
    });
    console.log("FetchSinglePost response:", response.data);

    // Extract comments from the response
    const commentsArray = response.data.comments?.comments;
    const comments_count = response.data.comments?.count || 0;
    const commentsCursor = response.data.comments?.next_cursor || null;

    // Return post with embedded comments
    console.log("Here:", {
      ...response.data.post,
      author: {
        ...response.data.post.author,
        connection_degree: "1st",
      },
      comments_data: {
        comments: commentsArray, // Include comments from API response
        count: comments_count,
        next_cursor: commentsCursor,
        isLoading: false,
        hasInitiallyLoaded: true, // Mark as initially loaded since we have comments
      },
    });
    return {
      ...response.data.post,
      author: {
        ...response.data.post.author,
        connection_degree: "1st",
      },
      comments_data: {
        comments: commentsArray, // Include comments from API response
        count: comments_count,
        next_cursor: commentsCursor,
        isLoading: false,
        hasInitiallyLoaded: true, // Mark as initially loaded since we have comments
      },
    };
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

// New function to load comments for a post on demand
export const loadPostComments = async (
  postId: string,
  token: string,
  cursor: number = 0,
  limit: number = 5
): Promise<{
  comments: CommentType[];
  count: number;
  next_cursor: number | null;
}> => {
  const response = await axiosInstance.get(`api/v2/post/comment/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      cursor: cursor,
      limit: limit,
      replyLimit: 2, // Get a few replies for each comment
    },
  });
  console.log("API response:", response);

  return {
    comments: Object.values(response.data.comments),
    count: response.data.count,
    next_cursor: response.data.next_cursor,
  };
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

export const getPostReactions = async (): Promise<string[]> => {
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
  const response = await axiosInstance.delete(`api/v2/post/posts/${postId}`, {
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
    `api/v2/post/comment/${postPayload.post_id}/${postPayload.comment_id}`,
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
  console.log("Payload:", postPayload);
  const response = await axiosInstance.patch(
    `api/v2/post/comment/${postPayload.post_id}/${postPayload.comment_id}`,
    postPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: postPayload,
    }
  );
  return response.data;
};

export const createPost = async (postPayload: PostDBObject, token: string) => {
  const response = await axiosInstance.post("api/v2/post/posts", postPayload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const editPost = async (postPayload: PostDBObject, token: string) => {
  const response = await axiosInstance.patch(
    `api/v2/post/posts/${postPayload._id}`,
    postPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const createComment = async (
  postPayload: CommentDBType,
  token: string
) => {
  const response = await axiosInstance.post(
    `api/v2/post/comment/${postPayload.post_id}`,
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
  postPayload: {
    cursor: number | null;
    limit: number;
    specificReaction: string | null;
    targetType: string;
    commentId: string | null;
  },
  postId: string,
  token: string
) => {
  const response = await axiosInstance.get(`api/v2/post/reaction/${postId}`, {
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
  postPayload: { target_type: string; comment_id?: string },
  postId: string,
  token: string,
  commentId?: string | null
) => {
  const response = await axiosInstance.delete(
    !commentId
      ? `api/v2/post/reaction/${postId}/`
      : `api/v2/post/reaction/${postId}/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: postPayload,
    }
  );

  return response.data;
};

export const getCommentsForPost = async (
  postPayload: {
    cursor: number;
    limit: number;
    replyLimit: number;
  },
  postId: string,
  token: string
) => {
  const response = await axiosInstance.get(`api/v2/post/comment/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      cursor: postPayload.cursor,
      limit: postPayload.limit,
      replyLimit: postPayload.replyLimit,
    },
  });

  return response.data;
};

export const getReplies = async (
  postPayload: {
    cursor: number;
    limit: number;
    replyLimit: number;
  },
  postId: string,
  commentId: string,
  token: string
) => {
  const response = await axiosInstance.get(
    `api/v2/post/comment/${postId}/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        cursor: postPayload.cursor,
        limit: postPayload.limit,
        replyLimit: postPayload.replyLimit,
      },
    }
  );

  return response.data;
};

export const createReaction = async (
  postPayload: { reaction: string; target_type: string },
  postId: string,
  token: string
) => {
  const response = await axiosInstance.post(
    `api/v2/post/reaction/${postId}`,
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
    `api/v2/post/save-post`,
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
  const response = await axiosInstance.delete(`api/v2/post/save-post`, {
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
  const response = await axiosInstance.get(`api/v2/post/save-post`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: postPayload, // Use params instead of data for GET requests
  });

  return response.data;
};

export const reportContent = async (
  postPayload: { contentRef: string; contentType: string; reason: string },
  token: string
): Promise<{ message: string; report: string }> => {
  try {
    const response = await axiosInstance.post(
      `api/v1/admin/report`,
      postPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      return { message: "You already reported this before.", report: "" };
    }
    // Re-throw other errors
    throw error;
  }
};

export const repostInstant = async (
  postPayload: { mediaType: string; media: string[]; postType: string },
  token: string
): Promise<{ message: string; report: string }> => {
  try {
    const response = await axiosInstance.post(
      `api/v2/post/posts`,
      postPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const repostWithThoughts = async (
  postPayload: {
    content: string;
    comments_disabled: string;
    public_post: boolean;
    mediaType: string;
    media: string[];
    postType: string;
  },
  token: string
): Promise<{ message: string; report: string }> => {
  try {
    const response = await axiosInstance.post(
      `api/v2/post/posts`,
      postPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCompanyPosts = async (
  token: string,
  organization_id: string,

  postPayload?: {
    cursor: number;
    limit: number;
    replyLimit?: number | 3;
  }
): Promise<{ posts: PostType[]; next_cursor: number | null }> => {
  const response = await axiosInstance.get(
    `api/v1/company/1get-posts-from-company/${organization_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: postPayload,
    }
  );
  console.log("GetCompanyPosts:", response.data);

  // Filter out null posts and transform the rest
  const validPosts = (response.data.posts || []).filter(
    (post: PostType) => post !== null
  );

  const transformedPosts = validPosts.map((post: PostType) => ({
    ...post,
    comments_data: {
      comments: [], // Empty initially
      count: post.comments_count || 0,
      next_cursor: 0,
      isLoading: false,
      hasInitiallyLoaded: false,
    },
  }));

  console.log("Returned:", {
    posts: transformedPosts,
    next_cursor: response.data.next_cursor,
  });

  return {
    posts: transformedPosts.map((post: PostType) => ({
      ...post,
      author: {
        ...post.author,
        connection_degree: "1st",
      },
    })),
    next_cursor: response.data.next_cursor,
  };
};

export const createCompanyPost = async (
  postPayload: PostDBObject,
  organization_id: string,
  token: string
) => {
  const response = await axiosInstance.post(
    `api/v1/company/create-post-from-company/${organization_id}`,
    postPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
