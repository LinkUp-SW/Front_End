import React, { useEffect, useState, FC } from "react";
import linkUpLogo from "@/assets/link_up.png";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { userLogOut, validateAuthToken } from "@/endpoints/userAuth";
import LinkUpLoader from "../linkup_loader/LinkUpLoader";

const UserAuthLayout = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): FC<P> => {
  // Return a proper functional component that uses hooks
  return function WrapperComponent(props: P) {
    const navigate = useNavigate();
    const [authCheckCompleted, setAuthCheckCompleted] = useState(false);
    const token = Cookies.get("linkup_auth_token");
    const myUserId = Cookies.get("linkup_user_id");
    const userType = Cookies.get("linkup_user_type");

    useEffect(() => {
      let isMounted = true;
      const controller = new AbortController();

      const checkAuth = async () => {
        try {
          if (!token || !myUserId) {
            if (isMounted) setAuthCheckCompleted(true);
            return;
          }

          const response = await validateAuthToken(token, {
            signal: controller.signal,
          });

          if (isMounted) {
            if (response.success && myUserId && userType) {
              if (userType.toLocaleLowerCase() === "admin") {
                navigate("/admin-page/dashboard", { replace: true });
              } else {
                navigate("/feed", { replace: true });
              }
            } else {
              Cookies.remove("linkup_auth_token");
              Cookies.remove("linkup_user_id");
              Cookies.remove("linkup_user_type");
              await userLogOut();
              setAuthCheckCompleted(true);
            }
          }
        } catch (error: unknown) {
          if (isMounted) {
            Cookies.remove("linkup_auth_token");
            Cookies.remove("linkup_user_id");

            if (error instanceof AxiosError) {
              console.error("API Error:", error.response?.data);
            } else if (error instanceof Error) {
              console.error("Auth Error:", error.message);
            }

            setAuthCheckCompleted(true);
          }
        }
      };

      checkAuth();

      return () => {
        isMounted = false;
        controller.abort();
      };
    }, [navigate, token]);

    if (!authCheckCompleted) {
      return <LinkUpLoader />;
    }

    return (
      <main className="min-h-[100dvh] dark:bg-gray-900 flex flex-col w-full md:px-20 px-5 pt-5 md:pt-10">
        <header className="w-full flex">
          <img
            src={linkUpLogo}
            alt="link-up-logo"
            className="w-40 object-contain dark:invert"
          />
        </header>
        <section className="w-full h-full flex items-center justify-center md:py-20 py-18">
          <WrappedComponent {...props} />
        </section>
      </main>
    );
  };
};

export default UserAuthLayout;
