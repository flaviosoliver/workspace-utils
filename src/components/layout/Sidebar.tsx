'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';
import { WidgetType } from '@/types';
import {
  CheckSquare,
  Clock,
  Timer,
  ListTodo,
  StickyNote,
  Music,
  Database,
  MessageSquare,
  Settings,
  LogOut,
  Droplet,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const widgetIcons: Record<
  WidgetType,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  tasks: CheckSquare,
  timer: Clock,
  pomodoro: Timer,
  todo: ListTodo,
  notes: StickyNote,
  music: Music,
  dataGenerator: Database,
  aiChat: MessageSquare,
  water: Droplet,
};

const widgetLabels: Record<WidgetType, string> = {
  tasks: 'Tarefas',
  timer: 'Timer',
  pomodoro: 'Pomodoro',
  todo: 'To-Do',
  notes: 'Notas',
  music: 'Música',
  dataGenerator: 'Dados',
  aiChat: 'Chat IA',
  water: 'Água',
};

export default function Sidebar() {
  const { openWidget, widgets, activeWidgets } = useWorkspace();
  const { logout, user } = useAuth();

  const handleWidgetClick = (type: WidgetType) => {
    openWidget(type);
  };

  const isWidgetActive = (type: WidgetType) => {
    return widgets.some((w) => w.type === type && activeWidgets.includes(w.id));
  };

  return (
    <div className='fixed left-0 top-0 h-full w-16 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-4 z-50'>
      {/* Logo/Avatar */}
      <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6'>
        <span className='text-white font-bold text-sm'>
          {user?.username?.charAt(0).toUpperCase() || 'W'}
        </span>
      </div>

      {/* Widget Icons */}
      <div className='flex flex-col space-y-2 flex-1'>
        {(Object.keys(widgetIcons) as WidgetType[]).map((type) => {
          const Icon = widgetIcons[type];
          const isActive = isWidgetActive(type);

          return (
            <button
              key={type}
              onClick={() => handleWidgetClick(type)}
              className={`
                w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200
                ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }
                group relative
              `}
              title={widgetLabels[type]}
            >
              <Icon className='w-6 h-6' />

              {/* Tooltip */}
              <div className='absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'>
                {widgetLabels[type]}
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className='absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r'></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className='flex flex-col space-y-2'>
        <button
          onClick={() => handleWidgetClick('settings' as WidgetType)}
          className='w-12 h-12 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white flex items-center justify-center transition-all duration-200 group relative'
          title='Configurações'
        >
          <Settings className='w-6 h-6' />
          <div className='absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'>
            Configurações
          </div>
        </button>

        <button
          onClick={logout}
          className='w-12 h-12 rounded-lg bg-gray-800 text-gray-400 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all duration-200 group relative'
          title='Sair'
        >
          <LogOut className='w-6 h-6' />
          <div className='absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'>
            Sair
          </div>
        </button>
      </div>
    </div>
  );
}
