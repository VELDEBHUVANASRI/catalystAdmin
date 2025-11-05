import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'pending', 'in-progress', 'resolved', 'closed'],
      default: 'open',
      trim: true,
    },
    attachment: {
      name: { type: String, trim: true },
      url: { type: String, trim: true },
      data: { type: String },
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    resolution: {
      type: String,
      trim: true,
    },
  },
  {
    collection: 'tickets',
    timestamps: true,
  }
);

// Generate ticket ID before saving
TicketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketId = `TKT-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);

