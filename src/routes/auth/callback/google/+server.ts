import { redirect, error } from '@sveltejs/kit';
import {
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  BASE_URL,
} from '$env/static/private';

export async function GET({ url, cookies }) {
  const code = url.searchParams.get('code');
  const incomingState = url.searchParams.get('state');

  const storedState = cookies.get('oauth_state');
  if (!storedState || !incomingState) {
    throw redirect(303, '/');
  }

  let parsedState;
  try {
    parsedState = JSON.parse(storedState);
  } catch {
    throw redirect(303, '/');
  }

  if (incomingState !== parsedState.token) {
    throw error(403, 'Invalid state parameter');
  }

  const returnTo = parsedState.returnTo;
  const redirectUri = `${BASE_URL}/auth/callback/google`;

  if (!code) {
    throw redirect(303, '/');
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Token exchange failed');
    }

    const tokens = await tokenResponse.json();

    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const user = await userResponse.json();

    const sessionData = {
      user: {
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      accessToken: tokens.access_token,
    };

    cookies.set('session', JSON.stringify(sessionData), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    cookies.delete('oauth_state', { path: '/' });

    // Redirect to success page with the original return path
    throw redirect(
      303,
      `/auth/success?returnTo=${encodeURIComponent(returnTo)}`
    );
  } catch (error) {
    if (error && (error as any).status === 303) {
      throw error;
    }
    throw redirect(303, `/login?returnTo=${encodeURIComponent(returnTo)}`);
  }
}
