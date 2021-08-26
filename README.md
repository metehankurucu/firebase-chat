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
    <br />
    <br />
    <h3>
    A small package for one-to-one messaging with Firebase.
    </h3>
  </sup>
  <br />
  <pre>npm i @metehankurucu/firebase-chat</pre>
</div>

## This package under development

## Usage

```js
// required step 1
FirebaseChat.initialize(
  // FirebaseChat options (optional)
  {},
  // this is optional if you did'nt initialize firebase yet
  {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  }
);

// required step 2
// set current userId
FirebaseChat.setUser("user1");

// example usage

const rooms = FirebaseChat.rooms();

// create room for current user and other user (user2)
await rooms.createRoom("user2");

// get current user and other user's room by pass other user ıd
const myRoom = await rooms.getRoom("user2");

const messages = FirebaseChat.messages(myRoom.id);

// send message to room by current user
const message = await messages.sendMessage("hi");

// get messages from current user and other user's room
const roomMessages = await messages.getMessages();
```
