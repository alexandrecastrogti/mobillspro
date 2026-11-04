---
name: ui-matrix-components
description: >-
  Instruções de UX/UI para construir interfaces aceleradas de digitação no
  React/Next.js e Tailwind CSS. Focado em produtividade heads-down, navegação 100%
  por teclado, inputs monetários com auto-formatação instantânea, grids matriciais
  estilo planilha e atalhos contínuos para alta densidade operacional.
---

# UI Matrix Components — Interfaces Aceleradas de Digitação

Este guia e especificação técnica ensina como projetar, arquitetar e codificar **interfaces de digitação em altíssima velocidade (*heads-down high-velocity typing*)** em aplicações modernas com **React 19 / Next.js** e **Tailwind CSS**.

O objetivo central é permitir que o usuário opere, cadastre, edite e valide fluxos complexos (finanças, faturas, lançamentos, itens de supermercado, tabelas contábeis) **sem encostar no mouse**, com transições instantâneas entre campos e feedback imediato a 60 FPS.

---

## 1. Princípios Fundamentais de UX Heads-Down

1. **Zero-Mouse Mandate (Mandato Sem Mouse)**:
   - Qualquer tela operacional deve ser preenchível do início ao fim usando apenas `Tab`, `Shift+Tab`, `Enter`, setas (`↑`, `↓`, `←`, `→`), `Esc` e atalhos mnemônicos.
   - O foco inicial deve ser entregue automaticamente ao primeiro campo útil (`autoFocus` ou foco programático via `useLayoutEffect`).

2. **Auto-Select on Focus**:
   - Ao receber foco por tabulação ou seta, o conteúdo do input deve ser automaticamente selecionado (`input.select()`).
   - Se o usuário começar a digitar, substitui o valor anterior sem precisar pressionar `Backspace` ou dar duplo clique.

3. **Auto-Advance Determinístico**:
   - Campos de máscara fechada (como Data `DD/MM/AAAA`, Código de Categoria, Parcelas `01/12`) avançam automaticamente para o próximo campo assim que a máscara atinge o comprimento válido, sem exigir `Tab`.

4. **Keyboard Feedback Visual (<kbd> Badges)**:
   - A interface deve comunicar explicitamente os atalhos disponíveis usando badges discretos de teclado:
     - `Enter ↵` para confirmar e ir ao próximo item
     - `Ctrl+Enter` / `⌘+Enter` para salvar em lote e fechar
     - `Esc` para cancelar ou fechar modal
     - `+` / `-` para alterar sinais monetários ou datas

5. **Expressões Matemáticas no Input Monetário**:
   - Inputs de valor devem aceitar operadores inline: digitar `120+45` e pressionar `Tab` ou `Enter` avalia automaticamente para `165,00`.

6. **Tipografia Monospaçada & Tabular Nums**:
   - Todo campo financeiro, numérico ou código de barras deve usar `font-mono tabular-nums`, impedindo saltos visuais (*layout shift*) enquanto o operador digita rapidamente.

---

## 2. Catálogo de Componentes Matrix (React + Tailwind)

### A. `FastCurrencyInput` — Preenchimento Monetário Centavo a Centavo

Elimina a necessidade de digitar vírgula ou ponto. Conforme o usuário digita números, os dígitos deslizam da direita para a esquerda:
- Digita `1` $\rightarrow$ `R$ 0,01`
- Digita `5` $\rightarrow$ `R$ 0,15`
- Digita `0` $\rightarrow$ `R$ 1,50`
- Digita `0` $\rightarrow$ `R$ 15,00`
- Digita `0` $\rightarrow$ `R$ 150,00`

