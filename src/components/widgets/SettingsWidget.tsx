'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeSelector from '@/components/ui/ThemeSelector';
import { Settings, User, Palette, Key, Bell } from 'lucide-react';

type SettingsTab = 'profile' | 'theme' | 'api' | 'notifications';

export default function SettingsWidget() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('theme');
  const { user } = useAuth();

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Perfil', icon: User },
    { id: 'theme' as SettingsTab, label: 'Tema', icon: Palette },
    { id: 'api' as SettingsTab, label: 'API Keys', icon: Key },
    { id: 'notifications' as SettingsTab, label: 'Notificações', icon: Bell },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Informações do Perfil
            </h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Nome de usuário
                </label>
                <input
                  aria-label='Nome'
                  type='text'
                  value={user?.name || ''}
                  disabled
                  className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Email
                </label>
                <input
                  aria-label='Email'
                  type='email'
                  value={user?.email || ''}
                  disabled
                  className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white'
                />
              </div>
            </div>
          </div>
        );

      case 'theme':
        return <ThemeSelector />;

      case 'api':
        return (
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Chaves de API
            </h3>
            <p className='text-gray-400 text-sm mb-4'>
              Configure suas chaves de API para usar os serviços de IA e música.
            </p>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  OpenAI API Key
                </label>
                <input
                  type='password'
                  placeholder='sk-...'
                  className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Anthropic API Key
                </label>
                <input
                  type='password'
                  placeholder='sk-ant-...'
                  className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Google API Key
                </label>
                <input
                  type='password'
                  placeholder='AIza...'
                  className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400'
                />
              </div>
            </div>
            <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200'>
              Salvar Chaves de API
            </button>
          </div>
        );

      case 'notifications':
        return (
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Configurações de Notificação
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <label className='text-white font-medium'>
                    Notificações do sistema
                  </label>
                  <p className='text-gray-400 text-sm'>
                    Receber notificações do navegador
                  </p>
                </div>
                <input
                  type='checkbox'
                  defaultChecked={user?.preferences?.notifications}
                  className='w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500'
                />
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <label className='text-white font-medium'>
                    Sons de notificação
                  </label>
                  <p className='text-gray-400 text-sm'>
                    Reproduzir sons para alertas
                  </p>
                </div>
                <input
                  type='checkbox'
                  defaultChecked
                  className='w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500'
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='h-full flex'>
      <div className='w-48 bg-gray-900 border-r border-gray-600 p-4'>
        <div className='flex items-center space-x-2 mb-6'>
          <Settings className='w-5 h-5 text-blue-500' />
          <h2 className='text-lg font-semibold text-white'>Configurações</h2>
        </div>

        <nav className='space-y-1'>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors
                  ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon className='w-4 h-4' />
                <span className='text-sm'>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className='flex-1 p-6 overflow-y-auto'>{renderTabContent()}</div>
    </div>
  );
}
