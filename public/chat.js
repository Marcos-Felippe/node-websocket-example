// usuario se conecta ao socket
const socket = io();

// emit - emitir alguma informação
// on - escutando alguma informação

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get('username');
const room = urlSearch.get('select-room');

const usernameDiv = document.getElementById("top-welcome");
usernameDiv.innerHTML = `Olá <strong>${username}</strong> - Você está na sala <strong>${room}</strong>`;

// emitindo um evento ao socket e recebendo as mensagens retornadas
socket.emit("select-room", {
    username,
    room
}, (messages) => {
    messages.forEach((message) => createMessage(message));
});

// pegando as mensagens escritas
document.getElementById('message-input').addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        const message = event.target.value;

        const data = {
            room,
            message,
            username
        }
      
        // emitindo o evento message
        socket.emit("message", data);
      
        
        event.target.value = "";
    }
});

// recebendo o evento message vindo do servidor
socket.on('message', data => {
    createMessage(data);
})

// criando uma mensagem
function createMessage(data) {
    const messageDiv = document.getElementById('messages');

    messageDiv.innerHTML += `
    
        <div class="new-message">
            <label class="form-label">
                <span><strong>${data.username}: </strong> ${data.text}
                <br><span id="date">${dayjs(data.createdAt).format('DD/MM HH:mm')}</span></span>
            </label>
        </div>
    
    `;
};

// fazendo logout
document.getElementById("logout").addEventListener("click", (event) => {
    window.location.href = "index.html";
})