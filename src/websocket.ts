import { io } from "./http";

interface RoomUser {
    socket_id: string;
    username: string;
    room: string;
}
  
interface Message {
    room: string;
    text: string;
    createdAt: Date;
    username: string;
}

const users: RoomUser[] = [];
const messages: Message[] = [];

//Quando um usuario se conecta é criado um socket para ele
io.on('connection', (socket) => {
    
    // recebendo o evento select-room e retornando mensagens salvas ao usuario
    socket.on("select-room", (data, callback) => {

        // colocando o usuario em uma sala especifica (grupo)
        socket.join(data.room);

        // verificando se o usuario ja esta logado, se estiver mudamos apenas o socket.id
        const userInRoom = users.find(user => user.username === data.username && user.room === data.room);

        if(userInRoom) {
            userInRoom.socket_id = socket.id;
        }
        else {
            users.push({
                room: data.room,
                username: data.username,
                socket_id: socket.id
            });
        
        }
        
        const messagesRoom = getMessagesRoom(data.room);
        callback(messagesRoom);
    });

    // recebendo o evento message
    socket.on('message', (data) => {

        // pegando a mensagem para salvar no banco
        const message: Message = {
            room: data.room,
            username: data.username,
            text: data.message,
            createdAt: new Date(),
        };

        messages.push(message);

        // emitindo o evento mensagem para todos os usuarios na sala da mensagem
        io.to(data.room).emit('message', message)
    })
});

function getMessagesRoom(room: string) {
    const messagesRoom = messages.filter((message) => message.room === room);
    return messagesRoom;
}