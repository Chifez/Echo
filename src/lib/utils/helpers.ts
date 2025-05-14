export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

// Helper function to calculate read time
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;

  // Count images in content (assuming they are in markdown format ![alt](url))
  const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;

  // Add 12 seconds per image (0.2 minutes)
  const imageTime = imageCount * 0.2;

  // Calculate total minutes and round up
  const minutes = Math.ceil(words / wordsPerMinute + imageTime);
  return `${minutes} min read`;
}
