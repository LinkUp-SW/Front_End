import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons from react-icons
import ThemeToggle from "../../../components/theme_toggle/ThemeToggle";
import linkUpLogo from "../../../assets/link_up.png";

const LandingNavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full flex justify-between items-center p-4">
      {/* Logo */}
      <img src={linkUpLogo} alt="Logo" className="w-32 object-fill pt-1" />

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-4 items-center">
        <button className="text-gray-700 font-semibold cursor-pointer px-5 py-1.5 hover:bg-gray-200 rounded-full transition-all duration-300 ease-in-out">
          Join now
        </button>
        <button className="border border-blue-600 font-semibold cursor-pointer text-blue-600 px-4 py-2 rounded-full hover:text-blue-700 hover:bg-blue-100 transition-all duration-300 ease-in-out">
          Sign in
        </button>
        <ThemeToggle />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Navigation Menu */}
      <div
        className={`
          fixed top-18 right-4 bg-gray-100 h-fit w-fit rounded-xl md:hidden
          transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-100"}
        `}
      >
        <div className="m-4 p-4 flex flex-col space-y-3 items-center">
          <ThemeToggle />
          <button className="w-full text-gray-700 font-semibold cursor-pointer px-5 py-1.5 hover:bg-gray-200 rounded-full transition-all duration-300 ease-in-out">
            Join now
          </button>
          <button className="w-full border border-blue-600 font-semibold cursor-pointer text-blue-600 px-4 py-2 rounded-full hover:text-blue-700 hover:bg-blue-100 transition-all duration-300 ease-in-out">
            Sign in
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavBar;
