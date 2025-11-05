import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      trim: true,
      lowercase: true,
      default: 'active',
    },
    password: {
      type: String,
      trim: true,
      default: '',
      select: false,
    },
  },
  {
    collection: 'users',
    timestamps: true,
    strict: false,
  }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
