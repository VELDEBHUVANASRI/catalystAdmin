import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    planType: {
      type: String,
      enum: ['standard', 'premium', 'enterprise'],
      default: 'standard',
      trim: true,
    },
    subscriptionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);

