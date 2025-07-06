'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token não fornecido');
      setLoading(false);
      return;
    }

    // Valida o token
    fetch(`/api/auth/reset-password?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setTokenValid(true);
        } else {
          setError(data.error || 'Token inválido');
        }
      })
      .catch(() => setError('Erro ao validar token'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setError('');
        setTimeout(() => router.push('/'), 3000);
      } else {
        setError(data.error || 'Erro ao redefinir senha');
      }
    } catch (error) {
      setError('Erro ao processar solicitação');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-900'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
      </div>
    );
  }

  if (!tokenValid && !loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-900'>
        <div className='bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full'>
          <div className='text-red-500 text-center'>
            <p>{error || 'Token inválido ou expirado'}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className='mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200'
          >
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900'>
      <div className='bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full'>
        <h2 className='text-2xl font-bold text-white text-center mb-6'>
          Redefinir Senha
        </h2>

        {error && (
          <div className='bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6'>
            {error}
          </div>
        )}

        {success ? (
          <div className='bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded text-center'>
            <p>Senha atualizada com sucesso!</p>
            <p className='text-sm mt-2'>Redirecionando para o login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-300 mb-2'
              >
                Nova Senha
              </label>
              <div className='relative'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10'
                  placeholder='Digite sua nova senha'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-300 mb-2'
              >
                Confirmar Senha
              </label>
              <div className='relative'>
                <input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10'
                  placeholder='Confirme sua nova senha'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200'
            >
              Redefinir Senha
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
