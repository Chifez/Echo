// import mongoose from 'mongoose';

// const postSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   bannerImage: {
//     type: String,
//     required: true,
//   },
//   images: [
//     {
//       url: String,
//       alt: String,
//       caption: String,
//     },
//   ],
//   slug: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   author: {
//     type: String,
//     required: true,
//   },
//   avatar: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     required: true,
//   },
//   tags: [
//     {
//       type: String,
//     },
//   ],
//   published: {
//     type: Boolean,
//     default: false,
//   },
// });

// // Create slug from title
// postSchema.pre('save', function (next) {
//   if (this.isModified('title')) {
//     this.slug = this.title
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/(^-|-$)/g, '');
//   }
//   next();
// });

// export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

// $lib/models/Post.ts
import mongoose from 'mongoose';
import { ensureMongooseConnection } from '$lib/mongodb';

// Define the interface for our Post model
interface IPost {
  title: string;
  description?: string;
  slug: string;
  content: string;
  bannerImage?: string;
  tags: string[];
  isPublished: boolean;
  author: string;
  avatar?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const postSchema = new mongoose.Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    bannerImage: String,
    tags: [{ type: String, trim: true }],
    isPublished: {
      type: Boolean,
      default: false,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
    },
    avatar: String,
    role: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    // Automatically handle createdAt and updatedAt
    timestamps: true,
    // This will include virtuals when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better performance
postSchema.index({ title: 'text', content: 'text', tags: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ slug: 1 }, { unique: true });

// Create or retrieve model
let Post: IPost | any;

try {
  // Check if the model exists already to prevent "Cannot overwrite model" errors
  Post = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);
} catch (e) {
  Post = mongoose.model<IPost>('Post', postSchema);
}

// Export the Post model
export { Post };

// Export a function to ensure the Post model is ready to use
export async function getPostModel() {
  await ensureMongooseConnection();
  return Post;
}
