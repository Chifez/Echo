import { error } from '@sveltejs/kit';
import { Post } from '$lib/models/post';
import { ensureMongooseConnection } from '$lib/mongodb';

// Mark this as server-only code
export const ssr = true;
export const csr = false;

export async function load({ params }) {
  try {
    // Ensure mongoose is connected
    await ensureMongooseConnection();

    // Find the post by slug
    const post = await Post.findOne({ slug: params.slug }).lean();

    if (!post) {
      throw error(404, `Post "${params.slug}" not found`);
    }
    console.log('Post found:', post);
    return {
      content: post.content,
      meta: {
        title: post.title,
        description: post.description,
        date: new Date(post.createdAt || post.date).toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        ),
        author: post.author.name,
        avatar: post.author.avatar,
        role: post.author.role,
        tags: post.tags || [],
        bannerImage: post.image?.url || '',
        image: post.image || { url: '', publicId: '' },
        contentImages: post.contentImages || [],
        likesCount: post.likesCount || 0,
      },
      slug: post.slug,
    };
  } catch (e) {
    console.error('Error loading post:', e);
    if (e instanceof Error && 'status' in e && e.status === 404) throw e;
    throw error(500, 'Failed to load post');
  }
}
