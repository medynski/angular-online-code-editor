const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const path = require('path');
const redis = require('then-redis');

const ROOM_ID = 'code';
const TYPING_INDICATOR = 'typing_indicator';
const ONLINE_USERS = 'online_users';
const GET_ONLINE_USERS = 'get_online_users';
const SAVE_CONTENT = 'save_content';
const GET_CONTENT = 'get_content';

// @TODO: move redis config to a separated configuration file
const redisConfig = {
  host: 'redis-12592.c11.us-east-1-2.ec2.cloud.redislabs.com',
  port: 12592,
  password: 'onlineeditorpass'
};
const redisClient = redis.createClient(redisConfig);

app.use('/', express.static(path.resolve(__dirname, './dist')));

app.get('*', (req, res) => {
  if (process.env.ENV === 'prod') {
    res.sendFile(path.resolve(__dirname, './dist/index.html'));
  } else {
    res.redirect('http://localhost:4200');
  }
});

io.on('connection', socket => {
  socket.join(ROOM_ID);
  const onlineUsers = io.sockets.adapter.rooms[ROOM_ID].length;
  socket.broadcast.to(ROOM_ID).emit(ONLINE_USERS, onlineUsers);

  socket.on(GET_ONLINE_USERS, (roomId, ackFn) =>
    ackFn(io.sockets.adapter.rooms[roomId].length)
  );

  socket.on(SAVE_CONTENT, (content, ackFn) =>
    redisClient
      .set(ROOM_ID, content)
      .then(ackFn)
      .catch(ackFn)
  );

  socket.on(GET_CONTENT, (room, ackFn) =>
    redisClient
      .get(room)
      .then(ackFn)
      .catch(() => ackFn(''))
  );

  socket.on(TYPING_INDICATOR, msg =>
    socket.broadcast.to(ROOM_ID).emit(TYPING_INDICATOR, msg)
  );

  socket.on('disconnect', () => {
    socket.broadcast.to(ROOM_ID).emit(ONLINE_USERS, onlineUsers - 1);
  });
});

http.listen(port, () => console.log('listening on *:' + port));
