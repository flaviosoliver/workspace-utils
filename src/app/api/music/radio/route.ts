import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Radio from '@/lib/models/Radio';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

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

    const radios = await Radio.find({}).sort({ name: 1 });

    return NextResponse.json({ radios });
  } catch (error) {
    console.error('Erro ao buscar rádios:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar rádios' },
      { status: 500 }
    );
  }
}
