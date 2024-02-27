import { writable } from 'svelte/store';

export const Menu = writable({
  isOpen: false,
});

export const EmailContent = writable({
  content: 'this is a text',
});
