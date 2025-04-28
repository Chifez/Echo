import { redirect } from '@sveltejs/kit';
import {
  PUBLIC_GOOGLE_CLIENT_SECRET,
  PUBLIC_GOOGLE_CLIENT_ID,
} from '$env/static/public';

export async function GET({ url, cookies }) {
  const code = url.searchParams.get('code');
  const redirectUri = 'http://localhost:5173/auth/callback/google';

  console.log('Callback received with redirect URI:', redirectUri);
  console.log('Using client ID:', PUBLIC_GOOGLE_CLIENT_ID);

  if (!code) {
    throw redirect(303, '/');
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: PUBLIC_GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    console.log('Token response:', tokens);

    // Get user info
    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const user = await userResponse.json();
    console.log('User info:', user);

    // Set session cookie
    cookies.set(
      'session',
      JSON.stringify({
        user: {
          email: user.email,
          name: user.name,
          picture: user.picture,
        },
        accessToken: tokens.access_token,
      }),
      {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      }
    );

    throw redirect(303, '/editor');
  } catch (error) {
    console.error('Auth error:', error);
    throw redirect(303, '/');
  }
}
