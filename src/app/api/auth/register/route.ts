import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { encrypt } from '@/lib/encryption';
import { sendRegisterEmail } from '@/lib/email';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, name, password, confirmPassword } = await request.json();

    if (!email || !name || !password || !confirmPassword) {
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

    const existingUserByEmail = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Este e-mail já está cadastrado' },
        { status: 400 }
      );
    }

    const verificationToken = encrypt(
      JSON.stringify({
        email: email.toLowerCase().trim(),
        expires: Date.now() + 24 * 60 * 60 * 1000,
      })
    );
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = new User({
      email: email.toLowerCase().trim(),
      name,
      password,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    user.password = await hashPassword(password);

    await user.save();

    try {
      await sendRegisterEmail(user.email, verificationToken, user.name);
    } catch (emailError) {
      console.error('Erro ao enviar e-mail de ativação:', emailError);
      return NextResponse.json(
        { error: 'Erro ao enviar e-mail de ativação' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          'Usuário criado com sucesso! Verifique seu e-mail para ativar a conta.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro na criação do usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
