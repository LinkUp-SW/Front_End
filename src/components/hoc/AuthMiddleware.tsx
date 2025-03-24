// components/AuthMiddleware.tsx
import { validateAuthToken } from "@/endpoints/userAuth";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await validateAuthToken();
        if (!response.isValid) {
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkAuth();
  }, [navigate]);

  return <>{children}</>;
};

export default AuthMiddleware;
