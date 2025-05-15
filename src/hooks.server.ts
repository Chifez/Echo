// import { sequence } from '@sveltejs/kit/hooks';
// import { redirect } from '@sveltejs/kit';
// import { requireAdmin } from '$lib/auth';
// import type { Handle } from '@sveltejs/kit';

// const handleSession: Handle = async ({ event, resolve }) => {
//   const session = event.cookies.get('session');
//   console.log('=== Session Debug ===');
//   console.log('Request URL:', event.url.pathname);

//   // Handle editor route protection
//   if (
//     event.url.pathname.startsWith('/editor') ||
//     event.url.pathname.startsWith('/admin')
//   ) {
//     if (!session) {
//       console.log('No session found, redirecting to login');
//       // Store the intended destination in the URL
//       const returnTo = event.url.pathname + event.url.search;
//       throw redirect(303, `/login?returnTo=${encodeURIComponent(returnTo)}`);
//     }

//     try {
//       const { user } = JSON.parse(session);
//       if (!user) {
//         console.log('No user in session, redirecting to login');
//         const returnTo = event.url.pathname + event.url.search;
//         throw redirect(303, `/login?returnTo=${encodeURIComponent(returnTo)}`);
//       }

//       // Check if user is admin
//       requireAdmin(user.email);
//       event.locals.user = user;
//     } catch (error) {
//       console.error('Auth error:', error);
//       const returnTo = event.url.pathname + event.url.search;
//       throw redirect(303, `/login?returnTo=${encodeURIComponent(returnTo)}`);
//     }
//   } else if (session) {
//     // For other routes, just set the user if session exists
//     try {
//       const { user } = JSON.parse(session);
//       event.locals.user = user;
//     } catch (e) {
//       event.locals.user = null;
//     }
//   } else {
//     event.locals.user = null;
//   }

//   return resolve(event);
// };

// export const handle = sequence(handleSession);

import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';

const handleSession: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');
  console.log('=== Session Debug ===');
  console.log('Request URL:', event.url.pathname);
  console.log('Session present:', !!session);

  // Handle editor route protection
  if (
    event.url.pathname.startsWith('/editor') ||
    event.url.pathname.startsWith('/admin')
  ) {
    if (!session) {
      console.log('No session found, redirecting to login');
      // Store the intended destination in the URL
      const returnTo = event.url.pathname + event.url.search;
      console.log('Setting returnTo:', returnTo);
      throw redirect(303, `/login?returnTo=${encodeURIComponent(returnTo)}`);
    }

    try {
      const { user } = JSON.parse(session);
      if (!user) {
        console.log('No user in session, redirecting to login');
        const returnTo = event.url.pathname + event.url.search;
        console.log('Setting returnTo:', returnTo);
        throw redirect(303, `/login?returnTo=${encodeURIComponent(returnTo)}`);
      }

      // Check if user is admin
      requireAdmin(user.email);
      event.locals.user = user;
      console.log('User authenticated:', user.email);
    } catch (error) {
      console.error('Auth error:', error);
      const returnTo = event.url.pathname + event.url.search;
      console.log('Setting returnTo:', returnTo);
      throw redirect(303, `/login?returnTo=${encodeURIComponent(returnTo)}`);
    }
  } else if (session) {
    // For other routes, just set the user if session exists
    try {
      const { user } = JSON.parse(session);
      event.locals.user = user;
      console.log('User set for non-protected route:', user.email);
    } catch (e) {
      console.error('Error parsing session:', e);
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};

export const handle = sequence(handleSession);
