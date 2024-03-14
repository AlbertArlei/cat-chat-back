import express, { request, response } from "express";
import { Server, Socket } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "https://cat-chat-front.vercel.app",
        methods: ["GET", "POST"]
    }
});


app.use(express.json());
app.get('/', (request, response)=>{
    response.status(200).end()
});
io.on('connection', (socket: Socket) => {
    console.log('a user connected', socket.id);
    socket.join('default');
    const room = io.sockets.adapter.rooms.get('default')
    if(room) {
        const ids = Array.from(room);
        io.emit('playerData', {id: ids[0], x: 300, y:300, input:"s"});
        io.emit('playerData', {id: ids[1], x: 600, y:300, input:"s"});
    }

    socket.on('disconnect', () => {
        console.log('Um cliente se desconectou');
    });
    socket.on('player', data =>{
        data.id = socket.id;
        const playerData = {
            id: socket.id,
            x: data.newX,
            y: data.newY,
            input: data.input
        }
        io.emit('playerData', playerData);
    });

    socket.on('message', data =>{
        data.id = socket.id;
        console.log(data)
        io.emit('messageData', data);
    });
});





server.listen(8080);