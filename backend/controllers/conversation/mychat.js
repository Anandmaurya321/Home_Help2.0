
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

import Conversation from '../../model/conversation.js'
import Message from '../../model/message.js'

/**
 * Fetches all conversations for the logged-in user based on their role.
 */

const getMyChats = async (req, res) => {
  try {
    const { id, role } = req.user;  // set during token verification :::>>>>

    let query = {};
    let populateField = '';

    if (role.toLowerCase() === 'user') {
      query = { userId: id };
      populateField = 'providerId';
    } else if (role.toLowerCase() === 'provider') {
      query = { providerId: id };
      populateField = 'userId';
    } else {
      return res.status(403).json({ message: "Invalid role for this action." });
    }

    let conversations = await Conversation.find(query)
      .populate(populateField, 'name email profilePicture')
      .sort({ updatedAt: -1 });

    if (!conversations || conversations.length === 0) {
      return res.status(200).json([]);
    }

    const chats = await Promise.all(
      conversations.map(async (convo) => {
        const messages = await Message.find({ conversationId: convo._id })
          .sort({ createdAt: 'asc' });

        let convoObj = convo.toObject();

        if (role.toLowerCase() === 'user') {
          convoObj.provider = convoObj.providerId;
          delete convoObj.providerId;
        } else {
          convoObj.user = convoObj.userId;
          delete convoObj.userId;
        }

        // Filter out messages deleted for this user
        const filteredMessages = messages.filter(
          (msg) => !msg.deletedFor?.includes(id)
        );

        return { ...convoObj, messages: filteredMessages };
      })
    );
    console.log(chats)
    res.status(200).json(chats);
  } 
  catch (error) {
    console.error("Error in getMyChats controller:", error);
    res.status(500).json({ message: "Server error while fetching chats." });
  }
};


export default getMyChats;
