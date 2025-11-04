# Guia de Implementação - Sistema de Estatísticas

## Estrutura de Arquivos

```
src/
├── stores/
│   ├── useGameStore.ts (atualizado)
│   └── useStatsStore.ts (novo)
├── components/
│   └── StatsModal.tsx (novo)
└── app/
    └── classico/
        └── page.tsx (atualizado)
```

## Dependências Necessárias

Certifique-se de instalar a biblioteca de gráficos:

```bash
npm install recharts
# ou
yarn add recharts
```

## Passos de Implementação

### 1. Criar o Store de Estatísticas

Crie o arquivo `src/stores/useStatsStore.ts` com o conteúdo fornecido no artifact `stats_store`.

**Funcionalidades:**
- Armazena histórico completo de jogos (data, tentativas, vitória, primeira tentativa, nome e imagem do personagem)
- Calcula automaticamente todas as estatísticas
- Persiste dados no localStorage
- Recalcula estatísticas ao carregar da storage

### 2. Atualizar o Store do Jogo

Substitua o conteúdo de `src/stores/useGameStore.ts` pelo artifact `updated_game_store`.

**Mudanças:**
- Adicionado campo `gaveUp` para diferenciar desistência de vitória
- Import do `useStatsStore` preparado para integração

### 3. Criar o Modal de Estatísticas

Crie o arquivo `src/components/StatsModal.tsx` com o conteúdo do artifact `stats_modal`.

**Características:**
- Modal responsivo com overlay
- Exibe 5 estatísticas principais em cards (removido "Jogos Totais")
- **Gráfico de linha** com evolução de tentativas ao longo do tempo
  - Eixo X: Datas dos jogos
  - Eixo Y: Quantidade de tentativas
  - Mostra últimos 30 jogos
- **Histórico detalhado dos últimos jogos** com:
  - Imagem do personagem
  - Nome do personagem
  - Data completa formatada
  - Quantidade de tentativas
  - Badge especial para primeira tentativa
- Botão "Ver Mais" quando houver mais de 5 jogos
- Destaque para acertos na primeira tentativa

### 4. Atualizar a Página do Jogo

Substitua `src/app/classico/page.tsx` pelo artifact `updated_game_page`.

**Integrações:**
- Import do `useStatsStore` e `StatsModal`
- Import do `recharts` para gráficos
- Botão "Ver Estatísticas" no estado de vitória
- Registro automático do resultado ao terminar o jogo (inclui nome e imagem do personagem)
- Verificação para não duplicar registros do mesmo dia

## Como Funciona

### Fluxo de Dados

1. **Início do Jogo:** Sistema carrega estado do localStorage
2. **Durante o Jogo:** Tentativas são armazenadas no `useGameStore`
3. **Fim do Jogo:** 
   - `won` é setado como `true`
   - Se desistiu, `gaveUp` também é `true`
   - `useEffect` detecta mudança e chama `addGameResult()` com dados do personagem
4. **Registro:** 
   - Verifica se já existe registro para o dia
   - Adiciona/atualiza no histórico com nome e imagem do personagem
   - Recalcula todas as estatísticas
5. **Visualização:** Modal exibe estatísticas calculadas e gráfico de linha

### Cálculo de Estatísticas

**Total de Vitórias:** Conta jogos onde `won === true` e `gaveUp === false`

**Média de Tentativas:** 
```typescript
soma_tentativas_vitoriosas / total_vitorias
// Arredondado para 1 casa decimal
```

**Primeira Tentativa:** Conta jogos onde `attempts === 1` e `won === true`

**Current Streak:**
- Conta vitórias consecutivas
- Considera dias consecutivos
- Reseta se faltar um dia ou perder

**Max Streak:** Maior sequência de vitórias já registrada

### Persistência

Dois itens no localStorage:
- `classic-game-daily-storage`: Estado do jogo (personagem, tentativas, vitória)
- `classic-game-stats-storage`: Histórico completo e estatísticas

## Validações Implementadas

✅ Não registra o mesmo jogo duas vezes  
✅ Diferencia vitória de desistência  
✅ Mantém estado após F5  
✅ Respeita virada diária  
✅ Recalcula estatísticas ao carregar  
✅ Trata jogos incompletos corretamente  

## Testando o Sistema

1. **Primeiro Jogo:** Complete um jogo e clique em "Ver Estatísticas"
2. **Desistência:** Clique em "Desistir" e veja que não conta como vitória
3. **Atualizar Página:** Pressione F5 e veja que estatísticas persistem
4. **Múltiplos Dias:** Use DevTools para alterar a data e simular dias diferentes
5. **Streaks:** Faça jogos consecutivos para ver o streak aumentar

## Customizações Futuras

- Adicionar gráfico de linha com evolução temporal
- Implementar compartilhamento de resultados
- Adicionar conquistas/badges
- Exportar estatísticas como imagem
- Comparação com média global (requer backend)

## Troubleshooting

**Estatísticas não aparecem:**
- Verifique console do navegador
- Confirme que `useStatsStore` foi importado corretamente
- Limpe localStorage e teste novamente

**Jogos duplicados:**
- Certifique-se que `getGameByDate()` está sendo chamado antes de `addGameResult()`

**Streaks incorretos:**
- Verifique timezone no `getCurrentDateInBrazil()`
- Confirme formato de data (YYYY-MM-DD)