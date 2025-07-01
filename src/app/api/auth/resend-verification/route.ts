import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { encrypt } from '@/lib/encryption';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
  host: process.env.ZOHOMAIL_HOST,
  port: Number(process.env.ZOHOMAIL_PORT),
  secure: process.env.ZOHOMAIL_SECURE === 'true',
  auth: {
    user: process.env.ZOHOMAIL_USER,
    pass: process.env.ZOHOMAIL_PASS,
  },
});

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

    await transporter.sendMail({
      from: `Workspace Utils <${process.env.ZOHOMAIL_USER}>`,
      to: user.email,
      subject: 'Verifique seu e-mail',
      html: `
        <p>Olá ${user.name},</p>
        <p>Por favor, para concluir a inscrição, verifique seu e-mail clicando no link abaixo:</p>
        <a href="${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}">
        Verificar E-mail
        </a>
        <br />
        <p>Se você não se inscreveu, ignore este e-mail.</p>
        <p>Se o link não funcionar, copie e cole a URL abaixo no seu navegador:</p>
        <p>${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}</p>
        <p>Obrigado por se inscrever!</p>
        <br />
        <p>Este link expirará em 24 horas.</p>
      `,
    });

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
