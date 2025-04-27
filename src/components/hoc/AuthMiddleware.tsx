import { userLogOut, validateAuthToken } from "@/endpoints/userAuth";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import LinkUpLoader from "../linkup_loader/LinkUpLoader";
// import LoadingSpinner from "@/components/LoadingSpinner"; // Add a loading component

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  const token = Cookies.get("linkup_auth_token");
  const myUserId = Cookies.get("linkup_user_id");
  const userType = Cookies.get("linkup_user_type");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const checkAuth = async () => {
      try {
        if (!token || !myUserId || !userType) {
          Cookies.remove("linkup_user_type");
          await userLogOut();
          navigate("/login", { replace: true });
          return;
        }

        const response = await validateAuthToken(token, {
          signal: controller.signal,
        });

        if (isMounted) {
          if (!response.success || !myUserId) {
            throw new Error("Invalid token");
          }
          setIsVerified(true);
        }

        if (userType === "admin") {
          if (
            location.pathname === "/login" ||
            location.pathname.startsWith("/signup") ||
            !location.pathname.startsWith("/admin")
          ) {
            navigate("/admin/dashboard", {
              replace: true,
            });
          }
        
        } else {
          if (location.pathname.startsWith("/admin")) {
            navigate("/feed", {
              replace: true,
            });
          }
        }
      } catch (error: unknown) {
        if (isMounted) {
          Cookies.remove("linkup_auth_token");
          Cookies.remove("linkup_user_id");
          Cookies.remove("linkup_user_type");

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

    checkAuth();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [navigate, token]);

  if (!isVerified) {
    return <LinkUpLoader />;
  }

  return <>{children}</>;
};

export default AuthMiddleware;
