import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  bannerImage: {
    type: String,
    required: true,
  },
  images: [
    {
      url: String,
      alt: String,
      caption: String,
    },
  ],
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  published: {
    type: Boolean,
    default: false,
  },
});

// Create slug from title
postSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
