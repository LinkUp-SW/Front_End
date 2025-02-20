import LandingNavBar from "./landing_nav_bar/LandingNavBar";
import manOnChair from "../../assets/man_on_chair.svg";
import googleSvg from "../../assets/google.svg";
import microsoftSvg from "../../assets/microsoft.svg";
import { Link } from "react-router-dom";
const HomePage = () => {
  return (
    <main className="flex flex-col items-center w-full p-5">
      <header className="max-w-[70rem] w-full">
        <LandingNavBar />
      </header>
      <section className="grid md:grid-cols-2 gap-10 place-items-center px-10 md:py-0 py-10 grid-cols-1 w-full">
        <article className="flex flex-col items-center w-full">
          <div className="flex w-full max-w-xl flex-col items-center">
            <h1 className="mb-10 lg:text-left text-center text-[2rem] leading-[1.25] text-gray-700 lg:text-[3rem]">
              Welcome to your professional community
            </h1>

            {/* Auth Buttons */}
            <div className="flex w-full flex-col space-y-4">
              <button className="flex h-12 w-full items-center justify-center space-x-2 rounded-full cursor-pointer hover:opacity-85 transition-all duration-300 ease-in-out bg-blue-500 text-white py-3 px-6 text-base font-semibold">
                <i>
                  <img
                    src={googleSvg}
                    alt="Google Logo"
                    className="w-full h-full object-contain bg-white p-2 rounded-full"
                  />
                </i>
                <span>Continue with Google</span>
              </button>

              <button className="flex h-12 w-full items-center justify-center transition-all duration-300 ease-in-out cursor-pointer space-x-2 rounded-full border border-[#D1D5DB] bg-white py-3 px-6 text-base font-semibold text-[#000000E6] hover:bg-[#00000008]">
                <i>
                  <img
                    src={microsoftSvg}
                    alt="Microsoft Logo"
                    className="w-full h-full object-contain"
                  />
                </i>
                <span>Continue with Microsoft</span>
              </button>

              <button className="flex h-12 w-full items-center justify-center transition-all duration-300 ease-in-out cursor-pointer space-x-2 rounded-full border border-[#D1D5DB] bg-white py-3 px-6 text-base font-semibold text-[#000000E6] hover:bg-[#00000008]">
                Sign in with email
              </button>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center max-w-sm w-full text-xs text-[#00000099]">
              By clicking Continue to join or sign in, you agree to LinkedIn's{" "}
              <span className="underline text-[#0A66C2] font-semibold cursor-pointer">
                User Agreement
              </span>
              ,{" "}
              <span className="underline text-[#0A66C2] font-semibold cursor-pointer">
                Privacy Policy
              </span>
              , and{" "}
              <span className="underline text-[#0A66C2] font-semibold cursor-pointer">
                Cookie Policy
              </span>
              .
            </p>

            <p className="mt-8 text-center text-sm text-[#00000099]">
              New to LinkedIn?{" "}
              <Link to={"/"} className="font-semibold text-[#0A66C2] underline">
                Join now
              </Link>
            </p>
          </div>
        </article>

        <img
          src={manOnChair}
          alt="Welcome to your professional community"
          className="max-w-2xl w-full aspect-square object-contain"
        />
      </section>
    </main>
  );
};

export default HomePage;
