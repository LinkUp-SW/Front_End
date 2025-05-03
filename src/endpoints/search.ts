import axiosInstance from "@/services/axiosInstance";

// User suggestion type
interface UserSuggestion {
  type: "user";
  user_id: string;
  name: string;
  headline: string;
  profile_photo: string;
  connection_degree: string;
  industry: string;
}

// Organization suggestion type
interface OrganizationSuggestion {
  type: "organization";
  _id: string;
  name: string;
  category_type: string;
  logo: string;
  industry: string;
}

// Job suggestion type
interface JobSuggestion {
  type: "job";
  _id: string;
  title: string;
  location: string;
  industry: string;
  is_job: true;
}

// Industry suggestion type
interface IndustrySuggestion {
  type: "industry";
  id: string;
  name: string;
}

export interface UserTagResult {
  user_id: string;
  name: string;
  profile_photo: string;
  headline: string;
  connection_degree: string;
  is_in_received_connections: boolean;
  is_in_sent_connections: boolean;
  location: string;
  mutual_connections: {
    count: number;
    suggested_name: string;
    suggested_profile_photo: string;
  };
}

export interface UserSearchResponse {
  people: UserTagResult[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Union type for all suggestions
export type SearchSuggestion =
  | UserSuggestion
  | OrganizationSuggestion
  | JobSuggestion
  | IndustrySuggestion;

// Response interface
export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
}

export const getSearchSuggestions = async (
  token: string,
  query: string
): Promise<SearchSuggestionsResponse> => {
  const response = await axiosInstance.get("/api/v1/search/suggestions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { query },
  });
  return response.data;
};

export const searchUsersForTag = async (
  token: string,
  query: string,
  limit: number = 5
): Promise<UserSearchResponse> => {
  try {
    const response = await axiosInstance.get("/api/v1/search/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        query,
        limit,
        page: 1,
      },
    });

    // Add this logging to see the exact structure

    return response.data;
  } catch (error) {
    console.error("Error searching users for tagging:", error);
    return {
      people: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 0,
        pages: 0,
      },
    };
  }
};
