import { useState, useEffect } from "react";
import { ImSearch } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getSearchSuggestions } from "@/endpoints/search"; // Adjust the path if needed
import type { SearchSuggestion } from "@/endpoints/search"; // Adjust the path if needed

const SearchInput = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const token = Cookies.get("linkup_auth_token");

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!token || !searchTerm) {
        setFilteredResults([]);
        return;
      }

      try {
        const response = await getSearchSuggestions(token, searchTerm);
        setFilteredResults(response.suggestions);
      } catch (error) {
        console.error("Failed to fetch search suggestions", error);
        setFilteredResults([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, token]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm) {
      navigate(`/search/${searchTerm}`);
      setFilteredResults([]);
    }
  };

  const navigateToUser = (user_id: string) => {
    return navigate(`/user-profile/${user_id}`);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <ImSearch className="text-gray-600 dark:text-gray-300" />
      </div>
      <input
        type="search"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="block w-full p-2 ps-10 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      />
      {open && filteredResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {filteredResults.map((result, index) => {
            switch (result.type) {
              case "user":
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                    onClick={() => navigateToUser(result.user_id)}
                  >
                    <img
                      src={result.profile_photo}
                      alt={result.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {result.name} <span className="text-sm text-gray-500">({result.connection_degree})</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{result.headline}</div>
                    </div>
                  </div>
                );

              case "organization":
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                  >
                    <img
                      src={result.logo}
                      alt={result.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{result.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{result.category_type}</div>
                    </div>
                  </div>
                );

              case "job":
                return (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{result.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Job</div>
                  </div>
                );

              case "industry":
                return (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{result.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400"> Industry</div>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      )}
    </div>
  );
};

export default SearchInput;