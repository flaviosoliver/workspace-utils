import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';
import TodoList from '@/lib/models/TodoList';
import connectDB from '@/lib/mongodb';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { id } = await params;
    const { name, items } = await request.json();

    const list = await TodoList.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      { $set: { name, items } },
      { new: true }
    );

    if (!list) {
      return NextResponse.json(
        { error: 'Lista não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ list });
  } catch (error) {
    console.error('Erro ao atualizar lista:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { id } = await params;

    const list = await TodoList.findOneAndDelete({
      _id: id,
      userId: decoded.userId
    });

    if (!list) {
      return NextResponse.json(
        { error: 'Lista não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar lista:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}