```tsx
import React, { useState, useRef, useEffect } from 'react';

interface FastCurrencyInputProps {
  value: number; // Valor em reais (ex: 150.00)
  onChange: (value: number) => void;
  onEnterNext?: () => void;
  label?: string;
  autoFocus?: boolean;
  className?: string;
}

export function FastCurrencyInput({
  value,
  onChange,
  onEnterNext,
  label,
  autoFocus,
  className = ''
}: FastCurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rawCents, setRawCents] = useState<string>(Math.round(value * 100).toString());

  useEffect(() => {
    setRawCents(Math.round((value || 0) * 100).toString());
  }, [value]);

  const displayValue = (Number(rawCents || 0) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const updated = rawCents.slice(0, -1) || '0';
      setRawCents(updated);
      onChange(Number(updated) / 100);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (onEnterNext) onEnterNext();
      return;
    }

    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      const updated = (rawCents === '0' ? '' : rawCents) + e.key;
      setRawCents(updated);
      onChange(Number(updated) / 100);
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-[11px] font-mono font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center justify-between">
          <span>{label}</span>
          <kbd className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 font-mono">
            Centavos
          </kbd>
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoFocus={autoFocus}
          value={displayValue}
          onFocus={() => inputRef.current?.select()}
          onKeyDown={handleKeyDown}
          readOnly
          className="w-full px-3 py-2 text-sm font-mono font-bold tabular-nums text-slate-900 dark:text-zinc-100 bg-white dark:bg-[#141720] border border-slate-200 dark:border-[#222735] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-text"
        />
      </div>
    </div>
  );
}
```

---

### B. `FastDateInput` — Entrada Rápida de Datas com Atalhos Mnemônicos

Permite digitação contínua sem barras (`031126` $\rightarrow$ `03/11/2026`) e aceita atalhos diretos:
- Tecla `h` $\rightarrow$ Hoje
- Tecla `o` $\rightarrow$ Ontem
- Teclas `+` ou `-` $\rightarrow$ Adiciona ou subtrai 1 dia
- `Enter` $\rightarrow$ Dispara avanço para o próximo campo

```tsx
import React, { useRef } from 'react';

interface FastDateInputProps {
  value: string; // Formato YYYY-MM-DD
  onChange: (value: string) => void;
  onEnterNext?: () => void;
  label?: string;
}

export function FastDateInput({ value, onChange, onEnterNext, label }: FastDateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const today = new Date();
    
    if (e.key.toLowerCase() === 'h') {
      e.preventDefault();
      onChange(today.toISOString().split('T')[0]);
      return;
    }

    if (e.key.toLowerCase() === 'o') {
      e.preventDefault();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      onChange(yesterday.toISOString().split('T')[0]);
      return;
    }

    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      const current = value ? new Date(value + 'T12:00:00') : new Date();
      current.setDate(current.getDate() + 1);
      onChange(current.toISOString().split('T')[0]);
      return;
    }

    if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      const current = value ? new Date(value + 'T12:00:00') : new Date();
      current.setDate(current.getDate() - 1);
      onChange(current.toISOString().split('T')[0]);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (onEnterNext) onEnterNext();
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[11px] font-mono font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono">
            [H]oje · [O]ntem · [+/-]
          </span>
        </label>
      )}
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 text-xs font-mono font-medium text-slate-900 dark:text-zinc-100 bg-white dark:bg-[#141720] border border-slate-200 dark:border-[#222735] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer"
      />
    </div>
  );
}
```

---

### C. `MatrixDataGrid` — Inserção Contínua Tipo Planilha (Excel-Style Row Entry)

Ideal para lançar itens de cupom fiscal, parcelas ou conciliações em série.
- Pressionar `Enter` na última coluna salva a linha atual e cria imediatamente a próxima linha em branco, mantendo o foco na coluna 1.
- Setas `↑` e `↓` navegam verticalmente entre as linhas.
- `Backspace` em linha vazia remove a linha e volta o foco para a anterior.

