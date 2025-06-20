'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings } from 'lucide-react';

type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  workDuration: number; // em minutos
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export default function PomodoroWidget() {
  const [time, setTime] = useState(0); // em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<PomodoroPhase>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Inicializar com tempo de trabalho
    setTime(settings.workDuration * 60);
  }, [settings.workDuration]);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  const handlePhaseComplete = () => {
    setIsRunning(false);
    
    // Notificação
    if ('Notification' in window && Notification.permission === 'granted') {
      const messages = {
        work: 'Hora do intervalo! Descanse um pouco.',
        shortBreak: 'Intervalo terminado! Hora de voltar ao trabalho.',
        longBreak: 'Intervalo longo terminado! Pronto para mais uma sessão?'
      };
      
      new Notification('Pomodoro', {
        body: messages[currentPhase],
        icon: '/favicon.ico'
      });
    }

    // Determinar próxima fase
    if (currentPhase === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      if (newCompletedSessions % settings.sessionsUntilLongBreak === 0) {
        setCurrentPhase('longBreak');
        setTime(settings.longBreakDuration * 60);
      } else {
        setCurrentPhase('shortBreak');
        setTime(settings.shortBreakDuration * 60);
      }
    } else {
      setCurrentPhase('work');
      setTime(settings.workDuration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const duration = currentPhase === 'work' ? settings.workDuration :
                    currentPhase === 'shortBreak' ? settings.shortBreakDuration :
                    settings.longBreakDuration;
    setTime(duration * 60);
  };

  const skipPhase = () => {
    handlePhaseComplete();
  };

  const resetSession = () => {
    setIsRunning(false);
    setCurrentPhase('work');
    setCompletedSessions(0);
    setTime(settings.workDuration * 60);
  };

  const getPhaseInfo = () => {
    switch (currentPhase) {
      case 'work':
        return {
          title: 'Foco no Trabalho',
          icon: <Brain className="w-6 h-6 text-red-400" />,
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500'
        };
      case 'shortBreak':
        return {
          title: 'Intervalo Curto',
          icon: <Coffee className="w-6 h-6 text-green-400" />,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500'
        };
      case 'longBreak':
        return {
          title: 'Intervalo Longo',
          icon: <Coffee className="w-6 h-6 text-blue-400" />,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500'
        };
    }
  };

  const phaseInfo = getPhaseInfo();
  const totalDuration = currentPhase === 'work' ? settings.workDuration * 60 :
                       currentPhase === 'shortBreak' ? settings.shortBreakDuration * 60 :
                       settings.longBreakDuration * 60;
  const progress = ((totalDuration - time) / totalDuration) * 100;

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {phaseInfo.icon}
          <h2 className={`text-xl font-semibold ${phaseInfo.color}`}>
            {phaseInfo.title}
          </h2>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Configurações</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Trabalho (min)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.workDuration}
                onChange={(e) => setSettings({...settings, workDuration: parseInt(e.target.value) || 25})}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Intervalo Curto (min)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.shortBreakDuration}
                onChange={(e) => setSettings({...settings, shortBreakDuration: parseInt(e.target.value) || 5})}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Intervalo Longo (min)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.longBreakDuration}
                onChange={(e) => setSettings({...settings, longBreakDuration: parseInt(e.target.value) || 15})}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sessões até intervalo longo</label>
              <input
                type="number"
                min="2"
                max="10"
                value={settings.sessionsUntilLongBreak}
                onChange={(e) => setSettings({...settings, sessionsUntilLongBreak: parseInt(e.target.value) || 4})}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className={`relative mb-6 p-6 rounded-full border-4 ${phaseInfo.borderColor} ${phaseInfo.bgColor}`}>
          <div className="w-32 h-32 flex items-center justify-center">
            <div className="text-3xl font-mono font-bold text-white">
              {formatTime(time)}
            </div>
          </div>
          {/* Progress ring */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${phaseInfo.color.replace('text-', '')} ${progress * 3.6}deg, transparent 0deg)`,
              mask: 'radial-gradient(circle, transparent 45%, black 45%, black 55%, transparent 55%)',
              WebkitMask: 'radial-gradient(circle, transparent 45%, black 45%, black 55%, transparent 55%)'
            }}
          />
        </div>

        {/* Session Counter */}
        <div className="mb-6 text-center">
          <p className="text-lg text-white">Sessão {completedSessions + 1}</p>
          <p className="text-sm text-gray-400">
            {completedSessions} sessões completadas
          </p>
          <div className="flex justify-center mt-2 gap-1">
            {Array.from({ length: settings.sessionsUntilLongBreak }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < (completedSessions % settings.sessionsUntilLongBreak)
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              Iniciar
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
            >
              <Pause className="w-4 h-4" />
              Pausar
            </button>
          )}

          <button
            onClick={resetTimer}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            onClick={skipPhase}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Pular
          </button>
        </div>

        <button
          onClick={resetSession}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
        >
          Reiniciar Sessão
        </button>
      </div>
    </div>
  );
}

