
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../../hooks/api';

const Chat = () => {
  const location = useLocation();
  const { providerId } = location.state || {};

  // State for the new message input
  const [newMessage, setNewMessage] = useState('');

  // State to hold the messages shown on this screen (will only be the one we send)
  const [messages, setMessages] = useState([]);

  // State for loading and error handling
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  // Ref for auto-scrolling to the bottom
  const messagesEndRef = useRef(null);

  // --- Auto-scrolling Effect ---
  // Scrolls to the bottom whenever a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Function to Send a New Message ---
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!providerId || !newMessage.trim()) {
      return;
    }

    setIsSending(true);
    setError(null); // Clear any previous errors

    try {
      const res = await API.post('/user_message', { providerId, content: newMessage });

      // On success, add the message returned from the server to our local display
      setMessages(prevMessages => [...prevMessages, res.data]);

      setNewMessage(''); // Clear the input field

    } catch (err) {
      console.error("Error sending message:", err);
      setError('Failed to send message. Please try again.'); // Set a user-friendly error message
    } finally {
      setIsSending(false); // Re-enable the form
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto my-8 font-sans border border-gray-200 rounded-lg overflow-hidden shadow-lg">

      {/* --- Messages Area --- */}
      <div className="flex-grow p-5 overflow-y-auto bg-gray-50">
        {!providerId ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            Cannot start a conversation. No provider selected.
          </div>
        ) : (
          <>
            {/* --- NEW: Informational Note --- */}
            {/* This note only shows when no messages have been sent on this page yet */}
            {messages.length === 0 && (
              <div className="text-center p-4 mb-4 text-sm text-gray-500 bg-gray-100 rounded-lg">
                <p className="font-semibold">You're starting a new conversation! 💬</p>
                <p className="mt-1">
                  If you've chatted before, your full history is in the <strong>Messages</strong> tab.
                </p>
              </div>
            )}

            {/* Map over the locally stored messages array */}
            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className="flex mb-3 justify-end"
              >
                <div className="py-2 px-4 rounded-2xl max-w-[70%] break-words bg-blue-500 text-white rounded-tr-md">
                  {msg.content}
                </div>
              </div>
            ))}
            {/* This empty div is the target for our auto-scroll */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* --- Error Display --- */}
      {error && (
        <div className="p-2 text-center text-red-600 bg-red-100 border-t border-gray-200">
          {error}
        </div>
      )}

      {/* --- Message Input Form --- */}
      <form className="flex items-center p-3 border-t border-gray-200 bg-white" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-full py-2 px-4 text-base outline-none focus:border-blue-500 transition-colors duration-200"
          placeholder={providerId ? "Type your first message..." : "Cannot send messages"}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSending || !providerId}
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


// Thanku:::>>>>