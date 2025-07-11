import { error } from '@sveltejs/kit';
import { Post } from '$lib/models/post';
import clientPromise, { ensureMongooseConnection } from '$lib/mongodb';

export async function load({ params }) {
  try {
    await ensureMongooseConnection();

    // Ensure MongoDB native client is connected (optional, as we're using Mongoose)
    // await clientPromise;
    // Check if user is admin
    const post = await Post.findOne({ slug: params.slug });

    if (!post) {
      throw error(404, 'Post not found');
    }

    return {
      post: JSON.parse(JSON.stringify(post)),
    };
  } catch (err) {
    console.error('Error loading post:', err);
    throw error(500, 'Failed to load post');
  }
}
