'use client';

import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Circle } from 'lucide-react';
import { TodoList, TodoItem } from '@/types';

export default function TodoWidget() {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [selectedList, setSelectedList] = useState<TodoList | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch('/api/todolists');
      if (response.ok) {
        const data = await response.json();
        setLists(data.lists);
      }
    } catch (error) {
      console.error('Erro ao buscar listas:', error);
    }
  };

  const createList = async () => {
    if (!newListName.trim()) return;

    try {
      const response = await fetch('/api/todolists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setLists([...lists, data.list]);
        setNewListName('');
      }
    } catch (error) {
      console.error('Erro ao criar lista:', error);
    }
  };

  const deleteList = async (listId: string) => {
    try {
      const response = await fetch(`/api/todolists/${listId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLists(lists.filter((list) => list._id !== listId));
        if (selectedList?._id === listId) {
          setSelectedList(null);
        }
      }
    } catch (error) {
      console.error('Erro ao deletar lista:', error);
    }
  };

  const addItem = async () => {
    if (!selectedList || !newItemText.trim()) return;

    const newItem: TodoItem = {
      text: newItemText.trim(),
      completed: false,
      createdAt: new Date(),
    };

    try {
      const updatedItems = [...selectedList.items, newItem];
      const response = await fetch(`/api/todolists/${selectedList._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedList.name,
          items: updatedItems,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedList(data.list);
        setLists(
          lists.map((list) =>
            list._id === selectedList._id ? data.list : list
          )
        );
        setNewItemText('');
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const toggleItem = async (index: number) => {
    if (!selectedList) return;

    const updatedItems = selectedList.items.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );

    try {
      const response = await fetch(`/api/todolists/${selectedList._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedList.name,
          items: updatedItems,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedList(data.list);
        setLists(
          lists.map((list) =>
            list._id === selectedList._id ? data.list : list
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    }
  };

  const deleteItem = async (index: number) => {
    if (!selectedList) return;

    const updatedItems = selectedList.items.filter((_, i) => i !== index);

    try {
      const response = await fetch(`/api/todolists/${selectedList._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedList.name,
          items: updatedItems,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedList(data.list);
        setLists(
          lists.map((list) =>
            list._id === selectedList._id ? data.list : list
          )
        );
      }
    } catch (error) {
      console.error('Erro ao deletar item:', error);
    }
  };

  return (
    <div className='flex h-full'>
      <div className='w-64 bg-gray-800 p-4 border-r border-gray-700'>
        <div className='mb-4 flex gap-2 items-center'>
          <input
            type='text'
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder='Nome da nova lista'
            className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
          />
          <button
            aria-label='Criar lista'
            type='button'
            onClick={createList}
            className='px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
          >
            <Plus className='w-4 h-4' />
          </button>
        </div>

        <div className='space-y-2'>
          {lists.map((list) => (
            <div
              key={list._id}
              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer ${
                selectedList?._id === list._id
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              }`}
              onClick={() => setSelectedList(list)}
            >
              <span className='truncate'>{list.name}</span>
              <button
                aria-label='Deletar lista'
                onClick={(e) => {
                  e.stopPropagation();
                  deleteList(list._id);
                }}
                className='text-gray-400 hover:text-red-500'
              >
                <Trash2 className='w-4 h-4' />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className='flex-1 p-4 flex flex-col relative'>
        {selectedList ? (
          <>
            <div className='mb-4 flex gap-2 items-center'>
              <input
                type='text'
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder='Novo item'
                className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
              <button
                aria-label='Adicionar item'
                onClick={addItem}
                className='px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
              >
                <Plus className='w-4 h-4' />
              </button>
            </div>

            <div className='space-y-2 flex-1 overflow-y-auto pb-20'>
              {selectedList.items.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700'
                >
                  <div className='flex items-center space-x-3'>
                    <button
                      onClick={() => toggleItem(index)}
                      className={`${
                        item.completed ? 'text-green-500' : 'text-gray-400'
                      }`}
                    >
                      {item.completed ? <Check /> : <Circle />}
                    </button>
                    <span
                      className={
                        item.completed
                          ? 'line-through text-gray-500'
                          : 'text-white'
                      }
                    >
                      {item.text}
                    </span>
                  </div>
                  <button
                    aria-label='Deletar item'
                    onClick={() => deleteItem(index)}
                    className='text-gray-400 hover:text-red-500'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              ))}
            </div>

            <div className='absolute bottom-0 left-0 w-full border-t border-gray-700 p-4'>
              <div className='flex justify-between text-sm text-gray-400'>
                <span>
                  Concluídos:{' '}
                  {selectedList.items.filter((item) => item.completed).length}
                </span>
                <span>
                  Pendentes:{' '}
                  {selectedList.items.filter((item) => !item.completed).length}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className='flex items-center justify-center h-full text-gray-500'>
            Selecione uma lista para ver seus itens
          </div>
        )}
      </div>
    </div>
  );
}
