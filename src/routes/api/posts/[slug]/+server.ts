import { json } from '@sveltejs/kit';
import { Post } from '$lib/models/post';
import clientPromise, { ensureMongooseConnection } from '$lib/mongodb';

export async function DELETE({ params, locals }) {
  try {
    await clientPromise;

    // Check if user is admin
    if (!locals.user?.email || locals.user.email !== 'chifez1@gmail.com') {
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    const post = await Post.findOneAndDelete({ slug: params.slug });

    if (!post) {
      return json({ error: 'Post not found' }, { status: 404 });
    }

    return json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PUT({ params, locals, request }) {
  const data = await request.json();
  try {
    await ensureMongooseConnection();

    // Ensure MongoDB native client is connected (optional, as we're using Mongoose)
    await clientPromise;

    // Check if user is admin
    if (!locals.user?.email || locals.user.email !== 'chifez1@gmail.com') {
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    const post = await Post.findOneAndUpdate(
      { slug: params.slug },
      { $set: data },
      { new: true }
    );

    if (!post) {
      return json({ error: 'Post not found' }, { status: 404 });
    }

    return json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    return json({ error: 'Failed to update post' }, { status: 500 });
  }
}
