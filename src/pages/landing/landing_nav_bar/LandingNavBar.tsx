const LandingNavBar = () => {
  return (
    <nav className="w-full flex justify-between items-center">
      <img src="" alt="Logo" />
      <div className="flex space-x-4">
        {/* Join now */}
        <button className="text-gray-700  font-semibold cursor-pointer  px-5 py-1.5 hover:bg-gray-200 rounded-full transition-all duration-300 ease-in-out">Join now</button>

        {/* Sign in */}
        <button className="border border-blue-600 font-semibold cursor-pointer  text-blue-600 px-4 py-2 rounded-full hover:text-blue-700 hover:bg-blue-100  transition-all duration-300 ease-in-out ">
          Sign in
        </button>
      </div>
    </nav>
  );
};

export default LandingNavBar;
