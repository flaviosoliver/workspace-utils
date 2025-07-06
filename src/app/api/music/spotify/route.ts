import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/encryption';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  await connectDB();
  // Recupere o usuário autenticado (ex: pelo cookie)
  // Busque o token encriptado do banco
  // Desencripte e use para buscar playlists na API do Spotify/YouTube
  // NUNCA envie o token puro para o frontend
  // Exemplo de resposta:
  return NextResponse.json({
    playlists: [
      { id: '1', name: 'Favoritas', tracks: [] },
      // ...
    ],
  });
}
