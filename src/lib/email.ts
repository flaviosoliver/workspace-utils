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

let mailOptions = {
  from: '',
  to: '',
  subject: '',
  html: '',
};

export async function sendRegisterEmail(
  email: string,
  verificationToken: string,
  name: string
) {
  mailOptions = {
    from: process.env.ZOHOMAIL_USER,
    to: email,
    subject: 'Confirmação de Registro - Workspace Utils',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Olá ${name},</h2>
        <p>Obrigado por se registrar no Workspace Utils!</p>
        <p>Para completar seu registro, por favor verifique seu e-mail clicando no botão abaixo:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verificar E-mail</a>
        </div>
        <p>Se o link não funcionar, copie e cole a URL abaixo no seu navegador:</p>
        <p>${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}</p>
        <p>Este link expira em 24 horas.</p>
        <p>Se você não se inscreveu, ignore este e-mail.</p>
        <hr style="margin: 30px 0; border: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">Este é um e-mail automático, por favor não responda.</p>
      </div>
    `,
  };
}

export async function sendVerificationEmail(
  email: string,
  verificationToken: string,
  name: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

  mailOptions = {
    from: process.env.ZOHOMAIL_USER,
    to: email,
    subject: 'Verificação de E-mail - Workspace Utils',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Olá ${name},</h2>
        <p>Obrigado por se registrar no Workspace Utils!</p>
        <p>Para completar seu registro, por favor verifique seu e-mail clicando no botão abaixo:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verificar E-mail</a>
        </div>
        <p>Se o link não funcionar, copie e cole a URL abaixo no seu navegador:</p>
        <p>${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}</p>
        <p>Este link expira em 24 horas.</p>
        <p>Se você não se inscreveu, ignore este e-mail.</p>
        <hr style="margin: 30px 0; border: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">Este é um e-mail automático, por favor não responda.</p>
      </div>
    `,
  };
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  mailOptions = {
    from: process.env.ZOHOMAIL_USER,
    to: email,
    subject: 'Redefinição de Senha - Workspace Utils',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Olá ${name},</h2>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Redefinir Senha</a>
        </div>
        <p>Se o link não funcionar, copie e cole a URL abaixo no seu navegador:</p>
        <p>${resetUrl}</p>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou a redefinição de senha, ignore este e-mail.</p>
        <hr style="margin: 30px 0; border: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">Este é um e-mail automático, por favor não responda.</p>
        </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
