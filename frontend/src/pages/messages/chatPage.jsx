import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Trash2, 
  ChevronLeft, 
  MoreVertical, 
  User as UserIcon, 
  CheckCheck,
  Info,
  X
} from 'lucide-react';

import { findConversation, otherParticipantData, fetchMessages } from '../../components/messages/chatPage';
import API from '../../hooks/api';

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [selectedMessageId, setSelectedMessageId] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const longPressTimer = useRef(null); // Ref for long-press timer
  
  const [conversation, setConversation] = useState({});
  const [participant, setParticipant] = useState(null);
  const [userId, setUserId] = useState();
  const [providerId, setProviderId] = useState();

  const deletedFromEveryOneCode = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWQ2NzIzMWY4YzY4NDFiNDJkYTZmOSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU1NjE4MTEyLCJleHAiOjE3NTU2MjUzMTJ9.slG5POCid0m8amNxylkUdL3Bm7QpsXQigBndB9CVCgo";
  const token = localStorage.getItem('loginToken');
  const storedRole = localStorage.getItem('ServicePro');

  const myRole = !storedRole ? 'user' : 'servicepro';
  const LOGGED_IN_USER_ID = myRole === 'user' ? userId : providerId;

  // --- Logic Helpers ---
  useEffect(() => { findConversation({ token, chatId, SetConversation: setConversation }); }, [chatId]);
  useEffect(() => { if (conversation) { setUserId(conversation.userId); setProviderId(conversation.providerId); } }, [conversation]);
  useEffect(() => { otherParticipantData({ otherParticipantRole: !storedRole ? 'servicepro' : 'user', userId, providerId, SetParticipants: setParticipant }); }, [userId, providerId]);

  useEffect(() => {
    if (LOGGED_IN_USER_ID) {
      fetchMessages({ chatId, LOGGED_IN_USER_ID, SetMessages: setMessages, SetIsLoading: setIsLoading });
    }
  }, [userId, providerId, myRole]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // --- Selection Logic ---
  const toggleSelection = (msg) => {
    const id = msg._id;
    setSelectedMessageId(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  // WhatsApp Model: Delete for everyone only if ALL selected messages are MINE
  const canDeleteForEveryone = selectedMessageId.length > 0 && selectedMessageId.every(id => {
    const msg = messages.find(m => m._id === id);
    return msg?.senderId === LOGGED_IN_USER_ID && msg?.content !== deletedFromEveryOneCode;
  });

  // --- Gesture Handlers ---
  const handleTouchStart = (msg) => {
    longPressTimer.current = setTimeout(() => {
      toggleSelection(msg);
      if (window.navigator.vibrate) window.navigator.vibrate(50); // Haptic feedback
    }, 600); // 600ms for long press
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !participant?._id) return;
    const content = newMessage;
    setNewMessage('');
    setIsSending(true);

    try {
      const isParticipantProvider = participant.role === 'provider';
      const endpoint = isParticipantProvider ? "/user_message" : "/provider_message";
      const body = isParticipantProvider 
        ? { providerId: participant._id, content }
        : { userId: participant._id, content };

      await API.post(endpoint, body);
      fetchMessages({ chatId, LOGGED_IN_USER_ID, SetMessages: setMessages, SetIsLoading: (v) => {} });
    } catch (err) {
      console.error("Send failed");
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (deleteFromEveryone) => {
    try {
      await API.put("/messages/deletedfor", { selectedMessageId, userId: LOGGED_IN_USER_ID, deleteFromEveryone });
      setSelectedMessageId([]);
      fetchMessages({ chatId, LOGGED_IN_USER_ID, SetMessages: setMessages, SetIsLoading: setIsLoading });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-[#efeae2] lg:border-x border-slate-200">
      
      {/* --- HEADER --- */}
      <header className={`flex items-center justify-between px-4 py-3 sticky top-0 z-20 transition-colors duration-300 ${
        selectedMessageId.length > 0 ? "bg-indigo-700 text-white" : "bg-white text-slate-900 border-b"
      }`}>
        <div className="flex items-center gap-3">
          {selectedMessageId.length > 0 ? (
            <button onClick={() => setSelectedMessageId([])} className="p-2 hover:bg-white/10 rounded-full transition">
              <X size={24} />
            </button>
          ) : (
            <button onClick={() => navigate('/chat')} className="p-2 hover:bg-slate-100 rounded-full transition">
              <ChevronLeft size={24} className="text-slate-600" />
            </button>
          )}
          
          <div className="flex items-center gap-3">
            {selectedMessageId.length > 0 ? (
              <span className="text-xl font-medium">{selectedMessageId.length}</span>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {participant?.name?.charAt(0).toUpperCase() || <UserIcon size={20} />}
                </div>
                <div>
                  <h2 className="font-bold leading-tight">{participant?.name || "Loading..."}</h2>
                  {/* <p className="text-[11px] text-green-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                  </p> */}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {selectedMessageId.length > 0 ? (
            <>
              <button onClick={() => handleDelete(false)} title="Delete for me" className="p-2 hover:bg-white/10 rounded-full">
                <Trash2 size={20} />
              </button>
              {canDeleteForEveryone && (
                <button 
                  onClick={() => handleDelete(true)} 
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-black bg-white/20 rounded-lg hover:bg-white/30"
                >
                  DELETE FOR EVERYONE
                </button>
              )}
            </>
          ) : (
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <MoreVertical size={20} />
            </button>
          )}
        </div>
      </header>

      {/* --- CHAT AREA --- */}
      <main className="flex-grow overflow-y-auto p-4 space-y-2 pb-10 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isMyMessage = msg.senderId === LOGGED_IN_USER_ID;
              const isDeleted = msg.content === deletedFromEveryOneCode;
              const isSelected = selectedMessageId.includes(msg._id);

              return (
                <div 
                  key={msg._id} 
                  onDoubleClick={() => toggleSelection(msg)}
                  onTouchStart={() => handleTouchStart(msg)}
                  onTouchEnd={handleTouchEnd}
                  className={`flex w-full ${isMyMessage ? "justify-end" : "justify-start"} transition-colors duration-200 ${
                    isSelected ? "bg-indigo-500/20" : ""
                  }`}
                >
                  <div className={`relative max-w-[85%] px-3 py-1.5 rounded-lg shadow-sm mb-1 group transition-transform active:scale-[0.98] ${
                    isMyMessage 
                      ? "bg-[#d9fdd3] text-slate-800 rounded-tr-none" 
                      : "bg-white text-slate-800 rounded-tl-none"
                  } ${isSelected ? 'ring-1 ring-indigo-400' : ''}`}>
                    
                    {isDeleted ? (
                      <p className="text-[13px] italic text-slate-400 flex items-center gap-2">
                        <Info size={14} /> {isMyMessage ? "You deleted this message" : "This message was deleted"}
                      </p>
                    ) : (
                      <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}
                    
                    <div className="flex items-center justify-end gap-1 mt-1 opacity-50 text-[9px]">
                      <span>{new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMyMessage && <CheckCheck size={12} className={msg.read ? "text-blue-500" : ""} />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </main>

      {/* --- INPUT BAR --- */}
      <footer className="p-3 bg-[#f0f2f5] border-t">
        <form className="flex items-center gap-2 max-w-4xl mx-auto" onSubmit={handleSendMessage}>
          <div className="flex-grow">
            <input
              type="text"
              className="w-full bg-white border-none rounded-full py-3 px-5 text-[15px] focus:ring-0 outline-none shadow-sm"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isSending || isLoading || !participant}
            />
          </div>
          <button
            type="submit"
            className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-slate-400 transition-all active:scale-90 shadow-md"
            disabled={isSending || !newMessage.trim()}
          >
            <Send size={20} fill="currentColor" />
          </button>
        </form>
      </footer >
    </div>
  );
};

export default ChatPage;