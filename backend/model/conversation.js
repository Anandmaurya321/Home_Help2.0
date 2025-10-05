
import mongoose from 'mongoose';
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },

  
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'ServicePro', 
      required: true,
    },

    
    status: {
      type: String,
      enum: ['awaiting_provider_response', 'awaiting_user_response', 'closed'],
      default: 'awaiting_provider_response',
    },

  },
  {
    timestamps: true, 
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
