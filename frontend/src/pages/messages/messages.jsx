

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../../hooks/api'

const Chat = () => {
  const location = useLocation();
  const { providerId } = location.state || {};

  // State for messages, now starts empty
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Separate loading states for fetching history and sending a new message
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);

   const fetchChatHistory = async () => {
      if (!providerId) {
        console.error("No providerId found. Cannot fetch chat history.");
        setIsHistoryLoading(false);
        return;
      }

      setIsHistoryLoading(true);
      
      try {
        const token = localStorage.getItem('loginToken');
        
        // **TODO: UNCOMMENT AND REPLACE WITH YOUR REAL API ENDPOINT**
        // The endpoint should likely accept the providerId to fetch the correct conversation.
        /*
        const res = await fetch(`http://localhost:5000/api/messages/${providerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch chat history');
        }

        const data = await res.json();
        // Assuming the API returns an object like { messages: [...] }
        setChatHistory(data.messages || []); 
        */

      }
       catch (err) {
        console.error("Error fetching chat history:", err);
        // Optionally set an error state to show in the UI
      } 
      finally {
        setIsHistoryLoading(false);
      }
    };

  // --- Effect to Fetch Chat History ---
  useEffect(() => {
    fetchChatHistory();
  }, [providerId]);  //Re-fetch when the providerId changes

  // --- Auto-scrolling Effect ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // --- Function to Send a New Message ---     
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!providerId || !newMessage.trim()) {
      return;
    }

    const optimisticMessage = {
      id: Date.now(), // Temporary client-side ID
      content: newMessage,
      sender: 'user', // Assumes the sender is the current user
    };

    // Optimistically update the UI
    setChatHistory(prevHistory => [...prevHistory, optimisticMessage]);
    setNewMessage('');
    setIsSending(true);

    try {
        let sentMessageFromServer;
        await API.post('/user_message', { providerId , content: newMessage })
        .then((res)=>{
            sentMessageFromServer = res.data;
        })
        .catch((err)=>{
          throw new Error(`Failed to send message ${err.message || "--"}`);
        })

      // Replace the optimistic message with the real one from the server
      setChatHistory(prevHistory => 
        prevHistory.map(msg => 
          msg.id === optimisticMessage.id ? sentMessageFromServer : msg
        )
      );
    }
    catch (err) {
      console.error("Error sending message:", err);
      // Revert the optimistic update on failure
      setChatHistory(prevHistory => prevHistory.filter(msg => msg.id !== optimisticMessage.id));
      // Optionally, show an error icon on the failed message in the UI
    } 
    finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto my-8 font-sans border border-gray-200 rounded-lg overflow-hidden shadow-lg">
      
      {/* Messages Area */}
      <div className="flex-grow p-5 overflow-y-auto bg-gray-50">
        {isHistoryLoading ? (
          <div className="flex justify-center items-center h-full text-gray-500">Loading messages...</div>
        ) : !providerId ? (
          <div className="flex justify-center items-center h-full text-gray-500">Select a conversation to begin.</div>
        ) : (
          <>
            {chatHistory.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`py-2 px-4 rounded-2xl max-w-[70%] break-words ${
                      isUser 
                        ? 'bg-blue-500 text-white rounded-tr-md' 
                        : 'bg-gray-200 text-black rounded-tl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input Form */}
      <form className="flex items-center p-3 border-t border-gray-200 bg-white" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-full py-2 px-4 text-base outline-none focus:border-blue-500 transition-colors duration-200"
          placeholder={providerId ? "Type a message..." : "Cannot send messages"}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSending || !providerId || isHistoryLoading}
        />
        <button 
          type="submit" 
          className="ml-3 w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white cursor-pointer transition-colors duration-200 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed" 
          disabled={isSending || !newMessage.trim() || !providerId}
        >
          {/* Send Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;




