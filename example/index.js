const FirebaseChat = require("../dist").default;

// Example usage

(async () => {
  FirebaseChat.initialize(
    {},
    {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
    }
  );

  FirebaseChat.setUser("user1");

  const rooms = FirebaseChat.rooms();
  rooms.createRoom("user2");

  const myRoom = await rooms.getRoom("user2");

  const messages = FirebaseChat.messages(myRoom.id);

  const message = await messages.sendMessage("hi");
})();
