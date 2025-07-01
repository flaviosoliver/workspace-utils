'use client';

import AuthPage from '@/app/auth/page';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import {
  TasksWidget,
  TimerWidget,
  PomodoroWidget,
  TodoWidget,
  NotesWidget,
  MusicWidget,
  DataGeneratorWidget,
  AIChatWidget,
  SettingsWidget,
  WaterReminderWidget,
} from '@/components/widgets';
import { Sidebar } from '@/components/layout';
import { Window } from '@/components/ui';

const WidgetComponents = {
  tasks: () => <TasksWidget />,
  timer: () => <TimerWidget />,
  pomodoro: () => <PomodoroWidget />,
  todo: () => <TodoWidget />,
  notes: () => <NotesWidget />,
  music: () => <MusicWidget />,
  dataGenerator: () => <DataGeneratorWidget />,
  aiChat: () => <AIChatWidget />,
  settings: () => <SettingsWidget />,
  water: () => (
    <WaterReminderWidget
      onClose={function (): void {
        throw new Error('Function not implemented.');
      }}
    />
  ),
};

export default function WorkspaceLayout() {
  const { user, loading } = useAuth();
  const { widgets, activeWidgets } = useWorkspace();

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden'>
      <Sidebar />

      <div className='ml-16 h-screen relative'>
        <div className='absolute inset-0 opacity-5'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `
              radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2px, transparent 0),
              radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 1px, transparent 0)
            `,
              backgroundSize: '100px 100px',
            }}
          ></div>
        </div>

        {activeWidgets.length === 0 && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-center'>
              <h1 className='text-4xl font-bold text-white mb-4'>
                Bem-vindo, {user.name}!
              </h1>
              <p className='text-gray-400 text-lg mb-8'>
                Clique nos ícones da barra lateral para abrir os widgets
              </p>
              <div className='flex items-center justify-center space-x-4 text-gray-500'>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                  <span>Ambiente de trabalho ativo</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {widgets
          .filter((widget) => activeWidgets.includes(widget.id))
          .map((widget) => {
            const WidgetComponent = WidgetComponents[widget.type];
            return (
              <Window key={widget.id} widget={widget}>
                <WidgetComponent />
              </Window>
            );
          })}
      </div>
    </div>
  );
}
