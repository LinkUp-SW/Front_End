import { useDispatch } from "react-redux";
import { searchFiltering } from "../../slices/messaging/messagingSlice";
import { IoSearchSharp } from "react-icons/io5";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const Header = () => {
  const dispatch = useDispatch();
  return (
    <>
      <header className="flex items-center justify-between p-4 border-1 border-[#e8e8e8] ">
        <div className=" flex items-center space-x-4">
          <label htmlFor="searchMessages" className="font-semibold">
            Messaging
          </label>
          <div id="search" className="relative w-60">
            <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3b3d3e]" />
            <input
              type="text"
              id="searchMessages"
              name="searchMessages"
              placeholder="Search message"
              className="w-full pl-10 py-2 border border-gray-300 rounded-sm bg-[#edf3f8] text-sm hover:ring-1 focus:outline-none focus:ring-2 focus:ring-black"
              onChange={(e) => dispatch(searchFiltering(e.target.value))}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            id="header-dots"
            className="hover:rounded-full hover:bg-gray-200 hover:cursor-pointer"
          >
            <HiOutlineDotsHorizontal size={30} />
          </button>
          <button
            id="pencil-icon"
            className="hover:rounded-full hover:bg-gray-200 hover:cursor-pointer"
          >
            <HiOutlinePencilAlt size={30} />{" "}
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
