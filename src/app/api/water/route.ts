import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WaterIntake from '@/lib/models/WaterIntake';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
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

    await connectDB();

    const { searchParams } = new URL(request.url);
    const date =
      searchParams.get('date') || new Date().toISOString().split('T')[0];

    const waterIntakes = await WaterIntake.find({
      userId: decoded.userId,
      date,
    }).sort({ timestamp: 1 });

    const totalAmount = waterIntakes.reduce(
      (sum, intake) => sum + intake.amount,
      0
    );

    return NextResponse.json({
      intakes: waterIntakes,
      totalAmount,
      date,
    });
  } catch (error) {
    console.error('Erro ao buscar consumo de água:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
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

    await connectDB();

    const { amount, timestamp } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Quantidade deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (amount > 2000) {
      return NextResponse.json(
        { error: 'Quantidade máxima por registro é 2000ml' },
        { status: 400 }
      );
    }

    const intakeTimestamp = timestamp ? new Date(timestamp) : new Date();
    const date = intakeTimestamp.toISOString().split('T')[0];

    const waterIntake = new WaterIntake({
      userId: decoded.userId,
      amount,
      timestamp: intakeTimestamp,
      date,
    });

    await waterIntake.save();

    return NextResponse.json(
      {
        message: 'Consumo de água registrado com sucesso',
        intake: waterIntake,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao registrar consumo de água:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
