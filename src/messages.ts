import firebase from "firebase";
import {
  GetMessagesOptions,
  Message,
  MessagesConfig,
} from "./interfaces/messages";
import { Room } from "./interfaces/rooms";

const defaultGetMessagesOptions: GetMessagesOptions = {
  limit: 100,
};

class Messages {
  private config: MessagesConfig;
  private db: firebase.firestore.Firestore;
  private otherUserId: string;

  constructor(config: MessagesConfig) {
    this.config = config;
    this.db = firebase.firestore();
    this.otherUserId = this.getOtherUserId();
  }

  collection = (collection = "messages") => {
    return this.db.collection(`${this.config.collectionPrefix}${collection}`);
  };

  docs = () => {
    return this.collection().where("roomId", "==", this.config.roomId);
  };

  sendMessage = async (message: string, mediaURL?: string) => {
    if (!message && !mediaURL) {
      console.warn(
        "Message could not sent. `message` and `mediaURL` did not provided for sendMessage(message: string, mediaURL?: string)"
      );
      return null;
    }

    const { roomId, userId } = this.config;
    const messageData: Message = {
      roomId,
      message,
      senderId: userId,
      receiverId: this.otherUserId,
      date: Date.now(),
      read: false,
    };

    if (mediaURL) messageData.mediaURL = mediaURL;

    const data = await (await this.collection().add(messageData)).get();

    const roomData: Partial<Room> = {
      lastMessage: messageData,
      updatedAt: Date.now(),
    };

    await this.collection("rooms").doc(roomId).update(roomData);

    return { id: data.id, ...data.data() };
  };

  getMessages = async (
    options?: Partial<GetMessagesOptions>
  ): Promise<Message[]> => {
    const config = { ...defaultGetMessagesOptions, ...(options ?? {}) };
    const { roomId } = this.config;
    const messages: Message[] = [];

    let query = this.collection()
      .where("roomId", "==", roomId)
      .orderBy("date", "desc");

    if (config.startAfter) query = query.startAfter(config.startAfter);

    if (config.limit) query = query.limit(config.limit);

    const data = await query.get();

    data.forEach((item) =>
      messages.push({ id: item.id, ...(item.data() as Message) })
    );
    return messages;
  };

  deleteMessage = async (messageId: string) => {
    await this.collection().doc(messageId).delete();
  };

  deleteAllMessages = async () => {
    const { roomId } = this.config;
    const data = await this.collection().where("roomId", "==", roomId).get();

    data.docs.forEach(
      async (item) => await this.collection().doc(item.id).delete()
    );
  };

  onReadMessage = async (messageId: string) => {
    await this.collection().doc(messageId).update({ read: true });
  };

  onReadAllMessages = async () => {
    const { roomId, userId } = this.config;
    const data = await this.collection()
      .where("roomId", "==", roomId)
      .where("read", "==", false)
      .where("senderId", "!=", userId)
      .get();

    const promises = data.docs.map((item) =>
      this.collection().doc(item.id).update({ read: true })
    );

    await Promise.all(promises);
  };

  listenMessages = (
    options: Partial<GetMessagesOptions>,
    callback: (messages: Message[]) => void
  ) => {
    const config = { ...defaultGetMessagesOptions, ...(options ?? {}) };
    const { roomId } = this.config;

    let query = this.collection()
      .where("roomId", "==", roomId)
      .orderBy("date", "desc");

    if (config.startAfter) query = query.startAfter(config.startAfter);

    if (config.limit) query = query.limit(config.limit);

    return query.onSnapshot((snapshot) => {
      const items: Message[] = [];
      snapshot.forEach((item) =>
        items.push({ id: item.id, ...(item.data() as Message) })
      );
      callback(items);
    });
  };

  getOtherUserId = () => {
    const splittedRoomId = this.config.roomId.split("-");
    if (splittedRoomId.length !== 2) {
      throw new Error(
        `Invalid roomId provided in Messages '${this.config.roomId}'`
      );
    }
    return splittedRoomId[0] === this.config.userId
      ? splittedRoomId[1]
      : splittedRoomId[0];
  };
}

export default Messages;
