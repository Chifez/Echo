import { json } from '@sveltejs/kit';
import { Post } from '$lib/models/post';
import clientPromise, { ensureMongooseConnection } from '$lib/mongodb';

export async function GET({ locals }) {
  try {
    await ensureMongooseConnection();

    // Ensure MongoDB native client is connected (optional, as we're using Mongoose)
    await clientPromise;

    // Check if user is admin
    if (!locals.user?.email || locals.user.email !== 'chifez1@gmail.com') {
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    const posts = await Post.find().sort({ date: -1 }).select('-content'); // Don't send content to admin list

    return json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
