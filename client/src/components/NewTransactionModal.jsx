import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CreditCard, 
  Wallet, 
  CheckSquare, 
  ArrowUpRight, 
  Sparkles,
  Users,
  CheckCircle2
} from 'lucide-react';

function parseMoneyInput(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  let cleaned = String(val).replace(/[^\d.,]/g, '').trim();
  if (cleaned.includes('.') && cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes(',')) {
    cleaned = cleaned.replace(',', '.');
  }
  return parseFloat(cleaned) || 0;
}

export function NewTransactionModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  selectedMonth = '2026-10', 
  onAddCardTransaction 
}) {
  const [type, setType] = useState('CARD'); // 'CARD' | 'PIX' | 'FIXED' | 'INCOME' | 'BUDGET'
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Supermercados Muriaé');
  const [cardId, setCardId] = useState('card-nubank');
  const [isShared, setIsShared] = useState(true);
  const [isAtypical, setIsAtypical] = useState(false);
  const [pixDirection, setPixDirection] = useState('SAIDA');
  const [dueDay, setDueDay] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const amountInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      return;
    }

    // Foco imediato com seleção para aceleração de digitação (UI Matrix UX)
    setTimeout(() => {
      if (amountInputRef.current) {
        amountInputRef.current.focus();
        amountInputRef.current.select();
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        const formEl = document.getElementById('new-transaction-form');
        if (formEl) formEl.requestSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    const numAmount = parseMoneyInput(amount);
    if (numAmount <= 0) {
      setErrorMessage('Por favor, informe um valor numérico válido maior que zero (ex: 150 ou 1.250,50).');
      return;
    }

    try {
      setSubmitting(true);

      if (type === 'CARD') {
        let cardName = "Nubank Ultravioleta";
        if (cardId === 'card-bradesco') cardName = "Bradesco Visa Platinum";
        if (cardId === 'card-mercadopago') cardName = "Mercado Pago Visa";

        const todayDayStr = String(new Date().getDate()).padStart(2, '0');
        const transactionDate = selectedMonth ? `${selectedMonth}-${todayDayStr}` : new Date().toISOString().split('T')[0];

        const payload = {
          cardId,
          cardName,
          establishment: description.trim() || "Estabelecimento Muriaé",
          category,
          amount: numAmount,
          isShared,
          isAtypical,
          atypicalReason: isAtypical ? "Gasto extraordinário informado pelo usuário" : null,
          referenceMonth: selectedMonth || '2026-10',
          transactionDate
        };

        if (onAddCardTransaction) {
          const success = await onAddCardTransaction(payload);
          if (!success) {
            throw new Error('Não foi possível registrar a compra no cartão.');
          }
        } else {
          const res = await fetch('/api/cards/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Falha ao salvar no servidor.');
          }
        }
      } else if (type === 'PIX') {
        const payload = {
          direction: pixDirection,
          amount: numAmount,
          partyName: description.trim() || "Favorecido Pix",
          category,
          description: `Transação Pix: ${description.trim() || 'Avulso'}`,
          referenceMonth: selectedMonth || '2026-10',
          transactionDate: new Date().toISOString()
        };
        const res = await fetch('/api/pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Falha ao registrar Pix.');
        }
      } else if (type === 'FIXED') {
        const payload = {
          title: description.trim() || "Despesa Fixa",
          category,
          totalAmount: numAmount,
          isSplit5050: isShared,
          beneficiary: isShared ? "COMPARTILHADO" : "ALEXANDRE",
          dueDay: Number(dueDay) || 10,
          referenceMonth: selectedMonth || '2026-10',
          dueDate: `${selectedMonth || '2026-10'}-${String(dueDay || 10).padStart(2, '0')}`
        };
        const res = await fetch('/api/fixed-expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Falha ao cadastrar despesa fixa.');
        }
      } else if (type === 'INCOME') {
        const payload = {
          userName: isShared ? "Alexandre & Amanda" : "Alexandre",
          description: description.trim() || "Nova Entrada",
          amount: numAmount,
          category: "Receitas Extras",
          referenceMonth: selectedMonth || '2026-10'
        };
        const res = await fetch('/api/incomes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Falha ao registrar receita.');
        }
      } else if (type === 'BUDGET') {
        const res = await fetch('/api/budgets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: description.trim() || "Nova Categoria",
            targetAmount: numAmount,
            shared5050: isShared
          })
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Falha ao registrar meta.');
        }
      }

      setAmount('');
      setDescription('');
      setIsAtypical(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar lançamento:', err);
      setErrorMessage(err.message || 'Erro ao salvar no servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-[#12151D] border border-slate-200 dark:border-[#2B303E] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative font-mono">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#1F232D]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-[#1A1F2C] dark:text-emerald-400 border border-emerald-200 dark:border-[#2A3347]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="modal-title" className="text-sm font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wide">Novo Lançamento Dinâmico</h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Mês de referência: <span className="font-semibold text-purple-600 dark:text-purple-400">{selectedMonth}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-[#1E232F] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-300 text-xs flex items-center gap-2">
            <span>⚠</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Type Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-[#0D0F14] border border-slate-200 dark:border-[#1F232D] rounded-xl my-4 text-xs">
          <button
            type="button"
            onClick={() => setType('CARD')}
            className={`py-2 rounded-lg transition flex flex-col items-center gap-1 cursor-pointer ${
              type === 'CARD' ? 'bg-white text-slate-900 dark:bg-[#1E232F] dark:text-zinc-100 font-bold shadow-xs' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Cartão
          </button>
          <button
            type="button"
            onClick={() => setType('PIX')}
            className={`py-2 rounded-lg transition flex flex-col items-center gap-1 cursor-pointer ${
              type === 'PIX' ? 'bg-white text-slate-900 dark:bg-[#1E232F] dark:text-zinc-100 font-bold shadow-xs' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            Pix
          </button>
          <button
            type="button"
            onClick={() => setType('FIXED')}
            className={`py-2 rounded-lg transition flex flex-col items-center gap-1 cursor-pointer ${
              type === 'FIXED' ? 'bg-white text-slate-900 dark:bg-[#1E232F] dark:text-zinc-100 font-bold shadow-xs' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Fixa
          </button>
          <button
            type="button"
            onClick={() => setType('INCOME')}
            className={`py-2 rounded-lg transition flex flex-col items-center gap-1 cursor-pointer ${
              type === 'INCOME' ? 'bg-white text-slate-900 dark:bg-[#1E232F] dark:text-zinc-100 font-bold shadow-xs' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Receita
          </button>
        </div>

        {/* Form */}
        <form id="new-transaction-form" onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-400">Valor (R$):</label>
              <kbd className="text-[9px] px-1 py-0.2 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500">
                Foco Automático
              </kbd>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 font-bold">
                R$
              </span>
              <input
                ref={amountInputRef}
                type="text"
                required
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 pl-9 py-2 text-slate-900 dark:text-zinc-100 font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition tabular-nums"
              />
            </div>
          </div>

          {/* Description / Merchant */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-400 block mb-1">
              {type === 'CARD' ? 'Estabelecimento em Muriaé:' : (type === 'PIX' ? 'Chave / Favorecido:' : 'Descrição / Título:')}
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Bahamas Mix, Farmácia Indiana, Cemig..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 py-2 text-slate-900 dark:text-zinc-100 focus:border-emerald-500 outline-none transition"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-400 block mb-1">Categoria:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 py-2 text-slate-900 dark:text-zinc-200 focus:border-emerald-500 outline-none transition cursor-pointer"
            >
              <option value="Supermercados Muriaé">Supermercados Muriaé (BH / Bahamas / Top Frut)</option>
              <option value="Combustível & Transporte">Combustível / Deslocamento</option>
              <option value="Moradia & Habitação">Moradia / Habitação</option>
              <option value="Contas de Consumo">Contas de Consumo (Energia / Água / Internet)</option>
              <option value="Saúde Individual (Alexandre)">Saúde (Unimed)</option>
              <option value="Saúde & Fitness (Alexandre)">Academia Alexandre</option>
              <option value="Farmácia & Medicamentos">Farmácia & Medicamentos</option>
              <option value="Alimentação Fora & Restaurantes">Alimentação Fora (iFood / Lanches)</option>
              <option value="Serviços Domésticos">Serviços Domésticos (Diarista / Barbeiro)</option>
              <option value="Outros / Avulsos">Outros / Avulsos</option>
            </select>
          </div>

          {/* Card Selection (if CARD) */}
          {type === 'CARD' && (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-400 block mb-1">Cartão:</label>
                <select
                  value={cardId}
                  onChange={(e) => setCardId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-2.5 py-2 text-slate-900 dark:text-zinc-200 outline-none cursor-pointer"
                >
                  <option value="card-nubank">Nubank Ultravioleta</option>
                  <option value="card-bradesco">Bradesco Visa Platinum</option>
                  <option value="card-mercadopago">Mercado Pago Visa</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-400 block mb-1">Gasto Atípico?</label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="atypicalCheck"
                    checked={isAtypical}
                    onChange={(e) => setIsAtypical(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                  <label htmlFor="atypicalCheck" className="text-slate-600 dark:text-zinc-400 text-xs cursor-pointer font-medium">
                    Isolar da projeção
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Pix Direction (if PIX) */}
          {type === 'PIX' && (
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-400 block mb-1">Tipo de Pix:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPixDirection('SAIDA')}
                  className={`py-2 rounded-lg font-semibold transition cursor-pointer border ${
                    pixDirection === 'SAIDA' ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60' : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-[#0D0F14] dark:text-zinc-500 dark:border-[#222631]'
                  }`}
                >
                  Pix Saída
                </button>
                <button
                  type="button"
                  onClick={() => setPixDirection('ENTRADA')}
                  className={`py-2 rounded-lg font-semibold transition cursor-pointer border ${
                    pixDirection === 'ENTRADA' ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60' : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-[#0D0F14] dark:text-zinc-500 dark:border-[#222631]'
                  }`}
                >
                  Pix Entrada
                </button>
              </div>
            </div>
          )}

          {/* Due Day (if FIXED) */}
          {type === 'FIXED' && (
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-400 block mb-1">Dia do Vencimento:</label>
              <input
                type="number"
                min="1"
                max="31"
                value={dueDay}
                onChange={(e) => setDueDay(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 py-2 text-slate-900 dark:text-zinc-100 outline-none"
              />
            </div>
          )}

          {/* 50/50 Division Rule Checkbox */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-[#1F232D] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="font-semibold text-slate-900 dark:text-zinc-200 block text-xs">Rateio 50/50 com Amanda</span>
                <span className="text-[10px] text-slate-500">Divide meio a meio no balanço e acerto</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-[#1F232D]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#161922] dark:hover:bg-[#1E232F] dark:text-zinc-400 text-xs font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
              title="Salvar lançamento instantaneamente (Ctrl+Enter ou Cmd+Enter)"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Salvando...' : 'Confirmar Lançamento'}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-emerald-700 text-emerald-100 text-[10px] font-mono">
                ⌘↵
              </kbd>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
