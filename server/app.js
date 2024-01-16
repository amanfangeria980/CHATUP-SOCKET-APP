import express from 'express'
import dotenv from 'dotenv'
import { Server } from 'socket.io';
dotenv.config();
import { createServer } from 'http';
import cors from 'cors'
import jwt from 'jsonwebtoken'; 
import cookieParser from 'cookie-parser';

const app=express();
const port=process.env.PORT || 3000;
const secretKeyJWT="afjsfdasklklafklj"

// Initialisation of socket
const server=createServer(app);
const io=new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET","POST"],
        credentials: true
    }
})


app.get("/",(req,res)=>{
    res.send("Hello World!")
})

app.get("/login",(req,res)=>{
    const token=jwt.sign({_id:"asdfdfallkdlkfkl"},secretKeyJWT)
    res.cookie("token",token,{httpOnly: true,secure: true,sameSite:"none"}).json({
        message: "Login Success"
    })
})

// Socket middlware
// Go to localhost:3000/login and token is stored in the cookie then hit localhost:5173 for the client socket to be connected to the circuit 
// io.use((socket,next)=>{
//     cookieParser()(socket.request,socket.request.res,(err)=>{
//         if(err)return next(err);
//         const token=socket.request.cookies.token;
//         if(!token)return next(new Error("Authentication Error"))
//         const decoded=jwt.verify(token,secretKeyJWT);
//         next();
//     })
// })

// Events
io.on("connection", (socket) => {
    console.log("User Connected",socket.id);
    
    // socket.emit('welcome','Welcome to the server')
    // socket.broadcast.emit('welcome',socket.id+" joined the server.")
    socket.on('disconnect',()=>{
        console.log("User Disconnected", socket.id)
    })

    socket.on("message",({room,message})=>{
        // console.log(data);
        if(room===""){
            // io.emit("receive-message",message);
            socket.broadcast.emit("receive-message",message);

        }
        else{
            // can use io.to or socket.to here as we are sending to message from one individualt to another(one to one private messge)
            socket.to(room).emit("receive-message",message);
        }
    })

    socket.on("join-room",(room)=>{
        socket.join(room);
        console.log(`User ${socket.id} joined the room ${room}`);
    })
});

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
