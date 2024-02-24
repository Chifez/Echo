// import sequence from 'svelte-sequential-preprocessor';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { getHighlighter } from 'shiki';
import remarkUnwrapImages from 'remark-unwrap-images';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
/** @type {import('@sveltejs/kit').Config} */

/** @type {import('mdsvex').MdsvexOptions} */
// const mdsvexOptions = {
//   extensions: ['.svelte', '.md'],
// 	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
// }
const mdsvexOptions = {
  extensions: ['.md'],
  // layout: {
  //   _: './src/mdsvex.svelte',
  // },
  // highlight: {
  //   highlighter: async (code, lang = 'text') => {
  //     const highlighter = await getHighlighter({
  //       themes: ['poimandres'],
  //       langs: ['javascript', 'typescript'],
  //     });
  //     await highlighter.loadLanguage('javascript', 'typescript');
  //     const html = escapeSvelte(
  //       highlighter.codeToHtml(code, { lang, theme: 'poimandres' })
  //     );
  //     return `{@html \`${html}\` }`;
  //   },
  // },
  remarkPlugins: [remarkUnwrapImages, [remarkToc, { tight: true }]],
  rehypePlugins: [rehypeSlug],
};

const config = {
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
  },
  extensions: ['.svelte', '.md'],
  preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
  alias: {
    $components: '$lib/components',
    $utils: '$lib/utils',
  },
};

export default config;
