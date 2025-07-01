'use client';

import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Calendar, Circle } from 'lucide-react';
import { Task } from '@/types';

export default function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<
    'low' | 'medium' | 'high'
  >('medium');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [referenceDate, setReferenceDate] = useState(() => {
    const today = new Date();
    const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  });
  const [error, setError] = useState<string | null>(null);

  function formatDate(date: Date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchTasks(viewMode, referenceDate, debouncedSearch);
  }, [viewMode, referenceDate, debouncedSearch]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (
    view = viewMode,
    date = referenceDate,
    searchText = debouncedSearch
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        view,
        date,
        search: searchText,
      });
      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (
      !newTaskTitle.trim() ||
      !referenceDate ||
      !newTaskTime ||
      !newTaskPriority
    ) {
      setError(
        'Por favor, preencha todos os campos obrigatórios (título, data, hora e prioridade)'
      );
      return;
    }

    const task = {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      date: referenceDate,
      time: newTaskTime,
      duration: Number(newTaskDuration) || 0,
      priority: newTaskPriority,
      completed: false,
      createdAt: new Date(),
      _id: '',
      userId: '',
      updatedAt: new Date(),
    };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks([...tasks, data.task]);

        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskTime('');
        setNewTaskDuration('');
        setNewTaskPriority('medium');
        setError(null);
      } else {
        const error = await response.json();
        setError(error.error || 'Erro ao criar tarefa');
      }
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      setError('Erro ao criar tarefa. Por favor, tente novamente.');
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (response.ok) {
        setTasks(
          tasks.map((t) =>
            t._id === taskId ? { ...t, completed: !t.completed } : t
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter((t) => t._id !== taskId));
      }
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-500/10';
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'low':
        return 'border-green-500 bg-green-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const todayTasks = tasks.filter((task) => {
    const today = new Date().toDateString();
    const taskDate = new Date(task.createdAt).toDateString();
    return today === taskDate;
  });

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const now = new Date();
    tasks.forEach((task) => {
      if (!task.completed && task.date === formatDate(now)) {
        const [hour, minute] = task.time.split(':').map(Number);
        const taskTime = new Date(task.date + 'T' + task.time);
        const diff = taskTime.getTime() - now.getTime();
        if (diff > 0) {
          setTimeout(() => {
            new Notification('Lembrete de Tarefa', {
              body: `${task.title} (${task.time})`,
            });
          }, diff);
        }
      }
    });
  }, [tasks]);

  const handleViewModeChange = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
    fetchTasks(mode, referenceDate, debouncedSearch);
  };

  if (loading) {
    return (
      <div className='p-4 text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto'></div>
        <p className='mt-2 text-sm text-gray-400'>Carregando tarefas...</p>
      </div>
    );
  }

  return (
    <div className='p-4 h-full flex flex-col'>
      <div className='flex items-center gap-2 mb-4'>
        <Calendar className='w-5 h-5 text-blue-400' />
        <h2 className='text-lg font-semibold text-white'>Tarefas de Hoje</h2>
        <span className='text-sm text-gray-400'>({todayTasks.length})</span>
      </div>

      <div className='flex gap-2 mb-4'>
        <button
          onClick={() => handleViewModeChange('day')}
          className={`px-3 py-2 rounded-lg transition-all ${
            viewMode === 'day'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Dia
        </button>
        <button
          onClick={() => handleViewModeChange('week')}
          className={`px-3 py-2 rounded-lg transition-all ${
            viewMode === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Semana
        </button>
        <button
          onClick={() => handleViewModeChange('month')}
          className={`px-3 py-2 rounded-lg transition-all ${
            viewMode === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Mês
        </button>
      </div>

      <div className='mb-4 space-y-2'>
        {error && (
          <div className='bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6'>
            {error}
          </div>
        )}
        <div className='flex gap-2'>
          <input
            type='text'
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder='Nome da tarefa'
            className='flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <select
            aria-label='Selecione a prioridade'
            value={newTaskPriority}
            onChange={(e) =>
              setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')
            }
            className='px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500'
          >
            <option value='low'>Baixa</option>
            <option value='medium'>Média</option>
            <option value='high'>Alta</option>
          </select>
        </div>
        <div className='flex gap-2'>
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder='Descrição (opcional)'
            className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
            rows={2}
          />
        </div>
        <div className='block space-x-2 space-y-2'>
          <input
            aria-label='Data'
            type='date'
            value={referenceDate}
            onChange={(e) => {
              setReferenceDate(e.target.value);
              fetchTasks(viewMode, e.target.value, debouncedSearch);
            }}
            className='px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
            required
          />
          <input
            aria-label='Hora'
            type='time'
            value={newTaskTime}
            onChange={(e) => setNewTaskTime(e.target.value)}
            className='px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
            required
          />
          <input
            type='number'
            value={newTaskDuration}
            onChange={(e) => setNewTaskDuration(Number(e.target.value))}
            placeholder='Duração (min)'
            className='px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 w-36'
          />
          <button
            aria-label='Adicionar tarefa'
            onClick={addTask}
            className='px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
          >
            <Plus className='w-4 h-4' />
          </button>
        </div>
      </div>

      <div className='mb-4'>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Pesquisar tarefa...'
          className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
        />
      </div>

      <div className='flex-1 overflow-y-auto space-y-2'>
        {filteredTasks.length === 0 ? (
          <div className='text-center py-8 text-gray-400'>
            <Calendar className='w-12 h-12 mx-auto mb-2 opacity-50' />
            <p>Nenhuma tarefa para hoje</p>
            <p className='text-sm'>Adicione uma nova tarefa acima</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`p-3 rounded-lg border ${getPriorityColor(
                task.priority
              )} ${task.completed ? 'opacity-60' : ''}`}
            >
              <div className='flex items-start gap-3'>
                <button
                  onClick={() => toggleTaskCompletion(task._id)}
                  className={
                    task.completed ? 'text-green-500' : 'text-gray-400'
                  }
                >
                  {task.completed ? <Check /> : <Circle />}
                </button>

                <div className='flex-1'>
                  <h3
                    className={`font-medium ${
                      task.completed
                        ? 'line-through text-gray-400'
                        : 'text-white'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className='text-sm text-gray-400 mt-1'>
                      {task.description}
                    </p>
                  )}
                  <div className='flex items-center gap-2 mt-2'>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        task.priority === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : task.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {task.priority === 'high'
                        ? 'Alta'
                        : task.priority === 'medium'
                        ? 'Média'
                        : 'Baixa'}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {task.date
                        ? (() => {
                            const [year, month, day] = task.date.split('-');
                            return `${day}/${month}/${year}`;
                          })()
                        : ''}
                      {' - '}
                      {task.time}h
                    </span>
                    {task.duration > 0 && (
                      <span className='text-xs text-gray-500'>
                        Duração: {task.duration} min
                      </span>
                    )}
                  </div>
                </div>

                <button
                  aria-label='Deletar tarefa'
                  onClick={() => deleteTask(task._id)}
                  className='text-gray-400 hover:text-red-400 transition-colors'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className='mt-4 pt-4 border-t border-gray-700'>
        <div className='flex justify-between text-sm text-gray-400'>
          <span>
            Concluídas: {todayTasks.filter((t) => t.completed).length}
          </span>
          <span>
            Pendentes: {todayTasks.filter((t) => !t.completed).length}
          </span>
        </div>
      </div>
    </div>
  );
}
