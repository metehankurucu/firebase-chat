const FirebaseChat = require("../dist").default;
const Rooms = require("../dist/rooms").default;
const Messages = require("../dist/messages").default;
const firebaseConfig = require("./firebase-config");

const _firebaseChat = FirebaseChat;

const reset = () => {
  _firebaseChat._rooms = undefined;
  _firebaseChat.userId = undefined;
  _firebaseChat.options = undefined;
};

beforeEach(() => {
  reset();
});

test("should throw error while using setUser without initialized", () => {
  expect(() => _firebaseChat.setUser("")).toThrow(Error);
});

test("should throw error on multiple initialize", () => {
  _firebaseChat.initialize();
  expect(() => _firebaseChat.initialize()).toThrow(Error);
});

test("should return itself after setUser", () => {
  _firebaseChat.initialize({}, firebaseConfig);
  expect(_firebaseChat.setUser("test")).toBeTruthy();
});

test("should return rooms class", () => {
  _firebaseChat.initialize({}).setUser("test");
  expect(_firebaseChat.rooms()).toBeInstanceOf(Rooms);
});

test("should throw error when called messages with invalid room id", () => {
  _firebaseChat.initialize({}).setUser("test");
  expect(() => _firebaseChat.messages("invalid room id")).toThrow(Error);
});

test("should return messages class with correct room id", async () => {
  _firebaseChat.initialize({}).setUser("test");
  const room = await _firebaseChat
    .rooms()
    .getRoom("otherUser", { createIfNotExists: true });
  expect(_firebaseChat.messages(room.id)).toBeInstanceOf(Messages);
});
