const express = require('express');
const cors = require('cors');
const io = require('socket.io').listen(3030);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
    credentials: true,
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Authorization,X-Requested-With,X-HTTP-Method-Override,Content-Type,Cache-Control,Accept'
};
app.use(cors(corsOptions));

let rooms = new Set();

io.sockets.on('connection', (socket) => {
    socket.on('connect', (msg) => {
        socket["name"] = msg.name;
    });

    socket.on('disconnect', (msg) => {});
});

let abc = "abcdefghijklmnopqrstuvwxyz";
function generateChatRoomId() {
    let roomID = '';
    for (let i = 0; i < 5; i++) {
        roomID += abc[Math.floor(Math.random() * abc.length)];
    }
    if (!rooms.has(roomID)) {
        rooms.add(roomID);

        let users = new Set();
        //let users = [];
        io.of(`/${roomID}`).on('connection', (socket) => {
            socket.on('start', (msg) => {
                socket['name'] = msg.name;
                if (users.has(msg.name)) {
                    //пользоватеь уже был введён
                    socket.json.emit('badName', {});
                } else {
                    users.add(msg.name);
                    //users.push(msg.name);
                    socket.json.emit('users', {users: [...users]});
                    socket.broadcast.json.emit('users', {users: [...users]});
                    //console.log(users);
                    //socket.json.emit('users', {users: users});
                    //socket.broadcast.json.emit('users', {users: users});
                }
            });

            socket.on('disconnect', (msg) => {
                users.delete(`${socket['name']}`);
                socket.json.emit('users', {users: [...users]});
                socket.broadcast.json.emit('users', {users: [...users]});
            });

            socket.on('msg', (msg) => {
                let message = {...msg};
                message.time = new Date().toLocaleTimeString('ru', {hour12: false}).substr(0, 8);
                socket.json.emit('msg', message);
                socket.broadcast.json.emit('msg', message);
            });
        });

    } else {
        roomID = generateChatRoomId();
    }
    return roomID;
}

app.get('/id/get', function (req, res) {
    let roomID = generateChatRoomId();
    res.json({'id': roomID});
    console.log(roomID);
});

app.post('/id/delete', function (req, res) {
    rooms.delete(req.body.id);
    res.json({'id': req.body.id}); //что вернуть?
    console.log(rooms);
});

app.listen(3333);
