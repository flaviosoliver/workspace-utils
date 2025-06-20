import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, username, password } = await request.json();

    // Validação básica
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username e password são obrigatórios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email ou username já está em uso' },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    // Criar usuário
    const user = new User({
      email,
      username,
      password: hashedPassword,
    });

    await user.save();

    // Gerar token
    const token = generateToken(user._id.toString());

    // Retornar dados do usuário (sem senha)
    const userResponse = {
      _id: user._id,
      email: user.email,
      username: user.username,
      preferences: user.preferences,
      apiKeys: user.apiKeys,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso',
        user: userResponse,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro no registro:', error);

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
