
import express from 'express'
const route = express.Router();
import verifyToken from './../middleware/authmiddleware.js'


import deletedfor from './../controllers/conversation/deletedfor.js'
import findConversation from './../controllers/conversation/findConversation.js'
import findParticipants from './../controllers/conversation/findParticipants.js'
import myChat from './../controllers/conversation/mychat.js'
import providerReply from './../controllers/conversation/provider_reply.js'
import userMessage from './../controllers/conversation/user_message.js'


route.post('/user_message' , verifyToken , userMessage)
route.post('/provider_message' , verifyToken , providerReply)
route.post('/my_chats' , verifyToken , myChat)
route.put('/messages/deletedfor' , verifyToken , deletedfor)
route.post('/messages/findConversation' , verifyToken , findConversation)
route.get('/messages/findParticipant/:id' , verifyToken , findParticipants)

export default route