```tsx
import React, { useRef, useState } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

export interface MatrixRow {
  id: string;
  description: string;
  category: string;
  amount: number;
  isShared: boolean;
}

interface MatrixDataGridProps {
  initialRows?: MatrixRow[];
  onCommit: (rows: MatrixRow[]) => void;
}

export function MatrixDataGrid({ initialRows = [], onCommit }: MatrixDataGridProps) {
  const [rows, setRows] = useState<MatrixRow[]>(
    initialRows.length > 0
      ? initialRows
      : [{ id: '1', description: '', category: 'Mercado', amount: 0, isShared: true }]
  );

  const cellRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const setCellRef = (rowIdx: number, colKey: string, el: HTMLElement | null) => {
    cellRefs.current[`${rowIdx}_${colKey}`] = el;
  };

  const focusCell = (rowIdx: number, colKey: string) => {
    const el = cellRefs.current[`${rowIdx}_${colKey}`];
    if (el) {
      el.focus();
      if (el instanceof HTMLInputElement) el.select();
    }
  };

  const updateRow = (rowIdx: number, patch: Partial<MatrixRow>) => {
    setRows((prev) => {
      const next = [...prev];
      next[rowIdx] = { ...next[rowIdx], ...patch };
      return next;
    });
  };

  const handleCellKeyDown = (
    e: React.KeyboardEvent,
    rowIdx: number,
    colKey: 'desc' | 'cat' | 'amount' | 'shared'
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (colKey === 'desc') {
        focusCell(rowIdx, 'cat');
      } else if (colKey === 'cat') {
        focusCell(rowIdx, 'amount');
      } else if (colKey === 'amount') {
        focusCell(rowIdx, 'shared');
      } else if (colKey === 'shared') {
        // Se estiver na última linha, cria uma nova
        if (rowIdx === rows.length - 1) {
          const newId = (rows.length + 1).toString();
          setRows((prev) => [
            ...prev,
            { id: newId, description: '', category: 'Mercado', amount: 0, isShared: true }
          ]);
          setTimeout(() => focusCell(rowIdx + 1, 'desc'), 20);
        } else {
          focusCell(rowIdx + 1, 'desc');
        }
      }
    }

    if (e.key === 'ArrowDown' && rowIdx < rows.length - 1) {
      e.preventDefault();
      focusCell(rowIdx + 1, colKey);
    }
    if (e.key === 'ArrowUp' && rowIdx > 0) {
      e.preventDefault();
      focusCell(rowIdx - 1, colKey);
    }
  };

  const total = rows.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#222735] bg-white dark:bg-[#11141B] shadow-sm overflow-hidden font-mono">
      {/* Table Header */}
      <div className="grid grid-cols-12 bg-slate-50 dark:bg-[#151922] px-3 py-2 text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider border-b border-slate-200 dark:border-[#1F2432]">
        <div className="col-span-5">Descrição / Fornecedor</div>
        <div className="col-span-3">Categoria</div>
        <div className="col-span-2 text-right">Valor (R$)</div>
        <div className="col-span-1 text-center">50/50?</div>
        <div className="col-span-1 text-center">Ação</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100 dark:divide-[#1C202B]">
        {rows.map((row, idx) => (
          <div key={row.id} className="grid grid-cols-12 items-center px-3 py-1.5 hover:bg-slate-50/70 dark:hover:bg-[#141822] transition-colors">
            {/* Description */}
            <div className="col-span-5 pr-2">
              <input
                ref={(el) => setCellRef(idx, 'desc', el)}
                type="text"
                value={row.description}
                placeholder="Ex: Bahamas Mix Frutas"
                onChange={(e) => updateRow(idx, { description: e.target.value })}
                onKeyDown={(e) => handleCellKeyDown(e, idx, 'desc')}
                className="w-full px-2 py-1 text-xs text-slate-900 dark:text-zinc-100 bg-transparent rounded focus:bg-white dark:focus:bg-[#1B202D] focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div className="col-span-3 pr-2">
              <select
                ref={(el) => setCellRef(idx, 'cat', el)}
                value={row.category}
                onChange={(e) => updateRow(idx, { category: e.target.value })}
                onKeyDown={(e) => handleCellKeyDown(e, idx, 'cat')}
                className="w-full px-1.5 py-1 text-xs text-slate-800 dark:text-zinc-200 bg-transparent rounded focus:bg-white dark:focus:bg-[#1B202D] focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Mercado">Supermercado</option>
                <option value="Combustível">Combustível</option>
                <option value="Farmácia">Farmácia</option>
                <option value="Restaurante">Restaurante / Bar</option>
                <option value="Serviços">Serviços Fixos</option>
              </select>
            </div>

            {/* Amount */}
            <div className="col-span-2 pr-2 text-right">
              <input
                ref={(el) => setCellRef(idx, 'amount', el)}
                type="number"
                step="0.01"
                value={row.amount || ''}
                placeholder="0,00"
                onChange={(e) => updateRow(idx, { amount: parseFloat(e.target.value) || 0 })}
                onKeyDown={(e) => handleCellKeyDown(e, idx, 'amount')}
                className="w-full px-2 py-1 text-xs text-right font-bold tabular-nums text-slate-900 dark:text-zinc-100 bg-transparent rounded focus:bg-white dark:focus:bg-[#1B202D] focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* 50/50 Toggle */}
            <div className="col-span-1 flex justify-center">
              <button
                ref={(el) => setCellRef(idx, 'shared', el)}
                type="button"
                onClick={() => updateRow(idx, { isShared: !row.isShared })}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'x') {
                    e.preventDefault();
                    updateRow(idx, { isShared: !row.isShared });
                  } else {
                    handleCellKeyDown(e, idx, 'shared');
                  }
                }}
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition ${
                  row.isShared
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500'
                }`}
              >
                {row.isShared ? '½' : '1'}
              </button>
            </div>

            {/* Delete Row */}
            <div className="col-span-1 flex justify-center">
              {rows.length > 1 && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setRows((prev) => prev.filter((_, i) => i !== idx))}
                  className="p-1 rounded text-slate-400 hover:text-rose-500 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary & Hotkeys */}
      <div className="flex items-center justify-between bg-slate-50 dark:bg-[#151922] px-4 py-2.5 border-t border-slate-200 dark:border-[#1F2432] text-xs">
        <div className="flex items-center gap-3 text-slate-500 dark:text-zinc-400 text-[11px]">
          <span><kbd className="px-1 py-0.5 rounded bg-white dark:bg-zinc-800 border">Enter ↵</kbd> Próximo / Nova Linha</span>
          <span><kbd className="px-1 py-0.5 rounded bg-white dark:bg-zinc-800 border">Espaço</kbd> Alterna 50/50</span>
          <span><kbd className="px-1 py-0.5 rounded bg-white dark:bg-zinc-800 border">↑/↓</kbd> Navega Linhas</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase mr-2">Total Digitado:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onCommit(rows.filter((r) => r.amount > 0))}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white dark:text-black font-semibold text-xs transition"
          >
            Concluir Lote
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 3. Gestão Determinística de Foco e Atalhos Globais

