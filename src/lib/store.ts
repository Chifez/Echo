import { writable } from 'svelte/store';

export const Menu = writable({
  isOpen: false,
});
