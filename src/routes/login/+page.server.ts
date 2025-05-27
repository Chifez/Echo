import { redirect } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID, BASE_URL } from '$env/static/private';

function generateStateToken() {
  return crypto.randomUUID();
}

export const actions = {
  login: async ({ url, cookies }) => {
    const returnTo = url.searchParams.get('returnTo') || '/admin';
    const stateToken = generateStateToken();
    const state = { returnTo, token: stateToken };

    cookies.set('oauth_state', JSON.stringify(state), {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.append(
      'redirect_uri',
      `${BASE_URL}/auth/callback/google`
    );
    authUrl.searchParams.append('scope', 'email profile');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');
    authUrl.searchParams.append('state', stateToken);

    throw redirect(303, authUrl.toString());
  },
};
