import { useSocketContext } from "../context/SocketContext";

const OnlineIndicator = ({ userId }: { userId: string }) => {
  const { onlineUsers } = useSocketContext();
  
  // Debug crucial
  console.log("[DEBUG] OnlineIndicator -", {
    userId,
    onlineUsers,
    match: onlineUsers.includes(userId)
  });

  if (!onlineUsers.includes(userId)) return null;

  return (
    <span 
      className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"
      title="En ligne"
    />
  );
};

export default OnlineIndicator;