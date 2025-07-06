import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/encryption';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  await connectDB();

  const authToken = request.cookies.get('auth_token')?.value;
  if (!authToken) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const decoded = verifyToken(authToken);
  if (!decoded) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 404 }
    );
  }

  const service = request.url.split('/')[5];
  const serviceTokens = user.apiTokens[service];

  if (!serviceTokens?.accessToken) {
    return NextResponse.json(
      { error: 'Serviço não autenticado' },
      { status: 401 }
    );
  }

  try {
    const accessToken = decrypt(serviceTokens.accessToken);

    let playlists;
    if (service === 'spotify') {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      playlists = data.items;
    } else if (service === 'deezer') {
      const response = await fetch('https://api.deezer.com/user/me/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      playlists = data.data;
    } else {
      throw new Error(`Unsupported music service: ${service}`);
    }

    return NextResponse.json({ playlists });
  } catch (error) {
    console.error(`Erro ao buscar playlists do ${service}:`, error);
    return NextResponse.json(
      { error: 'Erro ao buscar playlists' },
      { status: 500 }
    );
  }
}
