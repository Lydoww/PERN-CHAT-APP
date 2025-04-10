import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useRef,
} from "react";
import { useAuthContext } from "./AuthContext";
import io, { Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocketContext = (): ISocketContext => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }
  return context;
};

const socketURL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser, isLoading } = useAuthContext();

  useEffect(() => {
    console.log("🌀 Socket effect triggered 👀");
    console.log("authUser:", authUser);
    console.log("isLoading:", isLoading);

    if (!isLoading && authUser) {
      console.log("📡 Connecting socket for user:", authUser.id);

      const socket = io(socketURL, {
        query: { userId: authUser.id },
        transports: ["websocket"], // pour forcer le bon transport
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ New socket connected:", socket.id);
      });

      socket.on("getOnlineUsers", (users: string[]) => {
        console.log("👥 Online users received:", users);
        setOnlineUsers(users);
      });

      socket.on("disconnect", () => {
        console.log("🔌 Socket disconnected:", socket.id);
      });

      return () => {
        console.log("🧹 Cleaning up socket");
        socket.disconnect();
        socketRef.current = null;
      };
    }

    // Cas où l'utilisateur se déconnecte
    if (!isLoading && !authUser && socketRef.current) {
      console.log("🧹 Cleaning up socket due to logout");
      socketRef.current.disconnect();
      socketRef.current = null;
      setOnlineUsers([]);
    }
  }, [authUser, isLoading]);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, onlineUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
