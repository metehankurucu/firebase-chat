const FirebaseChat = require('../dist').default;
const Rooms = require('../dist/rooms').default;
const Messages = require('../dist/messages').default;
const firebaseConfig = require('./firebase-config');
const firebase = require('firebase').default;

const otherUser = 'test-other-user';
const currentUser = 'test';

let messages;

const _firebaseChat = FirebaseChat;

beforeAll(async () => {
  _firebaseChat.initialize({}, firebaseConfig).setUser(currentUser);
  const room = await _firebaseChat
    .rooms()
    .getRoom(otherUser, { createIfNotExists: true });
  messages = _firebaseChat.messages(room.id);
});

test('should return messages class', () => {
  expect(messages).toBeInstanceOf(Messages);
});

test('should return firebase collection', () => {
  expect(messages.collection()).toBeInstanceOf(
    firebase.firestore.CollectionReference,
  );
});

test('should return firebase documents object', () => {
  expect(messages.docs()).toBeInstanceOf(firebase.firestore.Query);
});

test('should not send message without message and mediaURL', async () => {
  const warn = console.warn;
  console.warn = jest.fn();

  const message = await messages.sendMessage();

  const warning = console.warn.mock.calls[0][0];
  expect(message).toBeNull();
  expect(console.warn).toHaveBeenCalled();
  expect(warning).toEqual(
    expect.stringContaining(
      'Message could not sent. `message` and `mediaURL` did not provided for sendMessage(message: string, mediaURL?: string)',
    ),
  );

  console.warn = warn;
});

test('should send message', async () => {
  const messageText = 'test message';
  const message = await messages.sendMessage(messageText);
  expect(message.message).toEqual(messageText);
  expect(message.senderId).toEqual(currentUser);
  expect(message.receiverId).toEqual(otherUser);
});

test("should update room's lastMessage after sent message", async () => {
  const messageText = `last message ${Date.now()}`;
  const message = await messages.sendMessage(messageText);
  expect(message.message).toEqual(messageText);
  const room = await _firebaseChat.rooms().getRoom(otherUser);
  expect(room.lastMessage.message).toEqual(messageText);
});

test('should delete message', async () => {
  const messageText = `message ${Date.now()}`;
  const message = await messages.sendMessage(messageText);
  expect(message.id).toBeTruthy();
  await messages.deleteMessage(message.id);
  const deletedMessage = await messages
    .docs()
    .where('message', '==', messageText)
    .get();
  expect(deletedMessage.docs.length).toEqual(0);
});

test('should delete all messages in room', async () => {
  await messages.deleteAllMessages();
  const deletedMessages = await messages.getMessages();
  expect(deletedMessages.length).toEqual(0);
});
