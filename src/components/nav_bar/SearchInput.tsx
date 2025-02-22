import { ImSearch } from "react-icons/im";

const SearchInput = () => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <ImSearch className="text-gray-600 dark:text-gray-300" />
      </div>
      <input
        type="search"
        id="default-search"
        placeholder="Search"
        className="block lg:w-fit w-full p-2 ps-10 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default SearchInput;
