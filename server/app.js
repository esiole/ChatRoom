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

        io.of(`/${roomID}`).on('connection', (socket) => {
            socket.on('start', (msg) => {
                socket['name'] = msg.name;
            });

            socket.on('msg', (msg) => {
                socket.json.emit('msg', msg);
                socket.broadcast.json.emit('msg', msg);
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
