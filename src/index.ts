import firebase from 'firebase';
import Rooms from './rooms';
import Messages from './messages';
import { FirebaseChatOptions } from './interfaces/options';

const defaultOptions: FirebaseChatOptions = {
  collectionPrefix: 'chat',
  databaseType: 'firestore',
};

class FirebaseChat {
  private static _rooms: Rooms;
  static userId: string;
  static options: FirebaseChatOptions;
  static isInitialized = false;

  static initialize = (
    options: Partial<FirebaseChatOptions> = {},
    firebaseConfig?: object | undefined,
  ) => {
    if (FirebaseChat.options)
      console.warn(
        'FirebaseChat initialized before. You must not call FirebaseChat.initialize more than once.',
      );

    if (firebaseConfig) firebase.initializeApp(firebaseConfig);
    FirebaseChat.options = { ...defaultOptions, ...options };
    FirebaseChat.isInitialized = true;
    return FirebaseChat;
  };

  static setUser = (userId: string) => {
    if (!FirebaseChat.options)
      throw new Error(
        'options not found, please first initialize with FirebaseChat.initialize().',
      );

    FirebaseChat.userId = userId;
    FirebaseChat._rooms = new Rooms({ userId, ...FirebaseChat.options });
    return FirebaseChat;
  };

  static messages = (roomId: string) => {
    if (!FirebaseChat.options)
      throw new Error(
        'options not found, please first initialize with FirebaseChat.initialize().',
      );

    if (!FirebaseChat.userId)
      throw new Error(
        'userId not found, please set userId with FirebaseChat.setUser(userId).',
      );

    return new Messages({
      roomId,
      userId: FirebaseChat.userId,
      ...FirebaseChat.options,
    });
  };

  static rooms = () => {
    if (!FirebaseChat.options || !FirebaseChat._rooms)
      throw new Error(
        'options not found, please first initialize with FirebaseChat.initialize().',
      );

    if (!FirebaseChat.userId || !FirebaseChat._rooms)
      throw new Error(
        'userId not found, please set userId with FirebaseChat.setUser(userId).',
      );

    return FirebaseChat._rooms;
  };
}

export default FirebaseChat;
