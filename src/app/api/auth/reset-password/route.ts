import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { hashPassword } from '@/lib/encryption';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { token, password, confirmPassword } = await request.json();

    // Validações
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'As senhas não coincidem' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Buscar usuário pelo token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token de redefinição inválido ou expirado' },
        { status: 400 }
      );
    }

    // Atualizar senha
    const hashedPassword = hashPassword(password);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    return NextResponse.json({
      message:
        'Senha redefinida com sucesso! Você pode fazer login com sua nova senha.',
    });
  } catch (error) {
    console.error('Erro na redefinição de senha:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
