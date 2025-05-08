<!-- <script lang="ts">
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
  let isBannerUploading = false;
  let isContentImageUploading = false;

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
        const htmlContent = editor.getHTML();
        onUpdate(htmlContent);

        // Update preview if available
        if (previewElement) {
          previewElement.innerHTML = htmlContent;
        }
      },
    });

    return () => {
      editor.destroy();
    };
  });

  // Direct formatting functions
  function applyBold() {
    editor?.chain().focus().toggleBold().run();
  }

  function applyItalic() {
    editor?.chain().focus().toggleItalic().run();
  }

  function applyCode() {
    editor?.chain().focus().toggleCode().run();
  }

  function applyH1() {
    editor?.chain().focus().toggleHeading({ level: 1 }).run();
  }

  function applyH2() {
    editor?.chain().focus().toggleHeading({ level: 2 }).run();
  }

  function applyBulletList() {
    editor?.chain().focus().toggleBulletList().run();
  }

  function applyOrderedList() {
    editor?.chain().focus().toggleOrderedList().run();
  }

  function applyBlockquote() {
    editor?.chain().focus().toggleBlockquote().run();
  }

  async function handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    try {
      isContentImageUploading = true;
      const { url } = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      isContentImageUploading = false;
    }
  }

  async function handleBannerImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    try {
      isBannerUploading = true;
      const { url } = await uploadImage(file);
      bannerImage = url;
      onBannerImageUpdate(url);
    } catch (error) {
      console.error('Error uploading banner image:', error);
    } finally {
      isBannerUploading = false;
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

  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = '/placeholder-image.jpg';
  }
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2 p-2 border rounded-lg bg-background">
    <Button
      variant="ghost"
      size="sm"
      on:click={applyBold}
      class={editor?.isActive('bold') ? 'bg-accent' : ''}
    >
      <Bold class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={applyItalic}
      class={editor?.isActive('italic') ? 'bg-accent' : ''}
    >
      <Italic class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={applyCode}
      class={editor?.isActive('code') ? 'bg-accent' : ''}
    >
      <Code class="h-4 w-4" />
    </Button>
    <div class="w-px h-6 bg-border mx-2" />
    <Button
      variant="ghost"
      size="sm"
      on:click={applyH1}
      class={editor?.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
    >
      <Heading1 class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={applyH2}
      class={editor?.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
    >
      <Heading2 class="h-4 w-4" />
    </Button>
    <div class="w-px h-6 bg-border mx-2" />
    <Button
      variant="ghost"
      size="sm"
      on:click={applyBulletList}
      class={editor?.isActive('bulletList') ? 'bg-accent' : ''}
    >
      <List class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={applyOrderedList}
      class={editor?.isActive('orderedList') ? 'bg-accent' : ''}
    >
      <ListOrdered class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={applyBlockquote}
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
        disabled={isBannerUploading}
      >
        {#if isBannerUploading}
          <span class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Uploading...
          </span>
        {:else}
          Upload Banner
        {/if}
      </Button>
    </div>
    {#if bannerImage}
      <div class="relative h-48 w-full rounded-lg overflow-hidden">
        <img
          src={bannerImage}
          alt="Banner"
          class="w-full h-full object-cover"
          on:error={handleImageError}
        />
      </div>
    {/if}
  </div>

  <div class="mt-4">
    <Tabs value="edit" class="w-full">
      <TabsList>
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="edit">
        <div
          bind:this={editorElement}
          class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4"
        />
        {#if isContentImageUploading}
          <div
            class="fixed bottom-4 right-4 bg-background p-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Uploading image...</span>
          </div>
        {/if}
      </TabsContent>
      <TabsContent value="preview">
        <div
          bind:this={previewElement}
          class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto min-h-[500px] p-4"
        />
      </TabsContent>
    </Tabs>
  </div>
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
</style> -->

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
  import { uploadImage } from '$lib/services/image-upload';

  export let content = '';
  export let onUpdate: (content: string) => void;
  export let onBannerImageUpdate: (url: string) => void;
  const lowlight = createLowlight(common);

  let bannerImage: string | null = null;
  let editor: Editor;
  let editorElement: HTMLElement;
  let previewElement: HTMLElement;
  let isBannerUploading = false;
  let isContentImageUploading = false;

  onMount(() => {
    editor = new Editor({
      element: editorElement,
      extensions: [
        StarterKit,
        Image.configure({
          HTMLAttributes: {
            class: 'max-w-full h-auto rounded-lg',
          },
        }),
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
        const htmlContent = editor.getHTML();
        onUpdate(htmlContent);

        // Update preview if available
        if (previewElement) {
          previewElement.innerHTML = htmlContent;
        }
      },
    });

    // Force content rendering if initially empty
    if (content) {
      editor.commands.setContent(content);
    }

    return () => {
      editor.destroy();
    };
  });

  // Direct formatting functions
  function applyBold() {
    editor?.chain().focus().toggleBold().run();
  }

  function applyItalic() {
    editor?.chain().focus().toggleItalic().run();
  }

  function applyCode() {
    editor?.chain().focus().toggleCode().run();
  }

  function applyH1() {
    editor?.chain().focus().toggleHeading({ level: 1 }).run();
  }

  function applyH2() {
    editor?.chain().focus().toggleHeading({ level: 2 }).run();
  }

  function applyBulletList() {
    editor?.chain().focus().toggleBulletList().run();
  }

  function applyOrderedList() {
    editor?.chain().focus().toggleOrderedList().run();
  }

  function applyBlockquote() {
    editor?.chain().focus().toggleBlockquote().run();
  }

  async function handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    try {
      isContentImageUploading = true;
      const { url } = await uploadImage(file);

      // Insert the image at the current cursor position
      if (editor && url) {
        console.log('url', url);
        editor
          .chain()
          .focus()
          .setImage({
            src: url,
            alt: file.name || 'Uploaded image',
          })
          .run();

        // Force editor to update
        const currentContent = editor.getHTML();
        onUpdate(currentContent);

        // Make sure preview is updated too
        if (previewElement) {
          previewElement.innerHTML = currentContent;
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      isContentImageUploading = false;
      // Clear the input value to allow uploading the same file again
      if (input) input.value = '';
    }
  }

  async function handleBannerImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    try {
      isBannerUploading = true;
      const { url } = await uploadImage(file);
      console.log('uploading image 1');
      // Make sure to call the callback with the URL
      if (url) {
        console.log('uploading image 2');
        onBannerImageUpdate(url);
        bannerImage = url;
        console.log('bannerImage 2', bannerImage);
      }
      console.log('uploading image 3');
    } catch (error) {
      console.error('Error uploading banner image:', error);
      alert('Failed to upload banner image. Please try again.');
    } finally {
      isBannerUploading = false;
      // Clear the input value to allow uploading the same file again
      if (input) input.value = '';
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

  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = '/placeholder-image.jpg';
  }
  $: console.log('bannerImage', bannerImage);
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2 p-2 border rounded-lg bg-background">
    <Button
      variant="ghost"
      size="sm"
      on:click={applyBold}
      class={editor?.isActive('bold') ? 'bg-accent' : ''}
    >
      <Bold class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={applyItalic}
      class={editor?.isActive('italic') ? 'bg-accent' : ''}
    >
      <Italic class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={applyCode}
      class={editor?.isActive('code') ? 'bg-accent' : ''}
    >
      <Code class="h-4 w-4" />
    </Button>
    <div class="w-px h-6 bg-border mx-2" />
    <Button
      variant="ghost"
      size="sm"
      on:click={applyH1}
      class={editor?.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
    >
      <Heading1 class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={applyH2}
      class={editor?.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
    >
      <Heading2 class="h-4 w-4" />
    </Button>
    <div class="w-px h-6 bg-border mx-2" />
    <Button
      variant="ghost"
      size="sm"
      on:click={applyBulletList}
      class={editor?.isActive('bulletList') ? 'bg-accent' : ''}
    >
      <List class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={applyOrderedList}
      class={editor?.isActive('orderedList') ? 'bg-accent' : ''}
    >
      <ListOrdered class="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      on:click={applyBlockquote}
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
        disabled={isBannerUploading}
      >
        {#if isBannerUploading}
          <span class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Uploading...
          </span>
        {:else}
          Upload Banner
        {/if}
      </Button>
    </div>
    {#if bannerImage}
      <div class="relative h-48 w-full rounded-lg overflow-hidden border">
        <img
          src={bannerImage}
          alt="Banner"
          class="w-full h-full object-cover"
          on:error={handleImageError}
        />
      </div>
    {/if}
  </div>

  <div class="mt-4">
    <Tabs value="edit" class="w-full">
      <TabsList>
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="edit">
        <div
          bind:this={editorElement}
          class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4 border rounded-lg"
        />
        {#if isContentImageUploading}
          <div
            class="fixed bottom-4 right-4 bg-background p-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
          >
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Uploading image...</span>
          </div>
        {/if}
      </TabsContent>
      <TabsContent value="preview">
        <div
          bind:this={previewElement}
          class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto min-h-[500px] p-4 border rounded-lg"
        />
      </TabsContent>
    </Tabs>
  </div>
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

  :global(.ProseMirror img) {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
    border-radius: 0.375rem;
  }
</style>
