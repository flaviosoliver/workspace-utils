# Workspace Utils - Ambiente de Trabalho

Um ambiente de trabalho completo desenvolvido em Next.js 15 com múltiplos widgets produtivos, sistema de autenticação, personalização de temas e interface com janelas redimensionáveis estilo Ubuntu.

## 🚀 Funcionalidades

### 🔐 Sistema de Autenticação

- Registro e login de usuários
- Autenticação JWT
- Gerenciamento de sessões
- Proteção de rotas

### 🎨 Personalização de Temas

- **One Dark**: Tema escuro moderno
- **Dracula**: Tema escuro com cores vibrantes
- **Monokai**: Tema escuro clássico
- **Light**: Tema claro
- Salvamento automático das preferências

### 🪟 Sistema de Janelas

- Janelas redimensionáveis e arrastáveis
- Barra lateral estilo Ubuntu
- Múltiplas janelas simultâneas
- Controles de janela (minimizar, maximizar, fechar)

### 📋 Widgets Disponíveis

#### 1. **Lista de Tarefas Diárias**

- Criação, edição e exclusão de tarefas
- Marcação de conclusão
- Categorização por prioridade
- Persistência no banco de dados

#### 2. **Timer**

- Timer personalizável
- Interface circular visual
- Controles de play/pause/reset
- Configuração de minutos e segundos

#### 3. **Pomodoro**

- Técnica Pomodoro completa
- Ciclos de trabalho e descanso
- Notificações visuais
- Contador de sessões

#### 4. **To-Do**

- Lista de tarefas simples
- Adição rápida de itens
- Marcação de conclusão
- Contador de progresso

#### 5. **Anotações**

- Editor de notas completo
- Busca por conteúdo
- Organização por data
- Interface dividida (lista + editor)

#### 6. **Player de Música**

- Integração com YouTube, Spotify
- Playlists personalizadas
- Controles de reprodução
- Busca de músicas
- Favoritos

#### 7. **Gerador de Dados Fake**

- Geração de pessoas fictícias
- Dados de empresas
- Cartões de crédito
- Endereços
- Exportação em JSON

#### 8. **Chat com IAs**

- Múltiplos provedores: ChatGPT, Gemini, Claude, Qwen, DeepSeek, Manus, Perplexity
- Conversas simultâneas
- Histórico de mensagens
- Configuração de chaves de API
- Interface de chat moderna

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **React Draggable** - Janelas arrastáveis
- **React Resizable** - Redimensionamento

### Backend

- **MongoDB** - Banco de dados
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Next.js API Routes** - API REST

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- MongoDB
- npm ou yarn

### Passos

1. **Clone o repositório**

```bash
git clone <repository-url>
cd workspace-utils
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/workspace-utils

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# NextAuth (opcional)
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

4. **Inicie o MongoDB**

```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS (com Homebrew)
brew services start mongodb-community

# Windows
net start MongoDB
```

5. **Execute o projeto**

```bash
npm run dev
```

6. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🎯 Como Usar

### Primeiro Acesso

1. Acesse a aplicação
2. Clique em "Registre-se" para criar uma conta
3. Preencha os dados e faça login
4. Explore os widgets clicando nos ícones da barra lateral

### Personalizando o Ambiente

1. Clique no ícone de configurações (⚙️)
2. Escolha seu tema preferido
3. Configure as chaves de API para os chats de IA
4. Salve as configurações

### Usando os Widgets

- **Clique** nos ícones da barra lateral para abrir widgets
- **Arraste** as janelas para reposicioná-las
- **Redimensione** as janelas pelas bordas
- **Feche** janelas usando o botão X

## 🔧 Configuração de APIs

### Chat com IAs

Para usar os chats de IA, configure as chaves de API:

1. Abra o widget "Chat IA"
2. Clique no ícone de configurações
3. Insira suas chaves de API:
   - **ChatGPT**: OpenAI API Key
   - **Gemini**: Google AI API Key
   - **Claude**: Anthropic API Key
   - **Qwen**: Alibaba Cloud API Key
   - **DeepSeek**: DeepSeek API Key
   - **Perplexity**: Perplexity API Key

> **Nota**: O Manus está sempre disponível sem necessidade de configuração.

## 📁 Estrutura do Projeto

```
workspace-utils/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── api/               # API Routes
│   │   ├── auth/              # Páginas de autenticação
│   │   └── globals.css        # Estilos globais
│   ├── components/            # Componentes React
│   │   ├── layout/           # Componentes de layout
│   │   ├── ui/               # Componentes de UI
│   │   └── widgets/          # Widgets do workspace
│   ├── contexts/             # Contextos React
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilitários e configurações
│   │   └── models/           # Modelos do MongoDB
│   ├── styles/               # Estilos e temas
│   └── types/                # Tipos TypeScript
├── public/                   # Arquivos estáticos
└── package.json             # Dependências e scripts
```

## 🎨 Temas Disponíveis

### One Dark

- Fundo: `#1e1e1e`
- Texto: `#abb2bf`
- Accent: `#61afef`

### Dracula

- Fundo: `#282a36`
- Texto: `#f8f8f2`
- Accent: `#bd93f9`

### Monokai

- Fundo: `#272822`
- Texto: `#f8f8f2`
- Accent: `#a6e22e`

### Light

- Fundo: `#ffffff`
- Texto: `#333333`
- Accent: `#007acc`

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Docker

```bash
# Build da imagem
docker build -t workspace-utils .

# Execute o container
docker run -p 3000:3000 workspace-utils
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a [documentação](#-como-usar)
2. Procure por [issues existentes](../../issues)
3. Crie uma [nova issue](../../issues/new) se necessário

## 🎉 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide](https://lucide.dev/) - Ícones
- [MongoDB](https://www.mongodb.com/) - Banco de dados
- [Vercel](https://vercel.com/) - Plataforma de deploy

---

Desenvolvido com ❤️ para produtividade máxima!
