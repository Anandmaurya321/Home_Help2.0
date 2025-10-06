
import React from "react";
import API from '../../hooks/api'


  const findConversation = async ({token, chatId , SetConversation}) => {   /// funtion for find conversation :::>>>
    try {
        if (!token) {
        console.log("loginToken is not present in localStorage");
        return;
       }
      let data
        await API.get(`/messages/findParticipant/${chatId}`)
        .then((res)=>{
            data = res.data;
            SetConversation(data);  
            console.log("Conversation data:", data);  
        })
        .catch((err)=>{
            console.error(`Request failed:` , err.message || "--");
            SetConversation({});   
        })
    } 
    catch (err) {
      console.log('Error in finding participant ', err.message || "--");
    }
  };



    const otherParticipantData = async ({otherParticipantRole, userId , providerId , SetParticipants}) => {  // funtion for getting the otherParticipant data 
    // Ensure we have an ID to fetch
    const targetId = otherParticipantRole === 'user' ? userId : providerId;
    if (!targetId) {
        return;
    }

    try {
        const endpoint = otherParticipantRole === 'user'
            ? `/user/${targetId}`
            : `/servicepro/${targetId}`;
            
            let data;
            await API.get(endpoint)
            .then((res)=>{
                data = res.data;
                console.log('Other participant data:', data);
                SetParticipants(data);
            })
            .catch((err)=>{
                console.error(`Request failed:` , err.message || err);
                SetParticipants({});
            })  
    } 
    catch (err) {
        console.log('Error fetching participant data:', err);
        SetParticipants({});
    }
  };
  

   
  // Fetch messages :: // fetching messages of user and other participant messages::>>>
  const fetchMessages = async ({chatId , LOGGED_IN_USER_ID , SetMessages , SetIsLoading}) => {
    if (!chatId || !LOGGED_IN_USER_ID) return;
    SetIsLoading(true);

    try {
      let data;
        await API.post("/messages/findConversation", {conversationId: chatId, userId: LOGGED_IN_USER_ID})
        .then((res)=>{
            data = res.data;
        })
        .catch((err)=>{
             throw new Error(`Failed to fetch messages ${err.message || "--"}`);
        })

      console.log("Fetched messages:", data);
      SetMessages(data || []);
    } 
    catch (error) {
      console.error("Error fetching messages:", error);
    } 
    finally {
      SetIsLoading(false);
    }
  };




export {findConversation, otherParticipantData , fetchMessages}



