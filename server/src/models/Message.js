import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    senderType: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      required: true,
      trim: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverType: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    attachments: [{
      name: String,
      url: String,
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);

