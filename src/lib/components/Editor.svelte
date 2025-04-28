<script lang="ts">
  import { onMount } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Image from '@tiptap/extension-image';
  import Link from '@tiptap/extension-link';
  import Placeholder from '@tiptap/extension-placeholder';
  import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
  import { common, createLowlight } from 'lowlight';
  import { Button } from '$lib/components/ui/button';
  import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from '$lib/components/ui/tabs/index';
  import { Card } from '$lib/components/ui/card';
  import {
    Bold,
    Italic,
    Code,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Image as ImageIcon,
    Link as LinkIcon,
    Quote,
  } from 'lucide-svelte';
  import { uploadImage } from '$lib/services/imageUpload';

  export let content = '';
  export let onUpdate: (content: string) => void;
  export let onBannerImageUpdate: (url: string) => void;
  const lowlight = createLowlight(common);

  let editor: Editor;
  let editorElement: HTMLElement;
  let previewElement: HTMLElement;
  let bannerImage: string | null = null;

  onMount(() => {
    editor = new Editor({
      element: editorElement,
      extensions: [
        StarterKit,
        Image,
        Link.configure({
          openOnClick: false,
        }),
        Placeholder.configure({
          placeholder: 'Start writing your post...',
        }),
        CodeBlockLowlight.configure({
          lowlight,
        }),
      ],
      content,
      onUpdate: ({ editor }) => {
        onUpdate(editor.getHTML());
      },
    });

    return () => {
      editor.destroy();
    };
  });

  async function handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    try {
      const { url } = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  async function handleBannerImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    try {
      const { url } = await uploadImage(file);
      bannerImage = url;
      onBannerImageUpdate(url);
    } catch (error) {
      console.error('Error uploading banner image:', error);
    }
  }

  function addImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleImageUpload;
    input.click();
  }

  function addLink() {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2 p-2 border rounded-lg bg-background">
    <Button
      variant="ghost"
      size="sm"
      on:click={() => editor.chain().focus().toggleBold().run()}
      class={editor?.isActive('bold') ? 'bg-accent' : ''}
    >
      <Bold class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={() => editor.chain().focus().toggleItalic().run()}
      class={editor?.isActive('italic') ? 'bg-accent' : ''}
    >
      <Italic class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={() => editor.chain().focus().toggleCode().run()}
      class={editor?.isActive('code') ? 'bg-accent' : ''}
    >
      <Code class="h-4 w-4" />
    </Button>
    <div class="w-px h-6 bg-border mx-2" />
    <Button
      variant="ghost"
      size="sm"
      on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      class={editor?.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
    >
      <Heading1 class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      class={editor?.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
    >
      <Heading2 class="h-4 w-4" />
    </Button>
    <div class="w-px h-6 bg-border mx-2" />
    <Button
      variant="ghost"
      size="sm"
      on:click={() => editor.chain().focus().toggleBulletList().run()}
      class={editor?.isActive('bulletList') ? 'bg-accent' : ''}
    >
      <List class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={() => editor.chain().focus().toggleOrderedList().run()}
      class={editor?.isActive('orderedList') ? 'bg-accent' : ''}
    >
      <ListOrdered class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={() => editor.chain().focus().toggleBlockquote().run()}
      class={editor?.isActive('blockquote') ? 'bg-accent' : ''}
    >
      <Quote class="h-4 w-4" />
    </Button>
    <div class="w-px h-6 bg-border mx-2" />
    <Button variant="ghost" size="sm" on:click={addImage}>
      <ImageIcon class="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="sm" on:click={addLink}>
      <LinkIcon class="h-4 w-4" />
    </Button>
  </div>

  <div class="space-y-4">
    <div class="flex items-center gap-4">
      <label class="text-sm font-medium">Banner Image</label>
      <input
        type="file"
        accept="image/*"
        on:change={handleBannerImageUpload}
        class="hidden"
        id="banner-upload"
      />
      <Button
        variant="outline"
        size="sm"
        on:click={() => document.getElementById('banner-upload')?.click()}
      >
        Upload Banner
      </Button>
    </div>
    {#if bannerImage}
      <div class="relative h-48 w-full rounded-lg overflow-hidden">
        <img
          src={bannerImage}
          alt="Banner"
          class="w-full h-full object-cover"
        />
      </div>
    {/if}
  </div>

  <Tabs value="edit" class="w-full">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="edit">Edit</TabsTrigger>
      <TabsTrigger value="preview">Preview</TabsTrigger>
    </TabsList>
    <TabsContent value="edit">
      <Card class="p-4">
        <div bind:this={editorElement} class="prose prose-sm max-w-none" />
      </Card>
    </TabsContent>
    <TabsContent value="preview">
      <Card class="p-4">
        <div bind:this={previewElement} class="prose prose-sm max-w-none" />
      </Card>
    </TabsContent>
  </Tabs>
</div>

<style>
  :global(.ProseMirror) {
    min-height: 300px;
    outline: none;
  }

  :global(.ProseMirror p.is-editor-empty:first-child::before) {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
</style>
