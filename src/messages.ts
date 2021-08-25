import firebase from "firebase";
import { Message, MessagesConfig } from "./interfaces/messages";
import { Room } from "./interfaces/rooms";

class Messages {
  private config: MessagesConfig;
  private db: firebase.firestore.Firestore;

  constructor(config: MessagesConfig) {
    this.config = config;
    this.db = firebase.firestore();
  }

  collection = (collection = "messages") => {
    return this.db.collection(`${this.config.collectionPrefix}${collection}`);
  };

  docs = () => {
    return this.collection().where("roomId", "==", this.config.roomId);
  };

  sendMessage = async (message: string, mediaURL?: string) => {
    const { roomId, userId } = this.config;
    const messageData: Message = {
      roomId,
      senderId: userId,
      message,
      date: Date.now(),
      read: false,
    };

    if (mediaURL) messageData.mediaURL = mediaURL;

    const data = await (await this.collection().add(messageData)).get();

    const roomData: Partial<Room> = {
      lastMessage: message || "Media",
      lastSenderId: userId,
    };

    await this.collection("rooms").doc(roomId).update(roomData);

    return { id: data.id, ...data.data() };
  };

  getMessages = async (limit: number = 100) => {
    const { roomId } = this.config;
    const messages: firebase.firestore.DocumentData[] = [];
    const data = await this.collection()
      .where("roomId", "==", roomId)
      .orderBy("date", "desc")
      .limit(limit)
      .get();
    data.forEach((item) => messages.push({ id: item.id, ...item.data() }));
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

    data.docs.forEach(
      async (item) =>
        await this.collection().doc(item.id).update({ read: true })
    );
  };
}

export default Messages;
