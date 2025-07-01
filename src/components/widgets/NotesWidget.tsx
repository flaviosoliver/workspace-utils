'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Save, X, FileText } from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesWidget() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar notas da API
  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes);
        if (data.notes.length > 0) {
          setSelectedNote(data.notes[0]);
        } else {
          setSelectedNote(null);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    const newNote = {
      title: editTitle.trim() || 'Nova Nota',
      content: editContent,
    };
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });
      if (res.ok) {
        await fetchNotes();
        setShowNewNoteForm(false);
        setEditTitle('');
        setEditContent('');
      }
    } catch (error) {
      console.error('Erro ao criar nota:', error);
    }
  };

  const updateNote = async () => {
    if (!selectedNote) return;
    try {
      const res = await fetch(`/api/notes/${selectedNote._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim() || 'Sem título',
          content: editContent,
        }),
      });
      if (res.ok) {
        await fetchNotes();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchNotes();
      }
    } catch (error) {
      console.error('Erro ao deletar nota:', error);
    }
  };

  const startEditing = () => {
    if (!selectedNote) return;
    setEditTitle(selectedNote.title);
    setEditContent(selectedNote.content);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
  };

  const startNewNote = () => {
    setEditTitle('');
    setEditContent('');
    setShowNewNoteForm(true);
    setIsEditing(false);
  };

  const cancelNewNote = () => {
    setShowNewNoteForm(false);
    setEditTitle('');
    setEditContent('');
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='h-full flex'>
      <div className='w-1/3 border-r border-gray-700 flex flex-col'>
        <div className='p-4 border-b border-gray-700'>
          <div className='flex items-center justify-between mb-3'>
            <h2 className='text-lg font-semibold text-white'>Notas</h2>
            <button
              aria-label='Criar nova nota'
              onClick={startNewNote}
              className='p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
            >
              <Plus className='w-4 h-4' />
            </button>
          </div>

          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Buscar notas...'
              className='w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
            />
          </div>
        </div>

        <div className='flex-1 overflow-y-auto'>
          {loading ? (
            <div className='p-4 text-center text-gray-400'>Carregando...</div>
          ) : filteredNotes.length === 0 ? (
            <div className='p-4 text-center text-gray-400'>
              <FileText className='w-8 h-8 mx-auto mb-2 opacity-50' />
              <p className='text-sm'>
                {searchTerm ? 'Nenhuma nota encontrada' : 'Nenhuma nota ainda'}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note._id}
                onClick={() => setSelectedNote(note)}
                className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                  selectedNote?._id === note._id ? 'bg-gray-800' : ''
                }`}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-medium text-white truncate'>
                      {note.title}
                    </h3>
                    <p className='text-sm text-gray-400 mt-1 line-clamp-2'>
                      {note.content || 'Sem conteúdo'}
                    </p>
                    <p className='text-xs text-gray-500 mt-2'>
                      {formatDate(note.updatedAt)}
                    </p>
                  </div>
                  <button
                    aria-label='Deletar nota'
                    onClick={async (e) => {
                      e.stopPropagation();
                      await deleteNote(note._id);
                      // Seleciona outra nota após deletar
                      if (selectedNote?._id === note._id) {
                        setSelectedNote(
                          notes.length > 1
                            ? notes.find((n) => n._id !== note._id) || null
                            : null
                        );
                      }
                    }}
                    className='ml-2 text-gray-400 hover:text-red-400 transition-colors'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className='flex-1 flex flex-col'>
        {showNewNoteForm ? (
          <div className='h-full flex flex-col'>
            <div className='p-4 border-b border-gray-700 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-white'>Nova Nota</h3>
              <div className='flex gap-2'>
                <button
                  aria-label='Salvar nota'
                  type='button'
                  onClick={createNote}
                  className='flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors'
                >
                  <Save className='w-4 h-4' />
                  Salvar
                </button>
                <button
                  aria-label='Cancelar nova nota'
                  type='button'
                  onClick={cancelNewNote}
                  className='flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors'
                >
                  <X className='w-4 h-4' />
                  Cancelar
                </button>
              </div>
            </div>

            <div className='p-4 flex-1 flex flex-col'>
              <input
                type='text'
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder='Título da nota...'
                className='w-full px-3 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder='Escreva sua nota aqui...'
                className='flex-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none'
              />
            </div>
          </div>
        ) : selectedNote ? (
          <div className='h-full flex flex-col'>
            <div className='p-4 border-b border-gray-700 flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold text-white'>
                  {isEditing ? 'Editando' : selectedNote.title}
                </h3>
                <p className='text-sm text-gray-400'>
                  Atualizada em {formatDate(selectedNote.updatedAt)}
                </p>
              </div>

              <div className='flex gap-2'>
                {isEditing ? (
                  <>
                    <button
                      aria-label='Salvar edição da nota'
                      type='button'
                      onClick={updateNote}
                      className='flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors'
                    >
                      <Save className='w-4 h-4' />
                      Salvar
                    </button>
                    <button
                      aria-label='Cancelar edição da nota'
                      type='button'
                      onClick={cancelEditing}
                      className='flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors'
                    >
                      <X className='w-4 h-4' />
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    aria-label='Editar nota'
                    type='button'
                    onClick={startEditing}
                    className='flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
                  >
                    <Edit className='w-4 h-4' />
                    Editar
                  </button>
                )}
              </div>
            </div>

            <div className='p-4 flex-1 flex flex-col'>
              {isEditing ? (
                <>
                  <input
                    placeholder='Título da nota...'
                    type='text'
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className='w-full px-3 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500'
                  />
                  <textarea
                    placeholder='Escreva sua nota aqui...'
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className='flex-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none'
                  />
                </>
              ) : (
                <div className='flex-1 overflow-y-auto'>
                  <div className='prose prose-invert max-w-none'>
                    <pre className='whitespace-pre-wrap text-gray-300 font-sans'>
                      {selectedNote.content || 'Esta nota está vazia.'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='flex-1 flex items-center justify-center text-gray-400'>
            <div className='text-center'>
              <FileText className='w-16 h-16 mx-auto mb-4 opacity-50' />
              <p className='text-lg mb-2'>Selecione uma nota</p>
              <p className='text-sm'>
                Escolha uma nota da lista ou crie uma nova
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
