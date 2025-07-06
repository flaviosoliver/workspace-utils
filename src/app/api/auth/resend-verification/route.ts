import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { encrypt } from '@/lib/encryption';
import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { error: 'E-mail não fornecido.' },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado.' },
        { status: 404 }
      );
    }
    if (user.isVerified) {
      return NextResponse.json(
        { error: 'E-mail já verificado.' },
        { status: 400 }
      );
    }

    const verificationToken = encrypt(
      JSON.stringify({
        email: user.email,
        expires: Date.now() + 24 * 60 * 60 * 1000,
      })
    );
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    try {
      await sendVerificationEmail(user.email, verificationToken, user.name);
    } catch (error) {
      console.error('Erro ao enviar e-mail de verificação:', error);
      return NextResponse.json(
        { error: 'Erro ao enviar e-mail de verificação' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        'Novo e-mail de verificação enviado! Verifique seu e-mail para ativar a conta.',
    });
  } catch (error: any) {
    console.error('Erro ao enviar e-mail de verificação:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar e-mail de verificação.' },
      { status: 500 }
    );
  }
}
