import { useState } from "react";
import { ImSearch } from "react-icons/im";

const SearchInput = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <ImSearch className="text-gray-600 dark:text-gray-300" />
      </div>
      <input
        type="search"
        id="default-search"
        placeholder="Search"
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)} // Add slight delay to allow clicks inside dropdown
        className="block lg:w-[350px] w-full p-2 ps-10 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 outline-none focus:ring-blue-500 focus:border-blue-500"
      />

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Recent
          </h4>
          <div className="flex gap-4 overflow-x-auto mb-4">
            {[
              { name: "James Carter", avatar: "https://placehold.co/40" },
              { name: "Olivia Bennett", avatar: "https://placehold.co/40" },
              { name: "Grace Morgan", avatar: "https://placehold.co/40" },
              { name: "Lily Adams", avatar: "https://placehold.co/40" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-sm">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-xs mt-1 truncate w-16 text-center">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          <ul className="space-y-2">
            {["Emma Wilson", "Charlotte Evans", "Chloe Parker"].map(
              (search, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md"
                >
                  <span className="text-sm">{search}</span>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
