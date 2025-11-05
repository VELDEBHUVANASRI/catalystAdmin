import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    eventType: {
      type: String,
      required: true,
      enum: ['wedding', 'birthday', 'corporate', 'concert', 'other'],
      trim: true,
    },
    eventName: {
      type: String,
      trim: true,
    },
    eventDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
      trim: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Event || mongoose.model('Event', EventSchema);

