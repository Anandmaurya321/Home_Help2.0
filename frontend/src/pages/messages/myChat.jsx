
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from '../../hooks/api'

const MyChat = () => {
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const fetchMyChats = async () => {
        try {
            const token = localStorage.getItem('loginToken');
            if (!token) {
                throw new Error("Authentication token not found.");
            }

            let data;
            API.post('/my_chats')
            .then((res)=>{
              data = res.data;
            })
            .catch((err)=>{
               throw new Error(`HTTP error!: ${err.message || err}`);
            })

            setChats(data); 
            console.log(data)
        } 
        catch (err) {
            setError(err.message);
            console.error("Failed to fetch chats:", err);
        }
        finally {
            setIsLoading(false); 
        }
    };


    useEffect(() => {
        fetchMyChats();
    }, []); // mount the function when it is render first time only:::

    
    if (isLoading) {
        return <div>Loading your conversations...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // if it is not loading && do not have any error also :: means we have data :: so lets render the data 
    // lets render the data

    return (
        <div className="chat-list-container">
            <h1>My Chats</h1>
            {chats.length > 0 ? (
                <ul>
                    {chats.map(chat => { // means we have some chat:::
                        // Determine the other participant based on their existence in the chat object
                        const otherParticipant = chat.user || chat.provider
                        localStorage.setItem('loginId', chat.userId ? chat.userId : chat.providerId)
                        return (
                            <li
                                key={chat._id}
                                onClick={() => navigate(`/chat/${chat._id}`, { state: { otherParticipant: otherParticipant } })}
                                style={{ padding: '10px', borderBottom: '1px solid #ccc', cursor: 'pointer' }}
                            >
                                <p><strong>Chat with: {otherParticipant?.name}</strong></p>
                                <p style={{ color: '#555' }}>
                                    {chat.messages.length > 0
                                        ? `Last message: ${chat.messages[chat.messages.length - 1].content}`
                                        : 'No messages yet.'}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div>You have no conversations yet.</div>
            )}
        </div>
    );
};

export default MyChat;



