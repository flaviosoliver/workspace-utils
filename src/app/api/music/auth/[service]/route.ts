import { NextRequest, NextResponse } from 'next/server';
import { encrypt } from '@/lib/encryption';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  await connectDB();

  const authToken = request.cookies.get('auth_token')?.value;
  if (!authToken) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const decoded = verifyToken(authToken);
  if (!decoded) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const service = request.url.split('/').pop();
  const { accessToken, refreshToken, expiresIn } = await request.json();

  try {
    const encryptedAccessToken = encrypt(accessToken);
    const encryptedRefreshToken = encrypt(refreshToken);

    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await User.findByIdAndUpdate(decoded.userId, {
      [`apiTokens.${service}`]: {
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        expiresAt,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Erro ao salvar tokens do ${service}:`, error);
    return NextResponse.json(
      { error: 'Erro ao salvar tokens' },
      { status: 500 }
    );
  }
}
