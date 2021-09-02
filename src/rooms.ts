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
    const rooms: Room[] = [];
    const user1Rooms = await this.collection()
      .where("user1Id", "==", userId)
      .get();
    const user2Rooms = await this.collection()
      .where("user2Id", "==", userId)
      .get();

    user1Rooms.forEach((item) =>
      rooms.push({ id: item.id, ...(item.data() as Room) })
    );
    user2Rooms.forEach((item) =>
      rooms.push({ id: item.id, ...(item.data() as Room) })
    );

    return this.sortRooms(rooms);
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
      lastMessage: null,
      updatedAt: Date.now(),
    };

    await this.collection().doc(`${userId}-${otherUserId}`).set(roomData);
  };

  deleteRoom = async (roomId: string) => {
    await this.collection().doc(roomId).delete();
  };

  deleteAllRooms = async () => {
    const rooms = await this.getRooms();

    rooms.forEach(
      async (item) => await this.collection().doc(item.id).delete()
    );
  };

  listenRooms = (callback: (rooms: Room[]) => void) => {
    const { userId } = this.config;

    const user1RoomsQuery = this.collection().where("user1Id", "==", userId);

    const user2RoomsQuery = this.collection().where("user2Id", "==", userId);

    const user1Snapshot = user1RoomsQuery.onSnapshot(async (snapshot) => {
      const user1Rooms = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Room),
      }));
      const user2Rooms = (await user2RoomsQuery.get()).docs.map((item) => ({
        id: item.id,
        ...(item.data() as Room),
      }));
      callback(this.sortRooms([...user1Rooms, ...user2Rooms]));
    });

    const user2Snapshot = user2RoomsQuery.onSnapshot(async (snapshot) => {
      const user2Rooms = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Room),
      }));
      const user1Rooms = (await user1RoomsQuery.get()).docs.map((item) => ({
        id: item.id,
        ...(item.data() as Room),
      }));

      callback(this.sortRooms([...user1Rooms, ...user2Rooms]));
    });

    const unsubscribe = () => {
      user1Snapshot();
      user2Snapshot();
    };

    return unsubscribe;
  };

  private sortRooms = (rooms: Room[]) => {
    return [...rooms].sort((a, b) => {
      if (a.updatedAt && b.updatedAt) return b.updatedAt - a.updatedAt;
      else return -1;
    });
  };
}

export default Rooms;
