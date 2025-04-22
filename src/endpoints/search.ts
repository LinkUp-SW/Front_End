import axiosInstance from "@/services/axiosInstance";


// User suggestion type
interface UserSuggestion {
    type: 'user';
    user_id: string;
    name: string;
    headline: string;
    profile_photo: string;
    connection_degree: string;
    industry: string;
  }
  
  // Organization suggestion type
  interface OrganizationSuggestion {
    type: 'organization';
    _id: string;
    name: string;
    category_type: string;
    logo: string;
    industry: string;
  }
  
  // Job suggestion type
  interface JobSuggestion {
    type: 'job';
    _id: string;
    title: string;
    location: string;
    industry: string;
    is_job: true;
  }
  
  // Industry suggestion type
  interface IndustrySuggestion {
    type: 'industry';
    id: string;
    name: string;
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
  
export const getSearchSuggestions= async (
  token: string,
  query: string,
): Promise<SearchSuggestionsResponse> => {
  const response = await axiosInstance.get(
    "/api/v1/search/suggestions",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { query },
    }
  );
  return response.data;
}