const FirebaseChat = require("../dist").default;
const Rooms = require("../dist/rooms").default;
const firebaseConfig = require("./firebase-config");
const firebase = require("firebase").default;

const otherUser = "test-other-user";

const _firebaseChat = FirebaseChat;

beforeAll(() => {
  _firebaseChat.initialize({}, firebaseConfig).setUser("test");
});

test("should return rooms class", () => {
  expect(_firebaseChat.rooms()).toBeInstanceOf(Rooms);
});

test("should return collection", () => {
  expect(_firebaseChat.rooms().collection()).toBeInstanceOf(
    firebase.firestore.CollectionReference
  );
});

test("should get rooms", async () => {
  await _firebaseChat.rooms().deleteAllRooms();
  let rooms = await _firebaseChat.rooms().getRooms();
  expect(rooms.length).toEqual(0);
  await _firebaseChat.rooms().createRoom(otherUser);
  rooms = await _firebaseChat.rooms().getRooms();
  expect(rooms.length).toEqual(1);
});

test("should get room with other user", async () => {
  await _firebaseChat.rooms().deleteAllRooms();
  let room = await _firebaseChat.rooms().getRoom(otherUser);
  expect(room).toBeNull();
  room = await _firebaseChat
    .rooms()
    .getRoom(otherUser, { createIfNotExists: true });
  expect(room).toBeInstanceOf(firebase.firestore.DocumentSnapshot);
});

test("should find room with other user", async () => {
  await _firebaseChat.rooms().deleteAllRooms();
  let room = await _firebaseChat.rooms().findRoom(otherUser);
  expect(room).toBeNull();
  await _firebaseChat.rooms().createRoom(otherUser);
  room = await _firebaseChat.rooms().findRoom(otherUser);
  expect(room).toBeInstanceOf(firebase.firestore.DocumentSnapshot);
});

test("should create room", async () => {
  const room = await _firebaseChat.rooms().createRoom(otherUser);
  expect(room).toBeInstanceOf(firebase.firestore.DocumentSnapshot);
});

test("should not create room without other user id", async () => {
  expect(await _firebaseChat.rooms().createRoom()).toBeNull();
});

test("should delete room", async () => {
  let room = await _firebaseChat
    .rooms()
    .getRoom(otherUser, { createIfNotExists: true });
  await _firebaseChat.rooms().deleteRoom(room.id);
  room = await _firebaseChat.rooms().getRoom(otherUser);
  expect(room).toBeNull();
});

test("should delete all rooms", async () => {
  await _firebaseChat.rooms().getRoom(otherUser, { createIfNotExists: true });
  await _firebaseChat.rooms().deleteAllRooms();
  const rooms = await _firebaseChat.rooms().getRooms();
  expect(rooms.length).toEqual(0);
});
