import firebase from "firebase";
import { Message, MessagesConfig } from "./interfaces/messages";

class Messages {
  private config: MessagesConfig;
  private db: firebase.firestore.Firestore;

  constructor(config: MessagesConfig) {
    this.config = config;
    this.db = firebase.firestore();
  }

  collection = () => {
    return this.db.collection(`${this.config.collectionPrefix}messages`);
  };
  sendMessage = async (message: string, mediaURL?: string) => {
    const { roomId, userId } = this.config;
    const messageData: Message = {
      roomId,
      senderId: userId,
      message,
      date: Date.now(),
    };

    if (mediaURL) messageData.mediaURL = mediaURL;

    const data = await this.collection().add(messageData);
    return (await data.get()).data();
  };

  getMessages = async (limit: number = 100) => {
    const { roomId } = this.config;
    const messages: firebase.firestore.DocumentData[] = [];
    const data = await this.collection()
      .where("roomId", "==", roomId)
      .orderBy("date", "desc")
      .limit(limit)
      .get();
    data.forEach((item) => messages.push(item.data()));
    return messages;
  };
}

export default Messages;
