// /routes/api/posts/+server.ts
import { json } from '@sveltejs/kit';
import { getPostModel, Post } from '$lib/models/post';
import clientPromise, { ensureMongooseConnection } from '$lib/mongodb';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

interface PostFilter {
  tags?: { $regex: string; $options: string };
  isPublished?: boolean;
}

interface PostSort {
  createdAt?: 1 | -1;
}

const TIMEOUT_DURATION = 30000; // 30 seconds

// Helper function to create a timeout promise
function createTimeout(ms: number) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
  );
}

export async function GET({ url, locals }) {
  try {
    // Ensure mongoose is connected
    await ensureMongooseConnection();

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '6');
    const filterType = url.searchParams.get('type') || 'date';
    const dateFilter = url.searchParams.get('date') || 'newest';
    const categoryFilter = url.searchParams.get('category') || 'all';
    const tagFilter = url.searchParams.get('tag') || '';
    const isAdmin = url.searchParams.get('admin') === 'true';

    console.log('Query Parameters:', {
      page,
      limit,
      filterType,
      dateFilter,
      categoryFilter,
      tagFilter,
      isAdmin,
    });

    const skip = (page - 1) * limit;

    // Build the filter object
    const filter: any = {};

    // Apply category filter
    if (categoryFilter !== 'all') {
      filter.category = categoryFilter;
    }

    // Apply tag filter
    if (tagFilter) {
      filter.tags = { $regex: tagFilter, $options: 'i' };
    }

    // Only show published posts for non-admin users
    if (!isAdmin) {
      filter.isPublished = true;
    }

    console.log('MongoDB Filter:', JSON.stringify(filter, null, 2));

    // Build the sort object
    const sort: any = {
      createdAt: dateFilter === 'oldest' ? 1 : -1,
    };

    console.log('MongoDB Sort:', JSON.stringify(sort, null, 2));

    // Query the database
    const [posts, total] = await Promise.all([
      Post.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Post.countDocuments(filter),
    ]);

    console.log('Query Results:', {
      postsFound: posts.length,
      totalDocuments: total,
      hasMore: skip + posts.length < total,
    });

    const hasMore = skip + posts.length < total;

    return json({
      posts,
      hasMore,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST({ request, locals }) {
  try {
    // Ensure mongoose is connected
    await ensureMongooseConnection();

    // Ensure MongoDB native client is connected (optional, as we're using Mongoose)
    await clientPromise;

    // Authenticate user (optional - adjust according to your auth setup)
    // if (!locals.user) {
    //   return json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const data = await request.json();
    const {
      title,
      excerpt,
      slug: providedSlug,
      category,
      readTime,
      content,
      image,
      tags = [],
      isPublished = true,
      author,
    } = data;

    // Validate required fields
    if (!title || !content) {
      return json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Generate a slug if not provided
    let slug =
      providedSlug ||
      title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-') +
        '-' +
        nanoid(6);

    // Check if post with same slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      // Add a unique suffix to the slug
      const uniqueSlug = `${slug}-${nanoid(6)}`;
      console.log(
        `Slug "${slug}" already exists. Using "${uniqueSlug}" instead.`
      );
      slug = uniqueSlug;
    }

    // Create new post
    const post = new Post({
      title,
      excerpt,
      slug,
      content,
      image,
      category,
      readTime,
      tags: Array.isArray(tags)
        ? tags
        : tags.split(',').map((tag: any) => tag.trim()),
      isPublished,
      author: {
        name: author.name || 'Anonymous',
        avatar: author.avatar || '/corporate.jpg',
        role: author.role || 'Anonymous',
      },
    });

    // Save to database with timeout
    const savedPost = await Promise.race([
      post.save(),
      createTimeout(TIMEOUT_DURATION),
    ]);

    console.log('Post saved successfully:', savedPost._id);

    return json(
      {
        post: savedPost,
        message: 'Post created successfully!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);

    // Handle specific error cases
    if (error instanceof Error && error.message.includes('timed out')) {
      return json(
        { error: 'Database operation timed out. Please try again later.' },
        { status: 503 }
      );
    }

    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return json(
        { error: 'Validation error', details: validationErrors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('E11000')) {
      return json(
        {
          error:
            'A post with this slug already exists. Please use a different title.',
        },
        { status: 409 }
      );
    }

    return json(
      { error: 'Failed to create post. Please try again.' },
      { status: 500 }
    );
  }
}
