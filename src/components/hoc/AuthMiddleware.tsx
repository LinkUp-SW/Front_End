import { userLogOut, validateAuthToken } from "@/endpoints/userAuth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
// import LoadingSpinner from "@/components/LoadingSpinner"; // Add a loading component

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const token = Cookies.get("linkup_auth_token");
  const myUserId = Cookies.get("linkup_user_id");

  // useEffect(() => {
  //   let isMounted = true;
  //   const controller = new AbortController();

  const checkAuth = async () => {
    try {
      if (!token || !myUserId) {
        await userLogOut();
        navigate("/login", { replace: true });
        return;
      }

      //       const response = await validateAuthToken(token, {
      //         signal: controller.signal,
      //       });

      if (isMounted) {
        if (!response.success || !myUserId) {
          throw new Error("Invalid token");
        }
        setIsVerified(true);
      }
    } catch (error: unknown) {
      if (isMounted) {
        Cookies.remove("linkup_auth_token");
        Cookies.remove("linkup_user_id");

        let redirectPath = "/login";
        if (error instanceof AxiosError) {
          console.error("API Error:", error.response?.data);
          redirectPath += "?error=session_expired";
        } else if (error instanceof Error) {
          console.error("Auth Error:", error.message);
        }

        navigate(redirectPath, {
          replace: true,
          state: { from: location.pathname }, // Preserve current location
        });
      }
    }
  };

  //   checkAuth();

  //   return () => {
  //     isMounted = false;
  //     controller.abort();
  //   };
  // }, [navigate, token]);

  // if (!isVerified) {
  //   return <>Loading...</>;
  // }

  return <>{children}</>;
};

export default AuthMiddleware;
