import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateSecureToken } from '@/lib/encryption';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'E-mail é obrigatório' },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({
        message:
          'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.',
      });
    }

    const resetToken = generateSecureToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = resetTokenExpires;
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);
    } catch (emailError) {
      console.error('Erro ao enviar e-mail de redefinição:', emailError);
      return NextResponse.json(
        { error: 'Erro ao enviar e-mail de redefinição' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message:
        'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.',
    });
  } catch (error) {
    console.error('Erro na solicitação de redefinição de senha:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
