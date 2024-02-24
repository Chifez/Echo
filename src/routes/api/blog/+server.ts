import { json } from '@sveltejs/kit';
// import type { BlogPost } from '$lib/types';
// TODO remember to update the import and breaking chnages
async function getBlogPosts() {
  //   let blogPosts: BlogPost[] = [];
  let blogPosts = [];

  const paths = import.meta.glob('/src/blog/*.md', { eager: true });

  for (const path in paths) {
    const file = paths[path];
    const slug = path.split('/').at(-1)?.replace('.md', '');

    if (file && typeof file === 'object' && 'metadata' in file && slug) {
      const metadata = file.metadata;
      const blogPost = { ...metadata, slug };
      blogPost.published && blogPosts.push(blogPost);
    }
  }

  blogPosts = blogPosts.sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime()
  );

  return blogPosts;
}

export async function GET() {
  const blogPosts = await getBlogPosts();

  return json(blogPosts);
}
