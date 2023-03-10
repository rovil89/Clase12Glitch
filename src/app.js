import express from "express";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";

const app = express();
const messages =[]
// guarda los msj

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/../public"));

app.use("/", viewsRouter);

const httpServer = app.listen(8080, ()=> {
    console.log("Server listening on port 8080");
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
    socket.on("chat-message", (data) => {
        messages.push(data);
        // messeges.push(data) guarda los mensajes en un array []
        console.log(messages);
        // cuando se recibe un nuevo msj del chat, ejecuta el callback con el mensaje y el usuario

        io.emit("messages", messages);
        // todos los msj se envian actualizados a todos los clientes
    });

    socket.on("new-user", (username) => {
        socket.emit("messages", messages);
        // cuando un usuario se autentica se envian los logs
        
        socket.broadcast.emit("new-user", username)
        //cuando un usuario se conecta, avisa al resto que se conecto

        
    })
});