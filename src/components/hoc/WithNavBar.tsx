import { ComponentType } from "react";
import NavBar from "../nav_bar/NavBar";
import NavItems from "../nav_bar/NavItems";

// Define the HOC with proper types
const WithNavBar = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return (props: P) => {
    return (
      <main className="relative">
        <div className="fixed w-full z-10">
          <NavBar />
        </div>
        <div className="w-full md:px-10 px-5 md:py-20 py-18 min-h-[100dvh]">
          <WrappedComponent {...props} />
        </div>
        <div className="lg:hidden z-10 sticky bottom-1">
          <NavItems />
        </div>
      </main>
    );
  };
};

export default WithNavBar;
