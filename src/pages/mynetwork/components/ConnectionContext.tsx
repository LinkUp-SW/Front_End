import { createContext, useContext, useState } from "react";

interface ConnectionContextType {
  connectionCount: number;
  setConnectionCount: (count: number) => void;
}

const ConnectionContext = createContext<ConnectionContextType>({
  connectionCount: 0,
  setConnectionCount: () => {},
});

export const useConnectionContext = () => useContext(ConnectionContext);

export const ConnectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [connectionCount, setConnectionCount] = useState(0);

  return (
    <ConnectionContext.Provider value={{ connectionCount, setConnectionCount }}>
      {children}
    </ConnectionContext.Provider>
  );
};
