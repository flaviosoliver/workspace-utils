import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';
import Task from '@/lib/models/Task';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'day';
    const date = searchParams.get('date'); // formato YYYY-MM-DD
    const search = searchParams.get('search') || '';

    let filter: any = { userId: decoded.userId };

    const now = new Date();
    if (view === 'day' && date) {
      filter.date = date;
    } else if (view === 'week' && date) {
      const d = new Date(date);
      const weekStart = new Date(d.setDate(d.getDate() - d.getDay()));
      const weekEnd = new Date(d.setDate(weekStart.getDate() + 6));
      filter.date = {
        $gte: formatDate(weekStart),
        $lte: formatDate(weekEnd),
      };
    } else if (view === 'month' && date) {
      const [year, month] = date.split('-');
      filter.date = { $regex: `^${year}-${month}` };
    } else {
      filter.date = formatDate(now);
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(filter).sort({ time: 1, priority: -1 });
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

function formatDate(date: Date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

export async function POST(request: NextRequest) {
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

    const { title, description, priority, date, time, duration } =
      await request.json();

    if (!title || !date || !time || !priority) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando.' },
        { status: 400 }
      );
    }

    const newTask = {
      userId: decoded.userId,
      title,
      description,
      priority,
      date,
      time,
      duration,
      completed: false,
    };

    console.log('Criando nova tarefa:', newTask);

    const task = await Task.create(newTask);

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
