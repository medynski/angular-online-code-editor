const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const path = require('path');
const redis = require('then-redis');

const TYPING_INDICATOR = 'typing_indicator';
const ONLINE_USERS = 'online_users';
const GET_ONLINE_USERS = 'get_online_users';
const SAVE_CONTENT = 'save_content';
const GET_CONTENT = 'get_content';
const JOIN_ROOM = 'join_room';
const LEAVE_ROOM = 'leave_room';
const CREATE_ROOM = 'create_room';
const GET_ROOM_LIST = 'get_room_list';

// @TODO: move redis config to a separated configuration file
const redisConfig = {
  host: 'redis-12592.c11.us-east-1-2.ec2.cloud.redislabs.com',
  port: 12592,
  password: 'onlineeditorpass'
};
const redisClient = redis.createClient(redisConfig);

const rooms = [];

app.use('/', express.static(path.resolve(__dirname, './dist')));

app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
);

io.on('connection', socket => {
  const onlineUsers = roomId =>
    io.sockets.adapter.rooms[roomId] && io.sockets.adapter.rooms[roomId].length
      ? io.sockets.adapter.rooms[roomId].length
      : 0;

  socket.on(GET_ONLINE_USERS, (roomId, ackFn) => ackFn(onlineUsers(roomId)));

  socket.on(JOIN_ROOM, (roomId, ackFn) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit(ONLINE_USERS, onlineUsers(roomId));
  });

  socket.on(LEAVE_ROOM, (roomId, ackFn) => {
    socket.leave(roomId);
    ackFn();
  });

  socket.on(CREATE_ROOM, (roomName, ackFn) => {
    const room = { id: Date.now(), name: roomName };
    rooms.push(room);
    ackFn(room);
  });
  socket.on(GET_ROOM_LIST, (payload, ackFn) => ackFn(rooms));

  socket.on(SAVE_CONTENT, (payload, ackFn) =>
    redisClient
      .set(payload.roomId, payload.content)
      .then(ackFn)
      .catch(ackFn)
  );

  socket.on(GET_CONTENT, (roomId, ackFn) =>
    redisClient
      .get(roomId)
      .then(ackFn)
      .catch(() => ackFn(''))
  );

  socket.on(TYPING_INDICATOR, payload =>
    socket.broadcast.to(payload.roomId).emit(TYPING_INDICATOR, payload.message)
  );

  socket.on('disconnect', () => {
    // socket.broadcast.to(ROOM_ID).emit(ONLINE_USERS, onlineUsers - 1);
  });
});

http.listen(port, () => console.log('server listening on *:' + port));
