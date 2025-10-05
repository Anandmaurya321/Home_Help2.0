

import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
  
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },

    
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

   
    content: {
      type: String,
      required: true,
      trim: true,
    },
    
   
    deletedFor: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    deletedForEveryone: { type: Boolean, default: false }  // 👈 new field
  },
  {

    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;


