// @ts-nocheck
import { json } from '@sveltejs/kit';
import { Post } from '$lib/models/Post';
import clientPromise from '$lib/mongodb';

export async function GET({ url }) {
  try {
    await clientPromise;
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '6');
    const skip = (page - 1) * limit;

    const posts = await Post.find({ published: true })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ published: true });

    return json({
      posts,
      total,
      hasMore: skip + posts.length < total,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    await clientPromise;
    const data = await request.json();

    const post = new Post(data);
    await post.save();

    return json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return json({ error: 'Failed to create post' }, { status: 500 });
  }
}
