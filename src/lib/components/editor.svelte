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
    Trash2,
  } from 'lucide-svelte';
  import { uploadImage, deleteImage } from '$lib/services/image-upload';
  import Loader from './loader.svelte';
  import { mergeAttributes } from '@tiptap/core';

  interface ImageMetadata {
    url: string;
    publicId: string;
  }

  export let content = '';
  export let onUpdate: (content: string) => void;
  export let onBannerImageUpdate: (imageData: ImageMetadata) => void;
  export let initialImage: ImageMetadata | null = null;
  const lowlight = createLowlight(common);

  let image: ImageMetadata | null = initialImage;
  let editor: Editor;
  let editorElement: HTMLElement;
  let previewElement: HTMLElement;
  let isBannerUploading = false;
  let isContentImageUploading = false;

  const CustomImage = Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        'data-public-id': {
          default: null,
          parseHTML: (element: HTMLElement) =>
            element.getAttribute('data-public-id'),
          renderHTML: (attributes: Record<string, any>) => {
            if (!attributes['data-public-id']) return {};
            return { 'data-public-id': attributes['data-public-id'] };
          },
        },
      };
    },
  });

  async function deleteBannerImage() {
    if (!image) return;

    try {
      const response = await deleteImage(image.publicId);

      if (!response.data) {
        throw new Error('Failed to delete image');
      }

      image = null;
      onBannerImageUpdate({ url: '', publicId: '' });
    } catch (error) {
      console.error('Error deleting banner image:', error);
      alert('Failed to delete banner image. Please try again.');
    }
  }

  async function deleteContentImage(publicId: string) {
    try {
      const response = await deleteImage(publicId);

      if (!response.data) {
        throw new Error('Failed to delete image');
      }

      // Remove the image from the editor content
      if (editor) {
        editor.commands.deleteNode('image');
        const currentContent = editor.getHTML();
        onUpdate(currentContent);
      }
    } catch (error) {
      console.error('Error deleting content image:', error);
      alert('Failed to delete image. Please try again.');
    }
  }

  onMount(() => {
    // Set initial image if provided
    if (initialImage) {
      image = initialImage;
    }

    editor = new Editor({
      element: editorElement,
      extensions: [
        StarterKit,
        CustomImage.configure({
          HTMLAttributes: {
            class: 'max-w-full h-auto rounded-lg relative group',
          },
        }),
        // Image.configure({
        //   HTMLAttributes: {
        //     class: 'max-w-full h-auto rounded-lg relative group',
        //   },
        //   addAttributes: () => ({
        //     'data-public-id': {
        //       default: null,
        //       parseHTML: (element: HTMLElement) =>
        //         element.getAttribute('data-public-id'),
        //       renderHTML: (attributes: Record<string, any>) => {
        //         if (!attributes['data-public-id']) return {};
        //         return { 'data-public-id': attributes['data-public-id'] };
        //       },
        //     },
        //   }),
        // }),
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

    // Add click handler for image deletion
    editorElement.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        const deleteButton = target.querySelector('.delete-image-btn');
        if (deleteButton && e.target === deleteButton) {
          e.preventDefault();
          const publicId = target.getAttribute('data-public-id');
          if (publicId) {
            deleteContentImage(publicId);
          }
        }
      }
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
      const { url, public_id: publicId } = await uploadImage(file);

      // Insert the image at the current cursor position
      if (editor && url) {
        editor
          .chain()
          .focus()
          .setImage({
            src: url,
            alt: file.name || 'Uploaded image',
            'data-public-id': publicId,
          } as any)
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
      if (input) input.value = '';
    }
  }

  async function handleBannerImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    try {
      isBannerUploading = true;
      const { url, public_id: publicId } = await uploadImage(file);

      if (url) {
        const imageData = { url, publicId };
        onBannerImageUpdate(imageData);
        image = imageData;
      }
    } catch (error) {
      console.error('Error uploading banner image:', error);
      alert('Failed to upload banner image. Please try again.');
    } finally {
      isBannerUploading = false;
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
    img.src = '/cli-banner.webp';
  }
  $: console.log('image', image);
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
      <label for="banner-upload" class="text-sm font-medium">
        Banner Image
      </label>
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
            <Loader />
            Uploading...
          </span>
        {:else}
          Upload Banner
        {/if}
      </Button>
    </div>
    {#if image}
      <div class="relative h-48 w-full rounded-lg overflow-hidden border group">
        <img
          src={image.url}
          alt="Banner"
          class="w-full h-full object-cover"
          on:error={handleImageError}
        />
        <button
          class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          on:click={deleteBannerImage}
        >
          <Trash2 size={16} />
        </button>
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
            <Loader />
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
    position: relative;
    display: block;
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
    border-radius: 0.375rem;
  }

  :global(.ProseMirror img:hover .delete-image-btn) {
    opacity: 1;
  }

  :global(.delete-image-btn) {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.25rem;
    background-color: rgb(239, 68, 68);
    color: white;
    border-radius: 9999px;
    opacity: 0;
    transition: opacity 0.2s;
    cursor: pointer;
  }
</style>
