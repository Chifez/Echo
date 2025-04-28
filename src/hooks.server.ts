import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';

const handleSession: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');
  console.log('=== Session Debug ===');
  console.log('Request URL:', event.url.pathname);

  // Handle editor route protection
  if (event.url.pathname.startsWith('/editor')) {
    if (!session) {
      console.log('No session found, redirecting to login');
      throw redirect(303, '/login');
    }

    try {
      const { user } = JSON.parse(session);
      if (!user) {
        console.log('No user in session, redirecting to login');
        throw redirect(303, '/login');
      }

      // Check if user is admin
      requireAdmin(user.email);
      event.locals.user = user;
    } catch (error) {
      console.error('Auth error:', error);
      throw redirect(303, '/login');
    }
  } else if (session) {
    // For other routes, just set the user if session exists
    try {
      const { user } = JSON.parse(session);
      event.locals.user = user;
    } catch (e) {
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};

export const handle = sequence(handleSession);
