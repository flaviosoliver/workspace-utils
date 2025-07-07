import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
  ].join(' ');

  const state = Math.random().toString(36).substring(7);

  const spotifyAuthUrl = new URL('https://accounts.spotify.com/authorize');
  spotifyAuthUrl.searchParams.append('response_type', 'code');
  spotifyAuthUrl.searchParams.append('client_id', clientId!);
  spotifyAuthUrl.searchParams.append('scope', scopes);
  spotifyAuthUrl.searchParams.append('redirect_uri', redirectUri!);
  spotifyAuthUrl.searchParams.append('state', state);

  return NextResponse.redirect(spotifyAuthUrl.toString());
}
