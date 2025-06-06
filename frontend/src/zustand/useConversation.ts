import { create } from "zustand";

export type ConversationType = {
	id: string;
	fullName: string;
	profilePic: string;
};

export type MessageType = {
	id: string;
	body: string;
	senderId: string;
	createdAt: string;
	shouldShake?: boolean;
};

interface ConversationState {
	selectedConversation: ConversationType | null;
	messages: MessageType[];
	setSelectedConversation: (conversation: ConversationType | null) => void;
	setMessages: (messages: MessageType[]) => void;
}

const useConversation = create<ConversationState>((set: (partial: Partial<ConversationState>) => void) => ({
	selectedConversation: null,
	setSelectedConversation: (conversation: ConversationType | null) => set({ selectedConversation: conversation }),
	messages: [],
	setMessages: (messages: MessageType[]) => set({ messages: messages }),
}));

export default useConversation;
