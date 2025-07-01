import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { encrypt } from '@/lib/encryption';
import nodemailer from 'nodemailer';

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

    await user.save();

    async function sendMail(to: string, subject: string, html: string) {
      await transporter.sendMail({
        from: `"Workspace Utils" <${process.env.ZOHOMAIL_USER}>`,
        to,
        subject,
        html,
      });
    }

    await sendMail(
      email,
      'Verifique seu e-mail',
      `
      <p>Olá ${name},</p>
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
    `
    );

    return NextResponse.json(
      {
        message:
          'Usuário criado com sucesso! Verifique seu e-mail para ativar a conta.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
