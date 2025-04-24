// src/components/SearchInput.tsx
import { useState, useEffect } from "react";
import { ImSearch } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getSearchSuggestions } from "@/endpoints/search";
import type { SearchSuggestion } from "@/endpoints/search";

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

    const debounce = setTimeout(fetchSuggestions, 100);
    return () => clearTimeout(debounce);
  }, [searchTerm, token]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setFilteredResults([]);
      setOpen(false);
    }
  };

  const navigateToUser = (user_id: string) => {
    navigate(`/user-profile/${user_id}`);
    setSearchTerm("");
    setFilteredResults([]);
    setOpen(false);
  };

  return (
    <div className="relative w-full lg:max-w-[600px] xl:max-w-[700px]">
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
        className="block w-full p-3 ps-10 text-base text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      />
      {open && filteredResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {filteredResults.map((result, index) => {
            switch (result.type) {
              case "user":
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                    onClick={() => navigateToUser(result.user_id)}
                  >
                    {result.profile_photo ? (
                      <img
                        src={result.profile_photo}
                        alt={result.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <ImSearch className="text-gray-500 dark:text-gray-400 text-xl" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {result.name}{" "}
                        <span className="text-sm text-gray-500">
                          ({result.connection_degree})
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {result.headline}
                      </div>
                    </div>
                  </div>
                );

              case "organization":
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                  >
                    {result.logo ? (
                      <img
                        src={result.logo}
                        alt={result.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <ImSearch className="text-gray-500 dark:text-gray-400 text-xl" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {result.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {result.category_type}
                      </div>
                    </div>
                  </div>
                );

              case "job":
                return (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <ImSearch className="text-gray-500 dark:text-gray-400 text-lg" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {result.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Job
                        </div>
                      </div>
                    </div>
                  </div>
                );

              case "industry":
                return (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <ImSearch className="text-gray-500 dark:text-gray-400 text-lg" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {result.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Industry
                        </div>
                      </div>
                    </div>
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