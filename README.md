# 🎮 Saint Seiya DLE - Modo Diário

Sistema de jogo diário implementado para o Saint Seiya DLE (Daily Lore Edition).

## 📋 Arquivos Criados/Modificados

### Novos Arquivos

1. **`src/utils/dailyGame.ts`** - Utilitários do modo diário
2. **`src/hooks/useDailyGame.ts`** - Hook personalizado para gerenciar o estado
3. **`src/app/layout.tsx`** - Layout com correções de hidratação

### Arquivos Modificados

1. **`src/stores/useGameStore.ts`** - Store Zustand atualizada
2. **`src/app/classico/page.tsx`** - Página principal com modo diário

## ✨ Funcionalidades Implementadas

### ✅ Personagem Determinístico
- Todos os usuários veem o mesmo personagem no mesmo dia
- Usa hash da data para seleção determinística
- Não requer backend ou sincronização

### ✅ Persistência de Estado
- Estado de vitória mantido ao atualizar a página (F5)
- Tentativas salvas localmente
- Data do jogo atual rastreada

### ✅ Rotação Completa
- Personagens não se repetem até todos aparecerem
- Ciclo reinicia automaticamente após usar todos
- Histórico de índices usados

### ✅ Contador Regressivo
- Mostra tempo até o próximo personagem
- Atualização em tempo real (1 segundo)
- Baseado em fuso horário de São Paulo

### ✅ Reset Automático
- Verifica mudança de dia a cada minuto
- Reinicia jogo automaticamente à meia-noite
- Limpa tentativas e seleciona novo personagem

### ✅ Correção de Hidratação SSR
- Evita erros de hidratação do Next.js
- Loading state durante inicialização
- suppressHydrationWarning no layout

## 🔧 Configuração

### 1. Ajustar Número de Personagens

No arquivo `src/stores/useGameStore.ts`, linha 52:

```typescript
const totalCharacters = 100; // Ajuste para o tamanho da sua lista
```

Altere `100` para o número real de personagens em `characters.ts`.

### 2. Fuso Horário

Atualmente configurado para `America/Sao_Paulo`. Para alterar, edite em `src/utils/dailyGame.ts`:

```typescript
const brazilTime = new Date(now.toLocaleString('en-US', { 
  timeZone: 'America/Sao_Paulo'  // Altere aqui
}));
```

### 3. Adicionar Hook de Dicas

As dicas são mostradas após 5 e 10 tentativas. Para ajustar:

```typescript
if (attempts.length >= 5 && !dica1 && selectedCharacter?.dica1) {
  setDica1(selectedCharacter.dica1);
}
if (attempts.length >= 10 && !dica2 && selectedCharacter?.dica2) {
  setDica2(selectedCharacter.dica2);
}
```

## 🚀 Como Funciona

### Fluxo de Inicialização

1. **Primeira Visita do Dia**
   ```
   getCurrentDateInBrazil() → "2025-11-04"
   getDailyCharacter("2025-11-04", characters, []) → Personagem #42
   Salva no localStorage via Zustand
   ```

2. **Recarregar Página (F5)**
   ```
   Lê localStorage
   Mesma data? → Mantém personagem e estado de vitória
   Data diferente? → Novo personagem
   ```

3. **Mudança de Dia**
   ```
   setInterval verifica a cada minuto
   Data mudou? → window.location.reload()
   Novo ciclo começa automaticamente
   ```

### Algoritmo de Seleção

```typescript
function getDailyCharacter(date, characters, usedIndices) {
  // 1. Filtra personagens disponíveis
  const available = characters.filter((_, i) => !usedIndices.includes(i));
  
  // 2. Gera hash da data
  const seed = simpleHash(date); // "2025-11-04" → 1234567
  
  // 3. Seleciona deterministicamente
  const index = available[seed % available.length];
  
  return { character: characters[index], index };
}
```

## 📊 Estrutura de Dados

### LocalStorage (via Zustand)

```json
{
  "selectedCharacter": {
    "nome": "Seiya de Pégaso",
    "idade": "13",
    // ... outros campos
  },
  "attempts": [
    {
      "nome": "Shiryu de Dragão",
      "idade": "green",
      // ... comparações
    }
  ],
  "won": true,
  "currentGameDate": "2025-11-04",
  "usedCharacterIndices": [0, 5, 12, 42]
}
```

## 🐛 Solução de Problemas

### Erro: "Hydration mismatch"
**Causa:** Diferenças entre SSR e cliente
**Solução:** Já implementado com `suppressHydrationWarning` e `isInitialized`

### Estado de vitória não persiste
**Causa:** Store resetando no mesmo dia
**Solução:** Verificar `resetDailyGame` na store - já corrigido

### Personagem muda ao recarregar
**Causa:** Data não sendo verificada corretamente
**Solução:** Hook `useDailyGame` garante consistência

### Contador não atualiza
**Causa:** `useEffect` não executando
**Solução:** Verificar `isInitialized` e dependências

## 🎯 Próximos Passos

### Funcionalidades Futuras

1. **Estatísticas**
   - Histórico de vitórias
   - Média de tentativas
   - Streak de dias consecutivos

2. **Compartilhamento**
   - Botão "Compartilhar resultado"
   - Formato tipo Wordle (🟩🟥⬆️⬇️)

3. **Modo Arquivo**
   - Jogar dias anteriores
   - Passar data como parâmetro
   - `?date=2025-11-03`

4. **Dicas Progressivas**
   - Revelar características gradualmente
   - Silhueta desfocada
   - Áudio da técnica

## 📝 Notas Técnicas

- **Zustand Persist:** Usa `localStorage` automaticamente
- **Next.js SSR:** Loading state previne hidratação prematura
- **Timezone:** Conversão bidirecional para São Paulo
- **Hash Function:** Simples mas eficaz para distribuição uniforme
- **React 18:** Compatível com concurrent features

## 🔐 Segurança

- Dados apenas no cliente (localStorage)
- Sem chamadas de API
- Sem informações sensíveis
- Estado pode ser limpo manualmente pelo usuário

## 📄 Licença

Parte do projeto Saint Seiya DLE.

---

**Última atualização:** 04/11/2025
**Versão:** 1.0.0