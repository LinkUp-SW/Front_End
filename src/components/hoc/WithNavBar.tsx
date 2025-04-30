import { ComponentType } from "react";
import NavBar from "../nav_bar/NavBar";
import NavItems from "../nav_bar/NavItems";
import AuthMiddleware from "./AuthMiddleware";
import Cookies from "js-cookie";

// Define the HOC with proper types
const WithNavBar = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const userType = Cookies.get("linkup_user_type");
  return (props: P) => {
    return (
      <AuthMiddleware>
        {userType === "user" ? (
          <main className="relative">
            <div className="fixed w-full z-20">
              <NavBar />
            </div>
            <div className="w-full md:px-10 px-5 md:py-20 py-18 min-h-[100dvh]">
              <WrappedComponent {...props} />
            </div>
            <div className="lg:hidden z-20 sticky bottom-0">
              <NavItems />
            </div>
          </main>
        ) : null}
      </AuthMiddleware>
    );
  };
};

export default WithNavBar;
