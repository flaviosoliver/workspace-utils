import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { hashPassword, generateSecureToken } from '@/lib/encryption';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, username, name, password, confirmPassword } =
      await request.json();

    // Validações
    if (!email || !username || !name || !password || !confirmPassword) {
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

    // Verificar se email já existe
    const existingUserByEmail = await User.findOne({
      email: email.toLowerCase(),
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Este e-mail já está cadastrado' },
        { status: 400 }
      );
    }

    // Verificar se username já existe
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'Este nome de usuário já está em uso' },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = hashPassword(password);

    // Gerar token de verificação
    const verificationToken = generateSecureToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Criar usuário
    const user = new User({
      email: email.toLowerCase(),
      username,
      name,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    await user.save();

    // Enviar e-mail de verificação
    // try {
    //   await sendVerificationEmail(email, verificationToken, name);
    // } catch (emailError) {
    //   console.error('Erro ao enviar e-mail de verificação:', emailError);
    //   // Não falhar o registro se o e-mail não for enviado
    // }

    return NextResponse.json(
      {
        message:
          'Usuário criado com sucesso! Verifique seu e-mail para ativar a conta.',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          name: user.name,
          isVerified: user.isVerified,
        },
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
