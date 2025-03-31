import { ComponentType } from "react";
import NavBar from "../nav_bar/NavBar";
import NavItems from "../nav_bar/NavItems";
import AuthMiddleware from "./AuthMiddleware";
import PhoneNumberBanner from "../phonenumber_banner/PhoneNumberBanner";

// Define the HOC with proper types
const WithNavBar = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return (props: P) => {
    return (
      <AuthMiddleware>
        <main className="relative">
          <div className="fixed w-full z-20">
            <NavBar />
          </div>
          <div className="w-full md:px-10 px-5 md:py-20 py-18 min-h-[100dvh]">
          <PhoneNumberBanner/>
            <WrappedComponent {...props} />
          </div>
          <div className="lg:hidden z-20 sticky bottom-0">
            <NavItems />
          </div>
        </main>
      </AuthMiddleware>
    );
  };
};

export default WithNavBar;
