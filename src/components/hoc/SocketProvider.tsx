import React, { createContext, useEffect, useState } from "react";
import { socketService } from "@/services/socket";
import Cookies from "js-cookie";

export const SocketContext = createContext({});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = Cookies.get("linkup_auth_token");
    if (token) {
      socketService.connect(token)
        .then(() => {
          console.log("Socket connected from provider");
          socketService.setOnlineStatus(true);
          setConnected(true);
        })
        .catch((err) => {
          console.error("Socket connection failed:", err);
        });
    }

    return () => {
      socketService.setOnlineStatus(false);
      socketService.disconnect(); // Cleanup on unmount
      setConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ connected }}>
      {children}
    </SocketContext.Provider>
  );
};
