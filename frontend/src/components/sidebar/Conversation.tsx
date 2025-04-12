import { useSocketContext } from "../../context/SocketContext";
import useConversation, {
  ConversationType,
} from "../../zustand/useConversation";
import { useState } from "react";

const Conversation = ({
  conversation,
  emoji,
}: {
  conversation: ConversationType;
  emoji: string;
}) => {
  const { setSelectedConversation, selectedConversation } = useConversation();
  const isSelected = selectedConversation?.id === conversation.id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation.id);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2
         py-1 cursor-pointer ${isSelected ? "bg-sky-500" : ""}`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className="avatar relative">
          <div className="w-8 md:w-12 rounded-full overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-600 animate-pulse rounded-full"></div>
            )}

            <img
              src={conversation.profilePic}
              alt="user avatar"
              onLoad={() => setImageLoaded(true)}
              className={`${imageLoaded ? "block" : "invisible"}`}
            />

            {isOnline && imageLoaded && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200 text-sm md:text-md">
              {conversation.fullName}
            </p>
            <span className="text-xl hidden md:inline-block">{emoji}</span>
          </div>
        </div>
      </div>

      <div className="divider my-0 py-0 h-1" />
    </>
  );
};
export default Conversation;
