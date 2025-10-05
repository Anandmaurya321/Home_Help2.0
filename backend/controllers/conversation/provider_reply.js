


import Conversation from '../../model/conversation.js' 
import Message from '../../model/message.js' 


 const Provider_message=  async (req, res) => {
  
  // whome to send and the message ::
  const { userId, content } = req.body;

  const provider_Id = req.user.id; // already set during token verifiaction ::>>
  const role = req.user.role;
  
  // Basic validation to ensure we have the necessary data.
  if (!userId || !content) {
    return res.status(400).json({ msg: 'Provider ID and content are required.' });
  }

   try {
    // 2. --- Find an Existing Conversation ---
    let conversation = await Conversation.findOne({
      userId: userId,
      providerId: provider_Id,
    });

    // 3. --- If No Conversation Exists, Prepare a New One (in memory) ---
    if (!conversation) {
      conversation = new Conversation({
        userId: userId,
        providerId: provider_Id,
      });
    }

    
    const newMessage = new Message({
      conversationId: conversation._id,
      senderId: provider_Id,
      content: content,
    });
    
    // Save the message to the database.
    await newMessage.save();

   
    conversation.status = 'awaiting_user_response';
    await conversation.save();

    // 6. --- Real-time Update & Response ---
    // TODO: Add Socket.IO logic here.
    res.status(201).json(newMessage);

  } 
  catch (err) {
    console.error('Error in /message route:', err.message);
    res.status(500).json({'error':'Server Error'});
  }

};

export default Provider_message;


