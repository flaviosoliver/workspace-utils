import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/encryption';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = (await cookies()).get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const user = await User.findById(payload.userId);
    if (!user || !user.apiTokens?.spotify?.accessToken) {
      return NextResponse.json(
        { error: 'Usuário não conectado ao Spotify' },
        { status: 401 }
      );
    }

    const accessToken = decrypt(user.apiTokens.spotify.accessToken);

    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Token do Spotify expirado' },
          { status: 401 }
        );
      }
      throw new Error('Erro ao buscar playlists');
    }

    const playlists = await response.json();

    return NextResponse.json({
      playlists: playlists.items.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        tracks: playlist.tracks.total,
        image: playlist.images[0]?.url,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar playlists:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
