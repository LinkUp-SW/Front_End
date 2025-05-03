import React, { createContext, useContext, useEffect, useState } from "react";
import { socketService } from "@/services/socket";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

interface SocketContextType {
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({ connected: false });

export const useSocketContext = () => useContext(SocketContext);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [connected, setConnected] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = Cookies.get("linkup_auth_token");
    if (token) {
      socketService
        .connect(token)
        .then(() => {
          socketService.setOnlineStatus(true);
          setConnected(true);
        })
        .catch((err) => {
          console.error("Socket connection failed:", err);
          console.error("Socket connection failed:", err);
          // Immediately terminate any partial connection
          socketService.disconnect();
          setConnected(false);
        });
    }
    return () => {
      socketService.setOnlineStatus(false);
      socketService.disconnect(); // Cleanup on unmount
      setConnected(false);
    };
  }, [dispatch]); // Added dispatch to dependency array

  return (
    <SocketContext.Provider value={{ connected }}>
      {children}
    </SocketContext.Provider>
  );
};
export default SocketProvider;
