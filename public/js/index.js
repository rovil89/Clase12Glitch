const socket = io();
// eso empieza a funcionar dsp que agregamos el script en home.handlebars (ya me muestra el "nuevo cliente conectado")

let username;

Swal.fire({
    title: 'Identificate',
    input: "text",
    text: "Ingresa tu nombre de usuario",
    inputValidator: (value) =>{
        return !value && "Es obligatorio introducir un nombre de usuario";
    },
    // inputValidator si no hay un valor, vamos a retornar un mensaje de error
    allowOutsideClick: false,
    // para que si o si ingrese un usuario y no escape de la ventana
}).then((result) =>{
    username = result.value;
    // el .then, username = result...son para que me mande por consola el nombre de usuario que puso en el sweetAlert

    socket.emit("new-user", username);
    // cuando se conecta uno nuevo, recibe los msj anteriores a q el se conecte
});

const chatInput = document.getElementById("chat-input");
chatInput.addEventListener("keyup", (ev) =>{
    if(ev.key ==="Enter"){ 
    const inputMessage = chatInput.value;
    
    // el KEYUP lo usamos para cuando escriban en el chat y apreten ENTER por consola me diga "apreto enter"

    if(inputMessage.trim().length > 0) {
        socket.emit("chat-message", { username, message: inputMessage});
        // esto es para evitar que envien mensajes vacios, y si no esta vacio envia "chat-message" con el usuario y su mensaje

        chatInput.value= "";
        // para que se borre el mensaje cuando envio
    }
    }
    
});

const messagesPanel = document.getElementById("messages-panel");
socket.on("messages", (data) => {
    // el "messages" debe ser igual al que ponemos en app.js
    console.log(data);
    let messages = "";
    // data nos da el array de mensajes
    data.forEach((m) => {
        messages += `<b>${m.username}:</b> ${m.message}</br>`;
    // genera un elemento html con todos los mensajes
    });

    messagesPanel.innerHTML = messages;
});

// El msj a mostrar cuando se conecta uno nuevo
socket.on("new-user", (username) => {
    Swal.fire({
        title: `${username} se ha unido al chat`,
        toast: true,
        position: "top-end"
    });
});