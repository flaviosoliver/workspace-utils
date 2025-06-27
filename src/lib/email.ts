import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Workspace Utils <noreply@workspace.com>',
      to: [email],
      subject: 'Verificação de E-mail - Workspace Utils',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Bem-vindo ao Workspace Utils!</h2>
          <p>Olá ${name},</p>
          <p>Obrigado por se cadastrar no Workspace Utils. Para ativar sua conta, clique no link abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verificar E-mail
            </a>
          </div>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>Este link expira em 24 horas.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Se você não se cadastrou no Workspace Utils, ignore este e-mail.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Erro ao enviar e-mail de verificação:', error);
      throw new Error('Falha ao enviar e-mail de verificação');
    }

    return data;
  } catch (error) {
    console.error('Erro no serviço de e-mail:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Workspace Utils <noreply@workspace.com>',
      to: [email],
      subject: 'Redefinição de Senha - Workspace Utils',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Redefinição de Senha</h2>
          <p>Olá ${name},</p>
          <p>Você solicitou a redefinição da sua senha no Workspace Utils. Clique no link abaixo para criar uma nova senha:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Redefinir Senha
            </a>
          </div>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>Este link expira em 1 hora.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Se você não solicitou a redefinição de senha, ignore este e-mail.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Erro ao enviar e-mail de redefinição:', error);
      throw new Error('Falha ao enviar e-mail de redefinição');
    }

    return data;
  } catch (error) {
    console.error('Erro no serviço de e-mail:', error);
    throw error;
  }
}
