

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { findConversation , otherParticipantData , fetchMessages} from '../../components/messages/chatPage';
import API from '../../hooks/api';



let LOGGED_IN_USER_ID;

const ChatPage = () => {
  const { chatId } = useParams(); // conversationId from route
  const [selectedMessageId, setSelectedMessageId] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSender, setIsSender] = useState(true);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const [conversation, setConversation] = useState({});
  const [participant, setParticipant] = useState(null); // Initialize as null
  const [userId, setUserId] = useState();
  const [providerId, setProviderId] = useState();
  let storedRole = localStorage.getItem('ServicePro');
  let myRole, otherParticipantRole;
  const deletedFromEveryOneCode = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWQ2NzIzMWY4YzY4NDFiNDJkYTZmOSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU1NjE4MTEyLCJleHAiOjE3NTU2MjUzMTJ9.slG5POCid0m8amNxylkUdL3Bm7QpsXQigBndB9CVCgo";
  const token = localStorage.getItem('loginToken');
  

  
  if (!storedRole) {
    // No role in localStorage → default to user
    myRole = 'user';
    otherParticipantRole = 'servicepro';
  } else {
    // If ServicePro is found in localStorage
    myRole = 'servicepro';
    otherParticipantRole = 'user';
  }

  const SetConversation = (data)=>{
    setConversation(data);
  }

  
  const SetParticipants = (data)=>{
    setParticipant(data);
  }

  const SetMessages = (data)=>{
     setMessages(data);
  }

  const SetIsLoading = (data)=>{
    setIsLoading(data);
  }

  


  useEffect(() => {
    findConversation({token , chatId , SetConversation});
  }, [chatId]);


  useEffect(() => {
    if (conversation) {
        setUserId(conversation.userId);
        setProviderId(conversation.providerId);
        console.log('userId and providerId have been set from conversation');
    }
  }, [conversation]);



  useEffect(() => {
     otherParticipantData({otherParticipantRole, userId , providerId , SetParticipants});
  }, [userId, providerId]); // This effect runs when userId or providerId changes




  useEffect(() => {
    // Assign the correct ID to LOGGED_IN_USER_ID based on the user's role
    if (myRole === 'user' && userId) {
        LOGGED_IN_USER_ID = userId;
    } else if (myRole === 'servicepro' && providerId) {
        LOGGED_IN_USER_ID = providerId;
    }
    console.log("LOGGED_IN_USER_ID set to:", LOGGED_IN_USER_ID);
    // Fetch messages only after LOGGED_IN_USER_ID is set
   
    if (LOGGED_IN_USER_ID) {
        fetchMessages({chatId , LOGGED_IN_USER_ID , SetMessages , SetIsLoading});
    }

  }, [userId, providerId, myRole]);



  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Handles sending a new message.
   * Provides an optimistic UI update for a seamless user experience.
   * Reverts the change if the API call fails.  
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    // Ensure there's a message and a valid participant to send to
    if (!newMessage.trim() || !participant?._id) {
      console.log(newMessage ,participant )
      console.error("Cannot send message: Empty message or no participant selected.");
      return;
    }

    // Create a temporary message object for optimistic UI update
    const optimisticMessage = {
      _id: `optimistic-${Date.now()}`, // Unique temporary ID
      content: newMessage,
      senderId: LOGGED_IN_USER_ID,
    };

    // Update UI immediately
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    setIsSending(true);

    try {
      const token = localStorage.getItem("loginToken");
      if (!token) {
          throw new Error("Authentication token not found.");
      }

      // Determine if the recipient is a service provider
      const isParticipantProvider = participant.role === 'provider';

      // Set the correct endpoint and body based on the recipient's role
      const endpoint = isParticipantProvider
        ? "/user_message"
        : "/provider_message";

      const body = isParticipantProvider
        ? { providerId: participant._id, content: optimisticMessage.content }
        : { userId: participant._id, content: optimisticMessage.content };
        
        let savedMsg ;

        await API.post(endpoint, { body })
        .then((res)=>{
           savedMsg = res.data;  
        })
        .catch((err)=>{
        throw new Error(err?.message || "Message sending failed");
        })

        
      // try{ 
      //   const SenderId = (myRole==='user')? userId : providerId;
      //   const ReceiverId = (otherParticipantRole === 'user')? userId : providerId;
      //  // await Socket.emit('message' , {SenderId : SenderId , ReceiverId: ReceiverId})
      //   console.log('Sending message to server')
      // }
      // catch(err){
      //   console.log('Giving error in Broadcasting the message: ' , err)
      // }


      // Replace the optimistic message with the final message from the server
      setMessages(prev =>
        prev.map(msg => (msg._id === optimisticMessage._id ? savedMsg : msg))
      );

    } 
    catch (err) {
      console.error("Error sending message:", err);
      // If the API call fails, remove the optimistic message from the UI
      setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
      // Optional: You could restore the message to the input for the user to retry
      // setNewMessage(optimisticMessage.content);
    } 
    finally {
      setIsSending(false);
    }
  };


  const handleClickedMessage = (msg) => {
    const id = msg._id;
    msg.deletedForEveryone ?
      setIsSender(false) :
      setIsSender((msg.senderId === LOGGED_IN_USER_ID) && isSender)
    setSelectedMessageId(prev => [...prev, id]);
  };

  const handleDelete = async (deleteFromEveryone) => {
    if (!selectedMessageId.length) return;    
   
    try {
      const userId = LOGGED_IN_USER_ID;
      await API.put("/messages/deletedfor", { selectedMessageId, userId, deleteFromEveryone })
      .catch((err)=>{
        console.log(err.message || err);
        throw new Error("Failed to delete messages");
      })
      setSelectedMessageId([]);
      fetchMessages({chatId , LOGGED_IN_USER_ID , SetMessages , SetIsLoading}); // refresh after delete
    } 
    catch (error) {
      console.error("Delete failed:", error);
    }
  };



  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto my-8 font-sans border border-gray-200 rounded-lg overflow-hidden shadow-lg">
      <h1 className="p-3 border-b text-lg font-semibold text-center">
        {participant?.name || "Chat"}
      </h1>

      <div className="flex-grow p-5 overflow-y-auto bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            Loading conversation...
          </div>
        ) : (
          <>
            {messages.map(msg => {
              const isMyMessage = msg.senderId === LOGGED_IN_USER_ID;
              const deletedFromEvery = (deletedFromEveryOneCode === msg.content);
              return (
                <div
                  key={msg._id}
                  onClick={() => handleClickedMessage(msg)}
                  className={`flex mb-3 ${isMyMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`py-2 px-4 rounded-2xl max-w-[70%] break-words ${isMyMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                      }`}
                  >
                    {deletedFromEvery && isMyMessage && "You deleted this message"}
                    {deletedFromEvery && !isMyMessage && "This message was deleted"}
                    {!(deletedFromEvery) && msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form className="flex items-center p-3 border-t bg-white" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-full py-2 px-4 outline-none focus:border-blue-500"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSending || isLoading || !participant}
        />
        <button
          type="submit"
          className="ml-3 w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isSending || isLoading || !newMessage.trim() || !participant}
        >
          ➤
        </button>
      </form>

      {selectedMessageId.length > 0 && (
        <button onClick={() => handleDelete(false)}>Delete for me</button>
      )}

      {isSender && selectedMessageId.length > 0 && (
        <button onClick={() => handleDelete(true)}>Delete for Everyone</button>
      )}

    </div>
  );
};



export default ChatPage;



