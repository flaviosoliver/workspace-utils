import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const token = (await cookies()).get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    const decoded = verifyJwt(token);
    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { preferences } = await request.json();
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { preferences },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Erro ao atualizar preferências:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
