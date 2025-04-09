import { useEffect, useState } from "react";
import { ConversationType } from "../zustand/useConversation";
import toast from "react-hot-toast";

export const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationType[]>([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch("api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setConversation(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    getConversations();
  }, []);

  return { loading, conversation };
};
