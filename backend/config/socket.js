import dotenv from 'dotenv'
dotenv.config();
import {Server} from 'socket.io'

const ConnectionToServer = (server)=>{
  const io = new Server(server ,
    {
      cors:{origin: process.env.FRONTEND_URL}
    }
  )
  io.on('connection' , (socket)=>{
    console.log('A client with added with socket id:' , socket.id)

    socket.on('message',(msg)=>{
      console.log('messages recived to the server :' , msg );
      io.emit(msg); // broadcast it to everyone:::
    })

    socket.on("disconnect" , ()=>{
      console.log('user is disconnected with socket id : ',  socket.id);
    })
  })
}

export default ConnectionToServer;