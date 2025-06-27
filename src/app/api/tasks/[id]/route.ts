import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Task } from '@/lib/models';
import { verifyToken } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = await params;

    await connectDB();
    const task = await Task.findOne({ _id: id, userId: decoded.userId });

    if (!task) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      );
    }

    Object.assign(task, body);
    await task.save();

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();
    const task = await Task.findOneAndDelete({
      _id: id,
      userId: decoded.userId,
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
