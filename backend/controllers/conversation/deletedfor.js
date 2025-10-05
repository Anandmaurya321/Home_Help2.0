

import Message from '../../model/message.js';

const DeletedFor = async (req, res) => {
  const { selectedMessageId, userId, deleteFromEveryone } = req.body;

  try {
    await Promise.all(
      selectedMessageId.map((id) => {
        const update = deleteFromEveryone
          ? { deletedForEveryone: true }
          : { $addToSet: { deletedFor: userId } };
        return Message.findByIdAndUpdate(id, update, { new: true });
      })
    );
    res.json({ success: true, message: "Messages updated successfully" });
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

export default DeletedFor;


