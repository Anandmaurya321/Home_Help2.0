

import Message from '../../model/message.js';

/**
 * Fetches all messages for a given conversationId.
 */

const ConversationFind = async (req, res) => {
  try {
    const { conversationId, userId } = req.body;
    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" });
    }

    const messages = await Message.find({
      conversationId,
      deletedFor: { $ne: userId } // exclude if user specifically deleted
    }).sort({ createdAt: 1 });

    const randomCode = process.env.RANDOM_CODE || "env is not working"
    
    const updatedMessages = messages.map((msg) => {
      if (msg.deletedForEveryone) {
        return {
          ...msg.toObject(),
          content: randomCode
        };
      }
      return msg;
    });

    res.status(200).json(updatedMessages);
  } catch (error) {
    console.error("Error in finding conversation using ConversationId", error);
    res.status(500).json({ message: "Server error while fetching chats." });
  }
};

export default ConversationFind;



