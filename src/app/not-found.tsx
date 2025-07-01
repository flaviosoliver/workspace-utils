'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotFoundPage() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const tokenExists = document.cookie
      .split('; ')
      .some((row) => row.startsWith('auth_token='));
    if (!tokenExists) {
      router.replace('/');
    } else {
      setHasToken(true);
    }
  }, [router]);

  if (hasToken === null) {
    return null;
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4'>
      <div className='w-full max-w-md p-0 shadow-2xl'>
        <div>
          <div className='text-center text-2xl font-bold text-white'>
            Página Não Encontrada
          </div>
        </div>
        <div className='text-center space-y-4 p-8'>
          <p className='text-zinc-300'>
            Desculpe, a página que você está procurando não existe.
          </p>
          <button
            className='w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200'
            onClick={() => router.push('/')}
          >
            Voltar para o início
          </button>
        </div>
      </div>
    </div>
  );
}
