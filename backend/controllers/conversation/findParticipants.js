
import Conversation from '../../model/conversation.js'

const FindParticipant = async (req, res) => {
    
    const convId = req.params.id;

    if (!convId) {
        return res.status(400).json({ error: "Conversation ID is required" });
    }

    try {
        const conversation = await Conversation.findById(convId);

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        res.status(200).json(conversation);
    }
    catch (err) {
        console.error('Error finding conversation:', err);
        res.status(500).json({ error: "Internal server error" });
    } 
    finally {
        console.log('Participant API was called');
    }
};

export default FindParticipant

