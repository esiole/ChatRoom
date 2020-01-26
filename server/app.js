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

let rooms = new Set();  // существующие комнаты
let abc = "abcdefghijklmnopqrstuvwxyz";

// создание новой чат-комнаты
function generateChatRoom() {
    let roomID = '';
    for (let i = 0; i < 5; i++) {
        roomID += abc[Math.floor(Math.random() * abc.length)];
    }
    if (!rooms.has(roomID)) {
        rooms.add(roomID);
        createSocket(roomID);
    } else {
        roomID = generateChatRoom();
    }
    return roomID;
}

// создание пространства имён сокетов для чат-комнаты
function createSocket(roomID) {
    let users = new Set();
    io.of(`/${roomID}`).on('connection', (socket) => {
        socket.on('start', (msg) => {
            if (users.has(msg.name)) {  // если имя уже занято, то сообщить об этом и не добавлять его
                send(socket, 'badName', {}, false);
            } else {
                socket['name'] = msg.name;
                users.add(msg.name);
                send(socket, 'users', {users: [...users]});
            }
        });

        socket.on('disconnect', (msg) => {
            users.delete(`${socket['name']}`);
            if (users.size === 0) {     // кода комнату покинули все пользователи, она удаляется
                rooms.delete(roomID);
            }
            send(socket, 'users', {users: [...users]});
        });

        socket.on('msg', (msg) => {     // отправка нового сообщения в чат
            let message = {...msg};
            message.time = new Date().toLocaleTimeString('ru', {hour12: false}).substr(0, 8);
            send(socket, 'msg', message);
        });
    });
}

// отправка сообщений по сокетам
function send(socket, header, json, broadcast = true) {
    socket.json.emit(header, json);
    if (broadcast) socket.broadcast.json.emit(header, json);
}

app.get('/id/get', function (req, res) {
    let roomID = generateChatRoom();
    res.json({'id': roomID});
    console.log(roomID);
});

app.listen(3333);
