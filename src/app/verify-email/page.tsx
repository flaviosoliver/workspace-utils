'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const router = useRouter();
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  );
  const [resendStatus, setResendStatus] = useState<
    'idle' | 'sending' | 'sent' | 'error'
  >('idle');
  const [resendMessage, setResendMessage] = useState('');
  const [email, setEmail] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setError('Token não fornecido.');
        return;
      }
      try {
        const res = await fetch('/api/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao verificar e-mail');
        setStatus('success');
        setTimeout(() => router.push('/'), 2000);
      } catch (err) {
        setStatus('error');
        setError(
          err instanceof Error ? err.message : 'Erro ao verificar e-mail'
        );
      }
    };
    verify();
  }, [token]);

  const handleResend = async () => {
    setResendStatus('sending');
    setResendMessage('');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao reenviar e-mail');
      setResendStatus('sent');
      setResendMessage('Novo e-mail de verificação enviado!');
    } catch (err) {
      setResendStatus('error');
      setResendMessage(
        err instanceof Error ? err.message : 'Erro ao reenviar e-mail'
      );
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4'>
      <div className='w-full max-w-md p-0 shadow-2xl'>
        <div>
          <div className='text-center text-2xl font-bold text-white'>
            Verificação de E-mail
          </div>
        </div>
        <div className='text-center space-y-4 p-8'>
          {status === 'verifying' && (
            <p className='text-zinc-300'>Verificando seu e-mail...</p>
          )}
          {status === 'success' && (
            <>
              <p className='text-green-500'>
                E-mail verificado com sucesso! Redirecionando...
              </p>
              <button className='w-full' onClick={() => router.push('/')}>
                Ir para o início
              </button>
            </>
          )}
          {status === 'error' && (
            <>
              <p className='text-red-500'>{error}</p>
              {error.includes('expirado') && (
                <div className='space-y-2'>
                  <input
                    type='email'
                    className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    placeholder='Digite seu e-mail para reenviar'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    className='w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200'
                    onClick={handleResend}
                    disabled={resendStatus === 'sending' || !email}
                  >
                    {resendStatus === 'sending'
                      ? 'Enviando...'
                      : 'Reenviar e-mail de verificação'}
                  </button>
                  {resendMessage && (
                    <p
                      className={
                        resendStatus === 'sent'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }
                    >
                      {resendMessage}
                    </p>
                  )}
                </div>
              )}
              <button
                className='w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200'
                onClick={() => router.push('/')}
              >
                Voltar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
