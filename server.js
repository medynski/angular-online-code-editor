const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const path = require('path');
const redis = require('then-redis');

// express app config
app.use('/', express.static(path.resolve(__dirname, './dist')));
app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
);

// app constants and helpers
const REDIS_ROOMS_KEY = 'rooms';
const ACTION_TYPING_INDICATOR = 'typing_indicator';
const ACTION_ONLINE_USERS = 'online_users';
const ACTION_GET_ONLINE_USERS = 'get_online_users';
const ACTION_SAVE_CONTENT = 'save_content';
const ACTION_GET_CONTENT = 'get_content';
const ACTION_JOIN_ROOM = 'join_room';
const ACTION_LEAVE_ROOM = 'leave_room';
const ACTION_CREATE_ROOM = 'create_room';
const ACTION_GET_ROOM_LIST = 'get_room_list';
const PUSH_ROOM_CREATED = 'push_room_created';
const PUSH_ROOM_UPDATED = 'push_room_updated';

// @TODO: move redis config to a separated configuration file
const redisConfig = {
  host: 'redis-12592.c11.us-east-1-2.ec2.cloud.redislabs.com',
  port: 12592,
  password: 'onlineeditorpass'
};
const redisClient = redis.createClient(redisConfig);

const generateRandomString = (length = 10) => {
  const possibleCharacters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let output = '';
  for (let i = 0; i < length; i++) {
    output += possibleCharacters.charAt(
      Math.floor(Math.random() * possibleCharacters.length)
    );
  }
  return output;
};

const sendPushNotification = (socket, type, payload) => {
  Object.keys(io.sockets.adapter.rooms).forEach(roomId =>
    socket.broadcast.to(roomId).emit(type, payload)
  );
};

const roomCreatedPush = async socket => {
  const rooms = await getRooms();
  sendPushNotification(socket, PUSH_ROOM_CREATED, rooms);
};

const updateOnlineUsers = socket => {
  Object.keys(io.sockets.adapter.rooms).forEach(roomId =>
    socket.broadcast
      .to(roomId)
      .emit(ACTION_ONLINE_USERS, io.sockets.adapter.rooms[roomId].length)
  );
};

const onlineUsers = roomId =>
  io.sockets.adapter.rooms[roomId] && io.sockets.adapter.rooms[roomId].length
    ? io.sockets.adapter.rooms[roomId].length
    : 0;

// database (cache) manipulations
const createOrUpdateRoom = room =>
  redisClient.hset(REDIS_ROOMS_KEY, room.id, JSON.stringify(room));

const getRooms = () => redisClient.hgetall(REDIS_ROOMS_KEY);

// socket connection config
io.on('connection', socket => {
  socket.on(ACTION_GET_ONLINE_USERS, (payload, ackFn) =>
    ackFn(onlineUsers(payload.roomId))
  );

  socket.on(ACTION_JOIN_ROOM, (payload, ackFn) => {
    socket.join(payload.roomId);
    updateOnlineUsers(socket);
  });

  socket.on(ACTION_LEAVE_ROOM, (payload, ackFn) => {
    socket.leave(payload.roomId);
    updateOnlineUsers(socket);
    ackFn();
  });

  socket.on(ACTION_CREATE_ROOM, async (payload, ackFn) => {
    const now = Date.now();
    const room = {
      id: generateRandomString(),
      name: payload.name,
      content: '/* your js code goes here */',
      creation_timestamp: now,
      last_modified: now
    };

    await createOrUpdateRoom(room);
    ackFn(room);
    roomCreatedPush(socket);
  });

  socket.on(ACTION_GET_ROOM_LIST, async (payload, ackFn) => {
    const rooms = await getRooms();
    ackFn(rooms || {});
  });

  socket.on(ACTION_SAVE_CONTENT, async (payload, ackFn) => {
    let room = await redisClient.hget(REDIS_ROOMS_KEY, payload.roomId);

    if (room) {
      room = JSON.parse(room);
      room = {
        ...room,
        ...{ content: payload.content, last_modified: Date.now() }
      };
      redisClient
        .hset(REDIS_ROOMS_KEY, payload.roomId, JSON.stringify(room))
        .then(() => {
          ackFn(room);
          socket.broadcast.to(payload.roomId).emit(PUSH_ROOM_UPDATED, room);
        })
        .catch(ackFn);
    }
  });

  socket.on(ACTION_GET_CONTENT, async (payload, ackFn) => {
    let output;
    try {
      const room = await redisClient.hget(REDIS_ROOMS_KEY, payload.roomId);
      output = JSON.parse(room);
    } catch (err) {}
    ackFn(output);
  });

  socket.on(ACTION_TYPING_INDICATOR, payload =>
    socket.broadcast
      .to(payload.roomId)
      .emit(ACTION_TYPING_INDICATOR, payload.message)
  );

  socket.on('disconnect', () => {});
});

http.listen(port, () => console.log('server listening on *:' + port));
