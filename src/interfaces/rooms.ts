import firebase from 'firebase';
import { Message } from './messages';
import { FirebaseChatOptions } from './options';

export interface RoomsConfig extends FirebaseChatOptions {
  userId: string;
  firestore?: firebase.firestore.Firestore;
}

export interface Room {
  id?: string;
  user1Id: string;
  user2Id: string;
  lastMessage: Message | null;
  updatedAt: number;
}

export interface GetRoomOptions {
  createIfNotExists: boolean;
}
