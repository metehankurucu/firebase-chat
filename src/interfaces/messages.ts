import firebase from 'firebase';
import { FirebaseChatOptions } from './options';

export interface Message {
  id?: string;
  roomId: string;
  message: string;
  senderId: string;
  receiverId?: string;
  mediaURL?: string;
  date: number;
  read?: boolean;
}

export interface MessagesConfig extends FirebaseChatOptions {
  userId: string;
  roomId: string;
  firestore?: firebase.firestore.Firestore;
}

export interface GetMessagesOptions {
  limit: number;
  startAfter?: number;
}
