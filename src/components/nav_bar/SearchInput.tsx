import { useState } from "react";
import { ImSearch } from "react-icons/im";
import { useNavigate } from "react-router-dom";

const sampleData: { name: string; industry: string }[] = [
  { name: "Nada Salem", industry: "Front end" },
  { name: "Nada Khaled", industry: "Front end" },
  { name: "Nada Zayed", industry: "Backend" },
];

const SearchInput = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<{ name: string; industry: string }[]>([]);
  const [open, setOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    
    if (query) {
      const results = sampleData.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.industry.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm) {
      navigate(`/search/${searchTerm}`);
      setFilteredResults([]);
    }
  };

  return (
    <div className="relative w-full">
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
        className="block lg:w-[350px] w-full p-2 ps-10 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {open && filteredResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4">
          {filteredResults.map((result, index) => (
            <div key={index} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              {result.name} - {result.industry}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
