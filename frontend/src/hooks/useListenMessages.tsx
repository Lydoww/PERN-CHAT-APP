import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation, { MessageType } from "../zustand/useConversation";


const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on(
      "newMessage",
      (newMessage: { shouldShake: boolean; [key: string]: any }) => {
        newMessage.shouldShake = true;
        const sound = new Audio('/sounds/notification.mp3');
        sound.play().catch((err) => {
          console.error("Erreur lecture audio :", err);
        });
        const formattedMessage: MessageType = {
          ...newMessage,
          id: newMessage.id || "",
          body: newMessage.body || "",
          senderId: newMessage.senderId || "",
          createdAt: newMessage.createdAt || new Date().toISOString(),
        };
        setMessages([...messages, formattedMessage]);
      }
    );

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, messages, setMessages]);
};
export default useListenMessages;
