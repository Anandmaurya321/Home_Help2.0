

import express from 'express' ;

import Conversation from '../../model/conversation.js'; 
import Message from '../../model/message.js' 


 const User_message=  async (req, res) => {
  // whome to send and the message ::
  const { providerId, content } = req.body;

  // The sender's ID comes securely from the authentication middleware.
  const userId = req.user.id;         // req.user = decoded;
  const role = req.user.role;
  console.log(userId , role)
  
  // Basic validation to ensure we have the necessary data.
  if (!providerId || !content) {
    return res.status(400).json({ msg: 'Provider ID and content are required.' });
  }

   try {
    // 2. --- Find an Existing Conversation ---
    let conversation = await Conversation.findOne({
      userId: userId,
      providerId: providerId,
    });

    // 3. --- If No Conversation Exists, Prepare a New One (in memory) ---
    if (!conversation) {
      // Create the conversation object, but DON'T save it yet.
      // It only exists in our code for now, not in the database.
      conversation = new Conversation({
        userId: userId,
        providerId: providerId,
      });
    }

    // 4. --- Create the New Message ---
    // At this point, `conversation` is either an existing document from the DB
    // or a new one we just prepared. Either way, it has an `_id`.
    const newMessage = new Message({
      conversationId: conversation._id,
      senderId: userId,
      content: content,
    });
    
    // Save the message to the database.
    await newMessage.save();

    // 5. --- Update and Save the Conversation (Just Once) ---
    // Now, we update the status and save the conversation.
    // This single `.save()` handles BOTH creating the new conversation
    // and updating the existing one. It's more efficient.
    conversation.status = 'awaiting_provider_response';
    await conversation.save();

    // 6. --- Real-time Update & Response ---
    // TODO: Add Socket.IO logic here.
    res.status(201).json(newMessage);

  } catch (err) {
    console.error('Error in /message route:', err.message);
    res.status(500).json({'error':'Server Error'});
  }

};

export default User_message;

