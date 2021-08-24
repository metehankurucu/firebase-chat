import { FirebaseChatOptions } from "./options";

export interface Message {
  roomId: string;
  message: string;
  senderId: string;
  receiverId?: string;
  mediaURL?: string;
  date: number;
}

export interface MessagesConfig extends FirebaseChatOptions {
  userId: string;
  roomId: string;
}
