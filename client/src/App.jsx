import { useEffect, useMemo, useState } from 'react'
import {io} from 'socket.io-client'
import {Container, Typography, TextField, Button, Box, Stack} from '@mui/material'
const App = () => {
  // Initialisation of socket
  const socket = useMemo(()=>{
    return io(import.meta.env.VITE_BACKEND_URL,{
      withCredentials:true,
      transports : ['websocket']
    })
  },[]);

  const [message,setMessage]=useState("");
  const [room,setRoom]=useState("");
  const [socketID,setSocketID]=useState("");
  const [messages,setMessages]=useState([]);
  const[roomName,setRoomName]=useState("");
  const handleSumbit=(e)=>{
    e.preventDefault();
    socket.emit("message",{message,room});
    setMessage("");
    setRoom("");
  }

  const joinRoomHandler=(e)=>{
    e.preventDefault();
    socket.emit("join-room",roomName);
    setRoomName("")
  }

  // console.log(messages);

  useEffect(()=>{

    // Events
    socket.on("connect",()=>{
      console.log("connected",socket.id)
      setSocketID(socket.id);
    })
    socket.on('welcome',(msg)=>{
      console.log(msg);     
    })
    socket.on("receive-message",(data)=>{
      console.log(data);
      setMessages((messages)=>[...messages,data]);
    })
    return()=>{
      socket.disconnect();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <Container>
      <Box sx={{height: 100}}/>
      <Typography variant="h3" component="div" gutterBottom>
        Welcome to ChatUp
      </Typography>
      <Typography variant="h5" component="div" gutterBottom>
        {socketID}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        
        <TextField
          id="outined-basic"
          label="Room Name" value={roomName} onChange={(e)=>setRoomName(e.target.value)}
        />

        <Button variant="contained" color="primary" type='submit'>
          Join
        </Button>
      </form>


      <form onSubmit={handleSumbit}>
        <TextField
          id="outined-basic"
          label="Message" value={message} onChange={(e)=>setMessage(e.target.value)}
        />
        <TextField
          id="outined-basic"
          label="Room" value={room} onChange={(e)=>setRoom(e.target.value)}
        />
        <Button variant="contained" color="primary" type='submit'>
          Send
        </Button>
      </form>

      <Stack>
      {
        messages.map((msg,i)=>{
          return <Typography key={i} variant="h6" component="div" gutterBottom>
            {msg}
        </Typography>
        })
      }
      </Stack>
    </Container>
  )
}

export default App
