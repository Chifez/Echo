import { json } from '@sveltejs/kit';
import { Post } from '$lib/models/post';
import { Like } from '$lib/models/like';
import { ensureMongooseConnection } from '$lib/mongodb';

export async function POST({ params, request, getClientAddress }) {
  try {
    await ensureMongooseConnection();

    const post = await Post.findOne({ slug: params.slug });
    if (!post) {
      return json({ error: 'Post not found' }, { status: 404 });
    }

    const userIp = getClientAddress();
    const existingLike = await Like.findOne({ postId: post._id, userIp });

    if (existingLike) {
      // Unlike: Remove the like and decrement count
      await Like.deleteOne({ _id: existingLike._id });
      const updatedPost = await Post.findOneAndUpdate(
        { _id: post._id },
        { $inc: { likesCount: -1 } },
        { new: true }
      ).lean();
      return json({ liked: false, likesCount: updatedPost.likesCount || 0 });
    } else {
      // Like: Create new like and increment count
      await Like.create({ postId: post._id, userIp });
      const updatedPost = await Post.findOneAndUpdate(
        { _id: post._id },
        { $inc: { likesCount: 1 } },
        { new: true }
      ).lean();
      return json({ liked: true, likesCount: updatedPost.likesCount || 0 });
    }
  } catch (error) {
    console.error('Error handling like:', error);
    return json({ error: 'Failed to process like' }, { status: 500 });
  }
}

export async function GET({ params, getClientAddress }) {
  try {
    await ensureMongooseConnection();

    const post = await Post.findOne({ slug: params.slug }).lean();
    if (!post) {
      return json({ error: 'Post not found' }, { status: 404 });
    }

    const userIp = getClientAddress();
    const hasLiked = await Like.exists({ postId: post._id, userIp });

    console.log('lijkes data', {
      likesCount: post.likesCount,
      hasLiked: !!hasLiked,
    });
    return json({
      likesCount: post.likesCount || 0,
      hasLiked: !!hasLiked,
    });
  } catch (error) {
    console.error('Error getting like status:', error);
    return json({ error: 'Failed to get like status' }, { status: 500 });
  }
}
