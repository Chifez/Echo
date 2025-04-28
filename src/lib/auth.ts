import { error } from '@sveltejs/kit';

const ADMIN_EMAIL = 'chifez1@gmail.com'; // Replace with your email

export function isAdmin(email: string) {
  console.log('Checking admin status for:', email);
  return email === ADMIN_EMAIL;
}

export function requireAdmin(email: string) {
  console.log('Checking admin status for:', email);
  if (!isAdmin(email)) {
    throw error(403, 'Unauthorized');
  }
}
