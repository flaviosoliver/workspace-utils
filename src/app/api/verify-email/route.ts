import { signJwt, verifyTokenToRegister } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User } from '@/types';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  await connectDB();

  const { token } = await request.json();
  if (!token) {
    return NextResponse.json(
      { error: 'Token de verificação não fornecido' },
      { status: 400 }
    );
  }
  try {
    const result = await verifyTokenToRegister(token);
    if (!result || !result.user) throw new Error('Invalid or expired token');

    if (result.alreadyVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: 'E-mail já foi verificado anteriormente.',
      });
    }

    result.user.isVerified = true;
    await result.user.save();

    const user: User = result.user;

    const jwt = signJwt({ id: user._id, email: user.email });
    (await cookies()).set('next-auth.session-token', jwt, {
      httpOnly: true,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Email verificado com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao verificar email:', error);
    if (error.message === 'Expired token') {
      return NextResponse.json(
        { error: 'Token expirado. Solicite um novo e-mail de verificação.' },
        { status: 400 }
      );
    }
    if (error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Token inválido.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Erro ao verificar email' },
      { status: 500 }
    );
  }
}