Para criar interfaces de produtividade contínua, utilize o hook `useGlobalKeyboardMatrix`:

```tsx
import { useEffect } from 'react';

interface MatrixShortcutsConfig {
  onNewTransaction?: () => void;
  onSearch?: () => void;
  onToggleTheme?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export function useGlobalKeyboardMatrix(handlers: MatrixShortcutsConfig) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se o foco já estiver dentro de um input/textarea, exceto atalhos com Ctrl/Cmd
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        (e.target as HTMLElement)?.tagName
      );

      // Cmd+Enter ou Ctrl+Enter: Salva formulário de qualquer lugar
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handlers.onSave?.();
        return;
      }

      // Escape fecha modais ou cancela
      if (e.key === 'Escape') {
        handlers.onCancel?.();
        return;
      }

      if (isInput) return;

      // 'N' para novo lançamento
      if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handlers.onNewTransaction?.();
      }

      // '/' para focar busca
      if (e.key === '/') {
        e.preventDefault();
        handlers.onSearch?.();
      }

      // 'T' para alternar tema claro/escuro
      if (e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handlers.onToggleTheme?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
```

---

## 4. Regras de Estilização Tailwind para Componentes Matrix

| Elemento | Classes Tailwind Recomendadas | Propósito UX |
| :--- | :--- | :--- |
| **Input Focus Ring** | `focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500` | Feedback imediato e nítido de qual campo está sob controle |
| **Números Financeiros** | `font-mono tabular-nums tracking-tight` | Evita pulos de largura de fonte quando dígitos mudam |
| **Atalho de Teclado** | `px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[10px] font-mono text-slate-500` | Ajuda contextual visível sem poluir a interface |
| **Linha de Grade Ativa** | `focus-within:bg-emerald-50/40 dark:focus-within:bg-emerald-950/20` | Ilumina a linha inteira da planilha onde o cursor se encontra |
| **Ação Principal Salvar** | `active:scale-[0.98] transition-transform duration-75` | Sensação mecânica tátil de clique instantâneo |

---

## 5. Checklist de Aceite para Telas Aceleradas

Antes de considerar uma interface de digitação pronta, valide:
- [ ] É possível cadastrar uma despesa completa do início ao fim sem tocar no mouse?
- [ ] O `Enter` avança sequencialmente os campos até salvar e abrir o próximo item?
- [ ] O input de valor monetário auto-formata os centavos sem exigir digitação de vírgula?
- [ ] O input de data responde aos atalhos `H` (hoje), `O` (ontem) e `+` / `-`?
- [ ] Ao tabular para um campo de texto, todo o texto existente é auto-selecionado?
- [ ] O `Esc` fecha qualquer modal ou cancela a edição sem perda de dados involuntária?
- [ ] Todos os valores numéricos usam `tabular-nums` e não causam Layout Shift?
