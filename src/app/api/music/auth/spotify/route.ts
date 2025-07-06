import { NextRequest, NextResponse } from 'next/server';
import { encrypt } from '@/lib/encryption';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const authToken = request.cookies.get('auth_token')?.value;

  if (!code || !authToken) {
    return NextResponse.redirect('/error?message=Autenticação falhou');
  }

  const decoded = verifyToken(authToken);
  if (!decoded) {
    return NextResponse.redirect('/error?message=Token inválido');
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(
            CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
          ).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokens = await response.json();

    const encryptedAccess = encrypt(tokens.access_token);
    const encryptedRefresh = encrypt(tokens.refresh_token);

    await User.findByIdAndUpdate(decoded.userId, {
      $set: {
        'apiTokens.spotify': {
          accessToken: encryptedAccess,
          refreshToken: encryptedRefresh,
          expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        },
      },
    });

    return NextResponse.redirect('/music?service=spotify');
  } catch (error) {
    console.error('Erro na autenticação do Spotify:', error);
    return NextResponse.redirect('/error?message=Falha na autenticação');
  }
}
const scope = 'user-read-private user-read-email playlist-read-private';
const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(
  scope
)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
export async function POST() {
  return NextResponse.redirect(url);
}
