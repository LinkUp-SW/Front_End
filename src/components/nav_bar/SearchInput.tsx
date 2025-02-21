import { ImSearch } from "react-icons/im";

const SearchInput = () => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <ImSearch />
      </div>
      <input
        type="search"
        id="default-search"
        placeholder="Search"
        className="block lg:w-fit w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default SearchInput;
