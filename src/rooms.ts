import firebase from "firebase";
import { Room, RoomsConfig } from "./interfaces/rooms";

class Rooms {
  private config: RoomsConfig;
  private db: firebase.firestore.Firestore;

  constructor(config: RoomsConfig) {
    this.config = config;
    this.db = firebase.firestore();
  }

  collection = () => {
    return this.db.collection(`${this.config.collectionPrefix}rooms`);
  };

  getRooms = async () => {
    const { userId } = this.config;
    const rooms: firebase.firestore.DocumentData[] = [];
    const user1Rooms = await this.collection()
      .where("user1Id", "==", userId)
      .get();
    const user2Rooms = await this.collection()
      .where("user2Id", "==", userId)
      .get();
    //TODO: sort by last message date
    user1Rooms.forEach((item) => rooms.push({ id: item.id, ...item.data() }));
    user2Rooms.forEach((item) => rooms.push({ id: item.id, ...item.data() }));
    return rooms;
  };

  getRoom = async (otherUserId: string) => {
    const { userId } = this.config;

    const room1 = await this.getRoomByUsers(userId, otherUserId);
    if (room1.exists) return room1;

    const room2 = await this.getRoomByUsers(otherUserId, userId);
    if (room2.exists) return room2;

    return null;
  };

  private getRoomByUsers = async (user1Id: string, user2Id: string) => {
    return await this.collection().doc(`${user1Id}-${user2Id}`).get();
  };

  createRoom = async (otherUserId: string) => {
    if (!otherUserId) return;

    const hasRoom = await this.getRoom(otherUserId);
    if (hasRoom) return;

    const { userId } = this.config;

    const roomData: Room = {
      user1Id: userId,
      user2Id: otherUserId,
      lastMessage: "",
      lastSenderId: "",
    };

    await this.collection().doc(`${userId}-${otherUserId}`).set(roomData);
  };

  deleteRoom = async (roomId: string) => {
    await this.collection().doc(roomId).delete();
  };

  deleteAllRooms = async () => {
    const { userId } = this.config;
    const rooms = await this.getRooms();

    rooms.forEach(
      async (item) => await this.collection().doc(item.id).delete()
    );
  };
}

export default Rooms;
