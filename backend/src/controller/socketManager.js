import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-call", (path) => {
      socket.join(path);

      if (!connections[path]) connections[path] = [];
      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();

      // Notify existing users
      connections[path].forEach((id) => {
        io.to(id).emit("user-joined", socket.id, connections[path]);
      });

      // Send previous messages
      if (messages[path]) {
        messages[path].forEach((msg) => {
          io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg["socket-id-sender"]);
        });
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      let room = Object.keys(connections).find((roomKey) =>
        connections[roomKey].includes(socket.id)
      );

      if (!room) return;
      if (!messages[room]) messages[room] = [];

      const msgObj = {
        sender,
        data,
        "socket-id-sender": socket.id,
        timestamp: new Date(),
      };

      messages[room].push(msgObj);

      connections[room].forEach((id) => {
        io.to(id).emit("chat-message", data, sender, socket.id);
      });
    });

    socket.on("disconnect", () => {
      const onlineTime = timeOnline[socket.id];
      delete timeOnline[socket.id];

      for (const [room, users] of Object.entries(connections)) {
        const index = users.indexOf(socket.id);
        if (index !== -1) {
          users.splice(index, 1);
          io.to(room).emit("user-left", socket.id);

          if (users.length === 0) delete connections[room];
          break;
        }
      }
    });
  });

  return io;
};
