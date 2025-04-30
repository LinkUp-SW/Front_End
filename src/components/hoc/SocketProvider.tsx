import React, { createContext, useEffect, useState } from "react";
import { socketService } from "@/services/socket";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import {
  setFriendOnlineStatus,
} from "../../slices/messaging/messagingSlice";

export const SocketContext = createContext({});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = Cookies.get("linkup_auth_token");
    if (token) {
      socketService.connect(token)
        .then(() => {
          console.log("Socket connected from provider");
          socketService.setOnlineStatus(true);
          setConnected(true);
          socketService.on<{ userId: string }>("user_online", ({ userId }) => {
            dispatch(setFriendOnlineStatus({ userId, isOnline: true }));
          });
    
          socketService.on<{ userId: string }>("user_offline", ({ userId }) => {
            dispatch(setFriendOnlineStatus({ userId, isOnline: false }));
          });
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
