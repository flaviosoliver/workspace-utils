import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';
import { encrypt } from '@/lib/encryption';
import User from '@/lib/models/User';

interface JwtPayload {
  email: string;
  exp: number;
}

export async function GET(request: Request) {
  const token = (await cookies()).get('auth_token')?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const payload = verifyJwt(token) as JwtPayload | null;
  if (!payload || !payload.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) {
    return redirect('/workspace?error=no_code');
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.YOUTUBE_CLIENT_ID!,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/music/auth/youtube`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || 'Failed to exchange code');
    }

    const encryptedAccess = await encrypt(tokens.access_token);
    const encryptedRefresh = tokens.refresh_token
      ? await encrypt(tokens.refresh_token)
      : null;

    await User.findOneAndUpdate(
      { email: payload.email },
      {
        $set: {
          'apiTokens.youtube.accessToken': encryptedAccess,
          'apiTokens.youtube.refreshToken': encryptedRefresh,
          'apiTokens.youtube.expiresAt': new Date(
            Date.now() + tokens.expires_in * 1000
          ),
        },
      }
    );

    return redirect('/workspace?success=youtube_connected');
  } catch (error) {
    console.error('Error exchanging code:', error);
    return redirect('/workspace?error=token_exchange');
  }
}
