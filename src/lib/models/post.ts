import mongoose from 'mongoose';
import { ensureMongooseConnection } from '$lib/mongodb';

// Define the interface for our Post model
interface IPost {
  title: string;
  excerpt: string;
  content: string;
  date: Date;
  readTime: string;
  category: 'development' | 'personal';
  image: {
    url: string;
    publicId: string;
  };
  contentImages: Array<{
    url: string;
    publicId: string;
  }>;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  tags: string[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  likesCount: number;
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
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: [500, 'Excerpt cannot be more than 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    readTime: {
      type: String,
      required: [true, 'Read time is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['development', 'personal'],
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    contentImages: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    author: {
      name: {
        type: String,
        required: [true, 'Author name is required'],
      },
      avatar: String,
      role: String,
    },
    tags: [{ type: String, trim: true }],
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better performance
// postSchema.index({ title: 'text', content: 'text', tags: 1 });
// postSchema.index({ createdAt: -1 });
// postSchema.index({ slug: 1 }, { unique: true });
// postSchema.index({ category: 1 });

// Create or retrieve model
let Post: IPost | any;

try {
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
