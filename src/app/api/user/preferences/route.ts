import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { verifyToken, extractTokenFromRequest } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    // Extrair token do header
    const token = extractTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Token de acesso não fornecido' },
        { status: 401 }
      );
    }

    // Verificar token
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const updates = await request.json();

    // Validar campos permitidos
    const allowedFields = ['theme', 'language', 'timezone', 'notifications'];
    const preferences: any = {};

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        preferences[`preferences.${key}`] = updates[key];
      }
    });

    if (Object.keys(preferences).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo válido fornecido' },
        { status: 400 }
      );
    }

    // Atualizar usuário
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: preferences },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Preferências atualizadas com sucesso',
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        preferences: user.preferences,
        apiKeys: user.apiKeys,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar preferências:', error);

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
