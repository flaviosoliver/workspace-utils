'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

export default function TimerWidget() {
  const [time, setTime] = useState(0); // em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25);
  const [inputSeconds, setInputSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            // Notificação quando o timer termina
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Timer Finalizado!', {
                body: 'Seu timer chegou ao fim.',
                icon: '/favicon.ico'
              });
            }
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (time === 0) {
      const totalSeconds = inputMinutes * 60 + inputSeconds;
      if (totalSeconds > 0) {
        setTime(totalSeconds);
        setIsRunning(true);
      }
    } else {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const setPresetTime = (minutes: number) => {
    setInputMinutes(minutes);
    setInputSeconds(0);
    if (!isRunning) {
      setTime(0);
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const progress = time > 0 ? ((inputMinutes * 60 + inputSeconds - time) / (inputMinutes * 60 + inputSeconds)) * 100 : 0;

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Timer</h2>
      </div>

      {/* Display do Timer */}
      <div className="relative mb-8">
        <div className="w-48 h-48 rounded-full border-4 border-gray-700 flex items-center justify-center relative overflow-hidden">
          {/* Barra de progresso circular */}
          <div 
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              background: `conic-gradient(#3b82f6 ${progress * 3.6}deg, transparent 0deg)`,
              mask: 'radial-gradient(circle, transparent 50%, black 50%)',
              WebkitMask: 'radial-gradient(circle, transparent 50%, black 50%)'
            }}
          />
          <div className="text-4xl font-mono font-bold text-white z-10">
            {time > 0 ? formatTime(time) : formatTime(inputMinutes * 60 + inputSeconds)}
          </div>
        </div>
      </div>

      {/* Configuração de Tempo */}
      {!isRunning && time === 0 && (
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400 w-16">Minutos:</label>
            <input
              type="number"
              min="0"
              max="999"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center focus:outline-none focus:border-blue-500"
            />
            <label className="text-sm text-gray-400 w-16">Segundos:</label>
            <input
              type="number"
              min="0"
              max="59"
              value={inputSeconds}
              onChange={(e) => setInputSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Presets */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setPresetTime(5)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              5min
            </button>
            <button
              onClick={() => setPresetTime(10)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              10min
            </button>
            <button
              onClick={() => setPresetTime(15)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              15min
            </button>
            <button
              onClick={() => setPresetTime(25)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              25min
            </button>
          </div>
        </div>
      )}

      {/* Controles */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={startTimer}
            disabled={time === 0 && inputMinutes === 0 && inputSeconds === 0}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Play className="w-5 h-5" />
            Iniciar
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            <Pause className="w-5 h-5" />
            Pausar
          </button>
        )}

        <button
          onClick={resetTimer}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {/* Status */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          {isRunning ? 'Timer em execução...' : time > 0 ? 'Timer pausado' : 'Configure o tempo e inicie'}
        </p>
        {time > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Tempo restante: {formatTime(time)}
          </p>
        )}
      </div>
    </div>
  );
}

