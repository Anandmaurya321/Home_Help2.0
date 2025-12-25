import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  Search, 
  Clock, 
  ChevronRight, 
  User as UserIcon,
  Loader2,
  AlertCircle,
  Zap
} from "lucide-react";
import API from '../../hooks/api';

const MyChat = () => {
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    const fetchMyChats = async () => {
        try {
            const token = localStorage.getItem('loginToken');
            if (!token) throw new Error("Authentication token not found.");
            const res = await API.post('/my_chats');
            setChats(res.data);
        } 
        catch (err) {
            setError(err.message || "Failed to fetch chats");
        }
        finally {
            setIsLoading(false); 
        }
    };

    useEffect(() => {
        fetchMyChats();
    }, []);

    const filteredChats = chats.filter(chat => {
        const otherParticipant = chat.user || chat.provider;
        return otherParticipant?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-slate-400">
                <div className="relative">
                    <div className="absolute -inset-4 bg-indigo-500/20 blur-xl rounded-full animate-pulse"></div>
                    <Loader2 className="animate-spin text-indigo-500 relative" size={48} />
                </div>
                <p className="mt-6 font-bold tracking-widest uppercase text-xs">Syncing Encrypted Chats...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
                <div className="max-w-md w-full p-8 bg-[#0f172a] border border-red-500/20 rounded-[2rem] text-center shadow-2xl shadow-red-500/5">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={50} />
                    <h3 className="text-white font-black text-xl mb-2">Sync Error</h3>
                    <p className="text-slate-400 mb-8">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl font-black transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 pt-28 pb-20 px-4 selection:bg-indigo-500/30">
            {/* Background Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-indigo-600/10 blur-[120px] -z-10"></div>

            <div className="max-w-4xl mx-auto">
                
                {/* --- HEADER & SEARCH --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                            <Zap size={12} fill="currentColor" /> Secure Inbox
                        </span>
                        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">Messages</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Coordinate your service requests in real-time.</p>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Find a contact..." 
                            className="pl-12 pr-6 py-4 bg-[#0f172a] border border-slate-800 rounded-2xl w-full md:w-80 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-2xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* --- CHAT LIST --- */}
                <div className="bg-[#0f172a]/50 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
                    {filteredChats.length > 0 ? (
                        <div className="divide-y divide-slate-800/50">
                            {filteredChats.map(chat => {
                                const otherParticipant = chat.user || chat.provider;
                                const lastMsg = chat.messages[chat.messages.length - 1];
                                
                                return (
                                    <div
                                        key={chat._id}
                                        onClick={() => {
                                            localStorage.setItem('loginId', chat.userId ? chat.userId : chat.providerId);
                                            navigate(`/chat/${chat._id}`, { state: { otherParticipant } });
                                        }}
                                        className="group flex items-center gap-5 p-6 hover:bg-indigo-500/5 cursor-pointer transition-all relative overflow-hidden active:scale-[0.99]"
                                    >
                                        {/* Hover Glow Effect */}
                                        <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></div>

                                        {/* Avatar Icon */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                                {otherParticipant?.name?.charAt(0).toUpperCase() || <UserIcon />}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-[3px] border-[#0f172a] rounded-full"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-black text-lg text-white truncate group-hover:text-indigo-400 transition-colors">
                                                    {otherParticipant?.name}
                                                </h3>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                                                    <Clock size={12} className="text-indigo-500" /> {lastMsg ? 'Active' : 'New'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400 truncate font-medium group-hover:text-slate-300 transition-colors">
                                                {lastMsg ? (
                                                    <span className="flex items-center gap-2">
                                                        {lastMsg.senderId === localStorage.getItem('loginId') && <span className="text-indigo-500 font-bold italic">You:</span>}
                                                        {lastMsg.content}
                                                    </span>
                                                ) : (
                                                    "Click to start the conversation"
                                                )}
                                            </p>
                                        </div>

                                        {/* Action Icon */}
                                        <div className="text-slate-700 group-hover:text-indigo-500 transition-all group-hover:translate-x-1">
                                            <ChevronRight size={28} strokeWidth={3} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-24 h-24 bg-[#1e293b] rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600 relative">
                                <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full animate-pulse"></div>
                                <MessageSquare size={40} />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">No Active Transmissions</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mb-8">Your conversation history is currently empty. Reach out to a provider to begin.</p>
                            <button 
                                onClick={() => navigate('/allservice')}
                                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                            >
                                Browse Services
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom Metadata */}
                <div className="mt-12 flex items-center justify-center gap-6 opacity-30 grayscale group">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                         E2E Encrypted
                    </div>
                    <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                         MERN Protocol 2.0
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyChat;