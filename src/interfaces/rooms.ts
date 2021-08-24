import { FirebaseChatOptions } from "./options";

export interface RoomsConfig extends FirebaseChatOptions {
  userId: string;
}

export interface Room {
  user1Id: string;
  user2Id: string;
  lastMessage: string;
  lastSenderId: string;
}
