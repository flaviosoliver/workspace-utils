'use client';

import { useState, useEffect } from 'react';
import { Droplets, Plus, Clock, TrendingUp } from 'lucide-react';

interface WaterIntake {
  _id: string;
  amount: number;
  timestamp: string;
}

interface WaterReminderWidgetProps {
  onClose: () => void;
}

export default function WaterReminderWidget({
  onClose,
}: WaterReminderWidgetProps) {
  const [intakes, setIntakes] = useState<WaterIntake[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [reminderInterval, setReminderInterval] = useState(60);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [newAmount, setNewAmount] = useState('250');
  const [loading, setLoading] = useState(false);
  const [lastReminder, setLastReminder] = useState<Date | null>(null);

  useEffect(() => {
    fetchWaterIntakes();
    loadUserPreferences();
  }, []);

  // Atualiza preferências sempre que mudar os estados relevantes
  useEffect(() => {
    saveUserPreferences();
  }, [reminderEnabled, reminderInterval, dailyGoal]);

  // Controla os lembretes
  useEffect(() => {
    if (reminderEnabled && reminderInterval > 0) {
      const interval = setInterval(
        () => {
          showWaterReminder();
        },
        reminderInterval * 60 * 1000
      );

      return () => clearInterval(interval);
    }
  }, [reminderEnabled, reminderInterval, lastReminder]);

  const fetchWaterIntakes = async () => {
    try {
      const response = await fetch('/api/water');
      if (response.ok) {
        const data = await response.json();
        setIntakes(data.intakes);
        setTotalAmount(data.totalAmount);
      }
    } catch (error) {
      console.error('Erro ao buscar consumo de água:', error);
    }
  };

  const loadUserPreferences = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        const waterPrefs = data.user.preferences?.waterReminder;
        if (waterPrefs) {
          setDailyGoal(waterPrefs.dailyGoal || 2000);
          setReminderInterval(waterPrefs.interval || 60);
          setReminderEnabled(waterPrefs.enabled || false);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  };

  const saveUserPreferences = async () => {
    try {
      await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waterReminder: {
            enabled: reminderEnabled,
            dailyGoal,
            interval: reminderInterval,
          },
        }),
      });
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  };

  const addWaterIntake = async () => {
    const amountNumber = parseInt(newAmount);
    if (isNaN(amountNumber) || amountNumber <= 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountNumber }),
      });

      if (response.ok) {
        await fetchWaterIntakes();
        setNewAmount('250');
      }
    } catch (error) {
      console.error('Erro ao registrar consumo:', error);
    } finally {
      setLoading(false);
    }
  };

  const showWaterReminder = async () => {
    const now = new Date();
    if (
      lastReminder &&
      now.getTime() - lastReminder.getTime() < 5 * 60 * 1000
    ) {
      return;
    }
    setLastReminder(now);

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('💧 Hora de beber água!', {
          body: `Você já bebeu ${totalAmount}ml hoje. Meta: ${dailyGoal}ml`,
          icon: '/water-icon.png',
        });
      } else if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('💧 Hora de beber água!', {
            body: `Você já bebeu ${totalAmount}ml hoje. Meta: ${dailyGoal}ml`,
            icon: '/water-icon.png',
          });
        } else {
          alert('💧 Hora de beber água! Mantenha-se hidratado!');
        }
      } else {
        alert('💧 Hora de beber água! Mantenha-se hidratado!');
      }
    } else {
      alert('💧 Hora de beber água! Mantenha-se hidratado!');
    }
  };

  const snoozeReminder = (minutes: number) => {
    const newTime = new Date(Date.now() + minutes * 60 * 1000);
    setLastReminder(newTime);
  };

  const progressPercentage = Math.min((totalAmount / dailyGoal) * 100, 100);

  return (
    <div className='p-4 h-full flex flex-col'>
      {/* Cabeçalho */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Droplets className='w-5 h-5 text-blue-400' />
          <h3 className='text-lg font-semibold'>Lembrete de Água</h3>
        </div>
        <button onClick={onClose} className='text-gray-400 hover:text-white'>
          ✕
        </button>
      </div>

      {/* Progresso */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm text-gray-300'>Progresso Diário</span>
          <span className='text-sm font-medium'>
            {totalAmount}ml / {dailyGoal}ml
          </span>
        </div>
        <div className='w-full bg-gray-700 rounded-full h-3'>
          <div
            className='bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all duration-300'
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className='text-center mt-2 text-sm text-gray-400'>
          {progressPercentage.toFixed(1)}% da meta
        </div>
      </div>

      {/* Registrar Consumo */}
      <div className='mb-6'>
        <label className='block text-sm font-medium mb-2'>
          Registrar Consumo (ml)
        </label>
        <div className='flex gap-2'>
          <input
            type='number'
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className='flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
            placeholder='250'
            min='1'
            max='2000'
          />
          <button
            onClick={addWaterIntake}
            disabled={loading}
            className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50'
          >
            <Plus className='w-4 h-4' />
            {loading ? 'Salvando...' : 'Adicionar'}
          </button>
        </div>

        <div className='flex gap-2 mt-2'>
          {[200, 250, 300, 500].map((amount) => (
            <button
              key={amount}
              onClick={() => setNewAmount(amount.toString())}
              className='bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm'
            >
              {amount}ml
            </button>
          ))}
        </div>
      </div>

      {/* Configurações */}
      <div className='mb-6'>
        <h4 className='text-sm font-medium mb-3 flex items-center gap-2'>
          <Clock className='w-4 h-4' />
          Configurações de Lembrete
        </h4>

        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm'>Ativar Lembretes</span>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={reminderEnabled}
                onChange={(e) => {
                  setReminderEnabled(e.target.checked);
                  if (e.target.checked) {
                    Notification.requestPermission();
                  }
                }}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className='block text-sm mb-1'>Meta Diária (ml)</label>
            <input
              type='number'
              value={dailyGoal}
              onChange={(e) => setDailyGoal(parseInt(e.target.value) || 2000)}
              className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
              min='500'
              max='5000'
            />
          </div>

          <div>
            <label className='block text-sm mb-1'>Intervalo (minutos)</label>
            <input
              type='number'
              value={reminderInterval}
              onChange={(e) =>
                setReminderInterval(parseInt(e.target.value) || 60)
              }
              className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
              min='15'
              max='240'
            />
          </div>
        </div>

        {reminderEnabled && (
          <div className='mt-3'>
            <span className='text-sm text-gray-400 block mb-2'>
              Adiar próximo lembrete:
            </span>
            <div className='flex gap-2'>
              {[10, 20, 40].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => snoozeReminder(minutes)}
                  className='bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm'
                >
                  {minutes}min
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Histórico */}
      <div className='flex-1 overflow-hidden'>
        <h4 className='text-sm font-medium mb-3 flex items-center gap-2'>
          <TrendingUp className='w-4 h-4' />
          Hoje ({intakes.length} registros)
        </h4>

        <div className='space-y-2 max-h-32 overflow-y-auto'>
          {intakes.length === 0 ? (
            <p className='text-gray-400 text-sm'>
              Nenhum consumo registrado hoje
            </p>
          ) : (
            intakes
              .slice(-5)
              .reverse()
              .map((intake) => (
                <div
                  key={intake._id}
                  className='flex justify-between items-center bg-gray-700 rounded px-3 py-2'
                >
                  <span className='text-sm'>{intake.amount}ml</span>
                  <span className='text-xs text-gray-400'>
                    {new Date(intake.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
