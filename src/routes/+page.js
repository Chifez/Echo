export async function load({ fetch }) {
  const response = await fetch('api/blog');
  const posts = await response.json();
  return { posts };
}
