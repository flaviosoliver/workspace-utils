'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Plus,
  MessageCircle,
  Settings,
  Trash2,
  Bot,
  User,
  Copy,
  RotateCcw,
  X,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  name: string;
  provider: AIProvider;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}

interface AIProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  apiKey?: string;
  enabled: boolean;
}

const defaultProviders: AIProvider[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '🤖',
    color: 'bg-green-600',
    apiKey: '',
    enabled: false,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: '💎',
    color: 'bg-blue-600',
    apiKey: '',
    enabled: false,
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: '🧠',
    color: 'bg-purple-600',
    apiKey: '',
    enabled: false,
  },
  {
    id: 'qwen',
    name: 'Qwen',
    icon: '🌟',
    color: 'bg-orange-600',
    apiKey: '',
    enabled: false,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🔍',
    color: 'bg-red-600',
    apiKey: '',
    enabled: false,
  },
  {
    id: 'manus',
    name: 'Manus',
    icon: '🚀',
    color: 'bg-indigo-600',
    apiKey: '',
    enabled: true,
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    icon: '🔮',
    color: 'bg-teal-600',
    apiKey: '',
    enabled: false,
  },
];

export default function AIChatWidget() {
  const [providers, setProviders] = useState<AIProvider[]>(defaultProviders);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProviderSelector, setShowProviderSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chatSessions.find((chat) => chat.id === activeChatId);

  useEffect(() => {
    // Carregar dados do localStorage
    const savedProviders = localStorage.getItem('ai-providers');
    const savedChats = localStorage.getItem('ai-chat-sessions');

    if (savedProviders) {
      try {
        setProviders(JSON.parse(savedProviders));
      } catch (error) {
        console.error('Erro ao carregar provedores:', error);
      }
    }

    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        setChatSessions(
          parsedChats.map((chat: any) => ({
            ...chat,
            createdAt: new Date(chat.createdAt),
            lastActivity: new Date(chat.lastActivity),
            messages: chat.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }))
        );
      } catch (error) {
        console.error('Erro ao carregar chats:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Salvar dados no localStorage
    localStorage.setItem('ai-providers', JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    // Salvar chats no localStorage
    localStorage.setItem('ai-chat-sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    // Scroll para o final das mensagens
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const createNewChat = (provider: AIProvider) => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      name: `Chat com ${provider.name}`,
      provider: provider,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    setChatSessions([newChat, ...chatSessions]);
    setActiveChatId(newChat.id);
    setShowProviderSelector(false);
  };

  const deleteChat = (chatId: string) => {
    setChatSessions(chatSessions.filter((chat) => chat.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(chatSessions.length > 1 ? chatSessions[0].id : null);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !activeChat || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    // Adicionar mensagem do usuário
    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, userMessage],
      lastActivity: new Date(),
    };

    setChatSessions(
      chatSessions.map((chat) =>
        chat.id === activeChatId ? updatedChat : chat
      )
    );

    setMessage('');
    setIsLoading(true);

    // Simular resposta da IA (em um app real, isso faria chamadas para APIs)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(activeChat.provider, userMessage.content),
        timestamp: new Date(),
      };

      setChatSessions((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );

      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateMockResponse = (
    provider: AIProvider,
    userMessage: string
  ): string => {
    const responses = {
      chatgpt: `Como ChatGPT, posso ajudar com "${userMessage}". Esta é uma resposta simulada do ChatGPT.`,
      gemini: `Olá! Sou o Gemini da Google. Sobre "${userMessage}", posso fornecer informações detalhadas.`,
      claude: `Como Claude da Anthropic, analisando "${userMessage}", posso oferecer uma perspectiva útil.`,
      qwen: `Qwen aqui! Sobre "${userMessage}", posso compartilhar conhecimentos relevantes.`,
      deepseek: `DeepSeek analisando: "${userMessage}". Aqui está minha resposta baseada em análise profunda.`,
      manus: `Sou o Manus! Sobre "${userMessage}", posso ajudar de forma abrangente e prática.`,
      perplexity: `Perplexity pesquisando sobre "${userMessage}". Aqui estão as informações mais relevantes.`,
    };

    return (
      responses[provider.id as keyof typeof responses] ||
      'Resposta simulada da IA.'
    );
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const clearChat = () => {
    if (!activeChat) return;

    const clearedChat = {
      ...activeChat,
      messages: [],
      lastActivity: new Date(),
    };

    setChatSessions(
      chatSessions.map((chat) =>
        chat.id === activeChatId ? clearedChat : chat
      )
    );
  };

  const updateProviderApiKey = (providerId: string, apiKey: string) => {
    setProviders(
      providers.map((provider) =>
        provider.id === providerId
          ? { ...provider, apiKey, enabled: apiKey.length > 0 }
          : provider
      )
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const enabledProviders = providers.filter((p) => p.enabled);

  return (
    <div className='h-full flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b border-gray-700 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <MessageCircle className='w-5 h-5 text-blue-400' />
          <h2 className='text-lg font-semibold text-white'>Chat IA</h2>
        </div>

        <div className='flex items-center gap-2'>
          <button
            aria-label='Novo chat'
            type='button'
            onClick={() => setShowProviderSelector(true)}
            className='p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
          >
            <Plus className='w-4 h-4' />
          </button>
          <button
            aria-label='Configurações'
            type='button'
            onClick={() => setShowSettings(true)}
            className='p-2 text-gray-400 hover:text-white transition-colors'
          >
            <Settings className='w-4 h-4' />
          </button>
        </div>
      </div>

      <div className='flex-1 flex min-h-0'>
        {/* Sidebar com lista de chats */}
        <div className='w-1/3 border-r border-gray-700 flex flex-col'>
          <div className='p-3 border-b border-gray-700'>
            <h3 className='font-medium text-white'>Conversas</h3>
          </div>

          <div className='flex-1 overflow-y-auto'>
            {chatSessions.length === 0 ? (
              <div className='p-4 text-center text-gray-400'>
                <MessageCircle className='w-8 h-8 mx-auto mb-2 opacity-50' />
                <p className='text-sm'>Nenhuma conversa ainda</p>
              </div>
            ) : (
              chatSessions.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                    activeChatId === chat.id ? 'bg-gray-800' : ''
                  }`}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-1'>
                        <span className='text-lg'>{chat.provider.icon}</span>
                        <span className='text-sm font-medium text-white truncate'>
                          {chat.name}
                        </span>
                      </div>
                      <p className='text-xs text-gray-400'>
                        {chat.messages.length} mensagens
                      </p>
                      <p className='text-xs text-gray-500'>
                        {formatTime(chat.lastActivity)}
                      </p>
                    </div>
                    <button
                      aria-label='Deletar conversa'
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className='text-gray-400 hover:text-red-400 transition-colors'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Área principal do chat */}
        <div className='flex-1 flex flex-col'>
          {activeChat ? (
            <>
              {/* Header do chat ativo */}
              <div className='p-3 border-b border-gray-700 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>{activeChat.provider.icon}</span>
                  <span className='font-medium text-white'>
                    {activeChat.provider.name}
                  </span>
                </div>
                <button
                  aria-label='Limpar conversa'
                  type='button'
                  onClick={clearChat}
                  className='text-gray-400 hover:text-red-400 transition-colors'
                >
                  <RotateCcw className='w-4 h-4' />
                </button>
              </div>

              {/* Mensagens */}
              <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {activeChat.messages.length === 0 ? (
                  <div className='text-center py-8 text-gray-400'>
                    <Bot className='w-12 h-12 mx-auto mb-2 opacity-50' />
                    <p>Inicie uma conversa com {activeChat.provider.name}</p>
                  </div>
                ) : (
                  activeChat.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          msg.role === 'user' ? 'order-2' : 'order-1'
                        }`}
                      >
                        <div
                          className={`p-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-800 text-gray-100'
                          }`}
                        >
                          <p className='whitespace-pre-wrap'>{msg.content}</p>
                        </div>
                        <div className='flex items-center gap-2 mt-1'>
                          <span className='text-xs text-gray-500'>
                            {formatTime(msg.timestamp)}
                          </span>
                          <button
                            aria-label='Copiar mensagem'
                            type='button'
                            onClick={() => copyMessage(msg.content)}
                            className='text-gray-400 hover:text-white transition-colors'
                          >
                            <Copy className='w-3 h-3' />
                          </button>
                        </div>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.role === 'user'
                            ? 'bg-blue-600 order-1'
                            : `${activeChat.provider.color} order-2`
                        }`}
                      >
                        {msg.role === 'user' ? (
                          <User className='w-4 h-4 text-white' />
                        ) : (
                          <span className='text-sm'>
                            {activeChat.provider.icon}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className='flex gap-3 justify-start'>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${activeChat.provider.color}`}
                    >
                      <span className='text-sm'>
                        {activeChat.provider.icon}
                      </span>
                    </div>
                    <div className='bg-gray-800 p-3 rounded-lg'>
                      <div className='flex gap-1'>
                        <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                        <div
                          className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input de mensagem */}
              <div className='p-4 border-t border-gray-700'>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Conversar com ${activeChat.provider.name}...`}
                    className='flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isLoading}
                  />
                  <button
                    aria-label='Enviar mensagem'
                    type='button'
                    onClick={sendMessage}
                    disabled={!message.trim() || isLoading}
                    className='px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors'
                  >
                    <Send className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className='flex-1 flex items-center justify-center text-gray-400'>
              <div className='text-center'>
                <MessageCircle className='w-16 h-16 mx-auto mb-4 opacity-50' />
                <p className='text-lg mb-2'>Selecione uma conversa</p>
                <p className='text-sm'>Ou crie uma nova conversa com uma IA</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de seleção de provedor */}
      {showProviderSelector && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-gray-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-white'>Escolher IA</h3>
              <button
                aria-label='Fechar seletor de provedor'
                type='button'
                onClick={() => setShowProviderSelector(false)}
                className='text-gray-400 hover:text-white'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='space-y-2'>
              {enabledProviders.map((provider) => (
                <button
                  aria-label={`Iniciar chat com ${provider.name}`}
                  type='button'
                  key={provider.id}
                  onClick={() => createNewChat(provider)}
                  className='w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-3'
                >
                  <span className='text-xl'>{provider.icon}</span>
                  <span className='text-white font-medium'>
                    {provider.name}
                  </span>
                </button>
              ))}
            </div>

            {enabledProviders.length === 0 && (
              <p className='text-gray-400 text-center py-4'>
                Configure as chaves de API nas configurações
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal de configurações */}
      {showSettings && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-gray-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-white'>
                Configurações de IA
              </h3>
              <button
                aria-label='Fechar configurações'
                type='button'
                onClick={() => setShowSettings(false)}
                className='text-gray-400 hover:text-white'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='space-y-4'>
              {providers.map((provider) => (
                <div key={provider.id} className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg'>{provider.icon}</span>
                    <span className='text-white font-medium'>
                      {provider.name}
                    </span>
                  </div>
                  <input
                    type='password'
                    value={provider.apiKey || ''}
                    onChange={(e) =>
                      updateProviderApiKey(provider.id, e.target.value)
                    }
                    placeholder='Chave de API...'
                    className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
                  />
                </div>
              ))}
            </div>

            <div className='mt-6 p-3 bg-gray-700 rounded-lg'>
              <p className='text-sm text-gray-300'>
                💡 Configure suas chaves de API para habilitar os provedores de
                IA. O Manus está sempre disponível.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
