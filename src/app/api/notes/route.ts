import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';
import Note from '@/lib/models/Note';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = (await cookies()).get('auth_token')?.value;
    if (!token)
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );

    const decoded = verifyJwt(token);
    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded))
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const notes = await Note.find({ userId: decoded.userId }).sort({
      updatedAt: -1,
    });
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const token = (await cookies()).get('auth_token')?.value;
    if (!token)
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );

    const decoded = verifyJwt(token);
    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded))
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título e conteúdo são obrigatórios' },
        { status: 400 }
      );
    }

    const note = await Note.create({
      userId: decoded.userId,
      title,
      content,
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error('Erro ao criar nota:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
