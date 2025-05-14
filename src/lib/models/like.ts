import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  userIp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index to ensure one like per IP per post
likeSchema.index({ postId: 1, userIp: 1 }, { unique: true });

export const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);
