const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const myServer = http.createServer(app);
const cors = require("cors");
const { connectDB } = require("./config/mongo_connection");
const UserRouter = require("./routes/UserRoute");
const ChatRoute = require("./routes/ChatRoute");
const MessgeRoute = require("./routes/MessageRoute");
const path = require("path");
dotenv.config({path : path.join(__dirname+"../.env")});
const PORT = process.env.PORT || 5000;

app.use(cors());
connectDB();
app.use(express.json());
app.get("/api", (req, res) => {
  res.send("Hello, There");
});
app.use("/api", UserRouter);
app.use("/api/chat", ChatRoute);
app.use("/api/message", MessgeRoute);

// app.use("*", (req, res) => {
//   res.send("Invalid Route");
// });

app.use(express.static(path.join(__dirname,"../frontend/build")))
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend/build/index.html"))
})



const server = myServer.listen(PORT, () => {
  console.log("Server Running : " + PORT);
});
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
    console.log("Connection");
    
    socket.on("join",(userId)=>{
        socket.join(userId);
        socket.emit("connected")
    })
    socket.on("chat-join",(chatId)=>{
        socket.join(chatId);
        console.log("User Join on : ",chatId);
    })
    socket.on("new-message",(newMessageData)=>{
        newMessageData.chat.users.forEach((user)=>{
            if(user._id !== newMessageData.sender._id){
                socket.in(user._id).emit("Recieved Message", newMessageData);
            }
        })
    })


});
