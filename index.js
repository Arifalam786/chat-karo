const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const { Socket } = require("engine.io");
const { default: mongoose } = require("mongoose");
const DB = 'mongodb+srv://arifalam:1234567890@cluster0.sgibskl.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(DB).then(() => {
    console.log(`connection successsful`);
}).catch((err) => console.log(`no connection`));

// ...........................................................


//...................................................................



const app = express();
const port = 1000; // port address


const users = [{}];


app.use(cors());
app.get("/", (req, res) => {
    res.send("hell its working")
})


const server = http.createServer(app); // for starting the server


const io = socketIO(server); // for server
io.on("connection", (socket) => {
    console.log("new connection");
    socket.on('joined', ({ user }) => {
        users[socket.id] = user;
        console.log(`${user} has joined`)
        socket.broadcast.emit('userJoined', { user: "Admin", message: `${users[socket.id]} has joined` })
        socket.emit('welcome', { user: "Admin", message: `Welcome to the chat ${users[socket.id]}` });
    })
    socket.on(`message`, ({ message, id }) => {
        io.emit('sendMessage', { user: users[id], message, id })

    })
    socket.on(`disconnect`, () => {
        socket.broadcast.emit('leave', { user: "Admin", message: `${users[socket.id]} has left` });
        console.log("User left");
    })
});
server.listen(port, () => {
    console.log(`server is working on http://localhost:${port}`) //reaching to the port
})