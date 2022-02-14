<div align="center">
  <h1>
    <br/>
    <br />
    firebase-chat
    <br />
    <br />
  </h1>
  <sup>
    <br />
    <a href="https://www.npmjs.com/package/@metehankurucu/firebase-chat">
       <img src="https://img.shields.io/npm/v/@metehankurucu/firebase-chat?color=%231ABC9C" alt="npm package" />
    </a>
    <a href="https://www.npmjs.com/package/@metehankurucu/firebase-chat">
      <img src="https://img.shields.io/npm/dm/@metehankurucu/firebase-chat?color=%232ECC71" alt="downloads" />
    </a>
    <a>
      <img src="https://img.shields.io/npm/l/@metehankurucu/firebase-chat" alt="license" />
    </a>
    <img src="https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label" alt="typescript" />
    <br />
    <br />
    <h3>
    A small package for one-to-one messaging with Firebase.
    </h3>
  </sup>
  <br />
</div>

<!-- # `@metehankurucu/firebase-chat` -->

- [Install](#getting-started)
- [Usage](#usage)
- [API](#api)

## Getting started

Install the library:

```
yarn add @metehankurucu/firebase-chat
```

or npm:

```
npm install --save @metehankurucu/firebase-chat
```

## Usage

#### Step 1 - Initialize FirebaseChat

```js
import FirebaseChat from '@metehankurucu/firebase-chat';

// Optional. Use if firebase not initialized before
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};

const options = {
  collectionPrefix: 'chat', // optional. collection names will be 'chatmessages' and 'chatrooms'
};

FirebaseChat.initialize({}, firebaseConfig);

// Or set collection prefixes
FirebaseChat.initialize(options, firebaseConfig);

// Or give custom firestore instance (for example using library in React Native)
import firestore from '@react-native-firebase/firestore';

FirebaseChat.initialize({}, firebaseConfig, firestore());
```

FirebaseChat must initialize only one time. You can check if it is initialized.

```js
if (!FirebaseChat.isInitialized) {
  FirebaseChat.initialize({}, firebaseConfig);
}
```

#### Step 2 - Set Current User Id

```js
import FirebaseChat from '@metehankurucu/firebase-chat';

FirebaseChat.setUser(userId);

// Or you can combine two steps
FirebaseChat.initialize({}, firebaseConfig).setUser(userId);
```

#### Rooms

```js
const rooms = FirebaseChat.rooms();
```

Listen current user's rooms

```js
const unsubscribe = rooms.listenRooms(async (items) => {
  // Do some stuff
});
```

Get a room

```js
// Get a room with other user id
const room = rooms.getRoom(otherUserId);
// Or room can create if not exists
const room = rooms.getRoom(otherUserId, { createIfNotExists: true });
```

Delete a room

```js
rooms.deleteRoom(room.id);
```

Create a room

```js
rooms.createRoom(otherUserId);
```

Note: Recommended way to create a room using getRoom with createIfNotExists option.

```js
const room = rooms.getRoom(otherUserId, { createIfNotExists: true });
```

Get collection. If you want to use collection to run custom operations.

```js
// Firestore collection instance
const roomsCollection = rooms.collection();
```

#### Messages

```js
const room = await rooms.getRoom(otherUserId, { createIfNotExists: true });

const messages = FirebaseChat.messages(room.id);
```

Send message

```js
const message = messages.sendMessage('Hey!');
// Optional mediaURL
const message = messages.sendMessage('Did you see this meme?', 'pic-url');
```

Note: Sending message will update current room's `lastMessage` field.

Listen this room's messages

```js
// For example listen messages with first get last 50 messages
const unsubscribe = messages.listenMessages({ limit: 50 }, (items) => {});
```

Get this room's messages

```js
const messagesList = await messages.getMessages({ limit: 50 });
```

Get other user id

```js
const otherUserId = messages.getOtherUserId();
```

On read a message. This will update this message's `read` field as `true`.

```js
await messages.onReadMessage(messageId);
```

On read all messages. This will update all messages sent by other user `read` field as `true`.

```js
await messages.onReadAllMessages();
```

Delete a message

```js
await messages.deleteMessage(messageId);
```

Delete all messages of room

```js
await messages.deleteMessage(messageId);
```

Get collection. If you want to use collection to run custom operations.

```js
// Firestore collection instance
const messagesCollection = messages.collection();
```

## API

TODO
