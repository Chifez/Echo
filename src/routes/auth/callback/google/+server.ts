import { redirect } from '@sveltejs/kit';
import {
  PUBLIC_GOOGLE_CLIENT_SECRET,
  PUBLIC_GOOGLE_CLIENT_ID,
  PUBLIC_BASE_URL,
} from '$env/static/public';

export async function GET({ url, cookies }) {
  console.log('=== OAuth Callback Debug ===');
  console.log('Full URL:', url.toString());
  console.log('PUBLIC_BASE_URL:', PUBLIC_BASE_URL);
  console.log('import.meta.env.PROD:', import.meta.env.PROD);

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  // Debug the state parameter
  console.log('Raw state parameter:', state);

  // Default to /editor if state is missing
  const returnTo = state ? decodeURIComponent(state) : '/editor';
  console.log('Decoded returnTo:', returnTo);

  // Use import.meta.env.PROD for consistency with the login page
  const redirectUri = import.meta.env.PROD
    ? `${PUBLIC_BASE_URL}/auth/callback/google`
    : 'http://localhost:5173/auth/callback/google';

  console.log('Constructed redirectUri:', redirectUri);
  console.log('Code present:', !!code);
  console.log('State present:', !!state);
  console.log('ReturnTo:', returnTo);

  if (!code) {
    console.log('No code present, redirecting to home');
    throw redirect(303, '/');
  }

  try {
    console.log('Attempting token exchange...');
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

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error('Token exchange failed:', errorData);
      console.error('Token response status:', tokenResponse.status);
      console.error('Token response status text:', tokenResponse.statusText);

      throw new Error(
        `Token exchange failed: ${
          errorData.error_description ||
          errorData.error ||
          tokenResponse.statusText
        }`
      );
    }

    const tokens = await tokenResponse.json();
    console.log(
      'Token exchange successful, access token present:',
      !!tokens.access_token
    );

    // Get user info
    console.log('Fetching user info...');
    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    if (!userResponse.ok) {
      const errorData = await userResponse.json().catch(() => ({}));
      console.error('User info fetch failed:', errorData);
      throw new Error(
        `User info fetch failed: ${
          errorData.error_description ||
          errorData.error ||
          userResponse.statusText
        }`
      );
    }

    const user = await userResponse.json();
    console.log('User info fetched successfully:', {
      email: user.email,
      name: user.name,
      hasPicture: !!user.picture,
    });

    // Prepare session data
    const sessionData = {
      user: {
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      accessToken: tokens.access_token,
    };

    console.log('Preparing to set session cookie with data:', {
      hasUser: !!sessionData.user,
      hasEmail: !!sessionData.user.email,
      hasName: !!sessionData.user.name,
      hasPicture: !!sessionData.user.picture,
      hasAccessToken: !!sessionData.accessToken,
    });

    // Set session cookie
    const cookieValue = JSON.stringify(sessionData);
    console.log('Cookie value length:', cookieValue.length);

    cookies.set('session', cookieValue, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: import.meta.env.PROD, // Use import.meta.env.PROD for consistency
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    console.log('Session cookie set, redirecting to:', returnTo);
    // Redirect to the intended destination
    throw redirect(303, returnTo);
  } catch (error) {
    console.error('Auth error:', error);
    // Log the specific error message
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw redirect(303, '/');
  }
}
