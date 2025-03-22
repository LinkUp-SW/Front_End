import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons from react-icons
import ThemeToggle from "../../../components/theme_toggle/ThemeToggle";
import linkUpLogo from "../../../assets/link_up.png";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Link } from "react-router-dom";

const LandingNavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const width = useSelector((state: RootState) => state.screen.width);

  return (
    <nav className="w-full flex justify-between items-center p-4 dark:bg-gray-900 dark:text-white">
      {/* Logo */}
      <img
        src={linkUpLogo}
        alt="Logo"
        className="w-32 object-fill pt-1 dark:invert"
      />

      {/* Desktop Navigation */}
      <div
        className={`${
          width >= 768 ? "flex" : "hidden"
        } space-x-4 items-center"`}
      >
        <Link
          id="login-now-link"
          to={"/signup"}
          className="text-gray-700 font-semibold cursor-pointer grid place-items-center px-5 py-1.5 hover:bg-gray-200 rounded-full transition-all duration-300 ease-in-out dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Join now
        </Link>
        <Link
          to={"/login"}
          id="join-now-link"
          className="border border-blue-600 font-semibold cursor-pointer text-blue-600 px-4 py-2 rounded-full hover:text-blue-700 hover:bg-blue-100 transition-all duration-300 ease-in-out dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-500/20"
        >
          Sign in
        </Link>
        <ThemeToggle />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700 dark:text-gray-300"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Navigation Menu */}
      <div
        className={`
          fixed top-18 right-4 bg-gray-100 h-fit w-fit rounded-xl md:hidden dark:bg-gray-800
          transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-100"}
        `}
      >
        <div className="m-4 p-4 flex flex-col space-y-3 items-center">
          <ThemeToggle />
          <Link
            id="join-now-link"
            to={"/signup"}
            className="w-full text-gray-700 font-semibold cursor-pointer px-5 py-1.5 hover:bg-gray-200 rounded-full transition-all duration-300 ease-in-out dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Join now
          </Link>
          <Link
            to={"/login"}
            id="login-now-link"
            className="w-full border text-center border-blue-600 font-semibold cursor-pointer text-blue-600 px-4 py-2 rounded-full hover:text-blue-700 hover:bg-blue-100 transition-all duration-300 ease-in-out dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-500/20"
          >
            Sign in
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavBar;
