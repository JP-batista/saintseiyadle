# 🌟 Saint Seiya DLE (Daily Lore Experience)

Um jogo diário de adivinhação de personagens de Saint Seiya (Os Cavaleiros do Zodíaco), inspirado em jogos como Wordle e LoLdle.

## 📖 Sobre o Projeto

Saint Seiya DLE é um jogo web diário onde os jogadores precisam adivinhar qual é o personagem misterioso do dia usando pistas baseadas em características como:

- **Gênero**
- **Idade**
- **Altura**
- **Peso**
- **Signo**
- **Patente** (Cavaleiro de Bronze, Prata, Ouro, etc.)
- **Exército** (Athena, Poseidon, Hades, etc.)
- **Local de Treinamento**
- **Saga** (Santuário, Poseidon, Hades, Asgard, etc.)

## ✨ Funcionalidades

### 🎮 Modo de Jogo Clássico

- **Sistema de Tentativas Ilimitadas**: Tente quantas vezes precisar até acertar
- **Feedback Visual Inteligente**: 
  - ✅ Verde = Correto
  - ❌ Vermelho = Incorreto
  - ⬆️ Seta para cima = Valor é maior
  - ⬇️ Seta para baixo = Valor é menor
- **Sistema de Dicas Progressivo**:
  - Dica 1: Desbloqueada após 5 tentativas
  - Dica 2: Desbloqueada após 10 tentativas
- **Autocomplete Inteligente**: Busca por nome ou título do personagem
- **Grid de Histórico**: Visualize todas as suas tentativas

### 📊 Sistema de Estatísticas Completo

- **Total de Vitórias**: Acompanhe seu progresso
- **Média de Tentativas**: Veja seu desempenho médio
- **Acertos na 1ª Tentativa**: Mostre sua maestria
- **Sequência Atual**: Dias consecutivos jogando
- **Melhor Sequência**: Seu recorde pessoal
- **Gráfico de Evolução**: Visualize suas tentativas ao longo do tempo
- **Histórico Detalhado**: Reveja todos os seus jogos passados

### 🕐 Sistema de Jogo Diário

- **Reset Configurável**: Horário personalizável para novo personagem
- **Contador de Tempo**: Veja quando o próximo personagem estará disponível
- **Personagens Únicos**: Sistema que evita repetição até completar o ciclo
- **Persistência**: Seu progresso é salvo automaticamente
- **Fuso Horário**: Respeita o horário de Brasília (America/Sao_Paulo)

### 📱 Design Responsivo

- **Mobile First**: Interface otimizada para smartphones
- **Tablet Friendly**: Layout adaptável para tablets
- **Desktop Experience**: Experiência completa em telas grandes
- **Scroll Horizontal**: Grid de tentativas adaptável em mobile
- **Touch Optimized**: Botões e interações pensados para touch

### 🎨 Interface Moderna

- **Tema Dark**: Experiência visual confortável
- **Paleta Saint Seiya**: Cores icônicas da série (amarelo/dourado e roxo)
- **Animações Suaves**: Transições e hover effects
- **Feedback Visual Imediato**: Resposta instantânea às ações

## 🗂️ Base de Dados

O jogo conta com **200+ personagens** de diversas sagas:

### Cavaleiros de Bronze/Prata/Ouro
- **Clássico**: Seiya, Shiryu, Hyoga, Shun, Ikki + Cavaleiros de Ouro
- **Lost Canvas**: Tenma, Dohko jovem, Manigold, Regulus, etc.
- **Next Dimension**: Shion jovem, Ox de Touro, Shijima, etc.
- **Omega**: Kouga, Souma, Yuna, Ryuho, etc.

### Outros Exércitos
- **Marinas de Poseidon**: 7 Generais Marinas
- **Espectros de Hades**: 3 Juízes + Espectros
- **Guerreiros Deuses de Asgard**: 7 Guerreiros + Hilda
- **Deuses**: Athena, Poseidon, Hades, Apolo, Artemis, etc.

### Personagens Especiais
- **Saintias**: Shoko, Kyoko, Mii, etc.
- **Cavaleiros Negros**: Kenuma, Shinadekuro, Jid, etc.
- **Marcianos e Pallasitos**: Marte, Pallas, Saturno, etc.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14+**: Framework React com App Router
- **TypeScript**: Tipagem estática para maior segurança
- **Tailwind CSS**: Estilização utility-first
- **Recharts**: Gráficos e visualizações

### Gerenciamento de Estado
- **Zustand**: State management leve e eficiente
- **Zustand Persist**: Persistência automática no localStorage

### Bibliotecas Adicionais
- **Lucide React**: Ícones modernos
- **Date-fns**: Manipulação de datas (se necessário)