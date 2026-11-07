import React, { useState } from 'react';
import { downloadCSV } from '../utils/csvExporter';
import { 
  CheckSquare, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  CreditCard, 
  Download,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Users
} from 'lucide-react';
import { formatBRL, formatDateBR } from '../utils/formatters';

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

export function FixedExpensesChecklist({ 
  expenses, 
  onToggleStatus, 
  onDeleteExpense,
  onUpdateExpense,
  onOpenNewModal,
  selectedMonth 
}) {
  const [filter, setFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Edit Expense State
  const [editingExpense, setEditingExpense] = useState(null);
  const [editTotal, setEditTotal] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDueDay, setEditDueDay] = useState(10);
  const [saving, setSaving] = useState(false);

  const handleStartEdit = (item) => {
    setEditingExpense(item);
    setEditTotal(String(item.totalAmount));
    setEditTitle(item.title);
    setEditDueDay(item.dueDay || 10);
  };

  const handleSaveEdit = async (e) => {
    if (e) e.preventDefault();
    if (!editingExpense || !onUpdateExpense) return;
    const parsedAmount = parseMoneyInput(editTotal);
    if (parsedAmount <= 0) {
      alert('Por favor, informe um valor válido maior que zero.');
      return;
    }

    setSaving(true);
    try {
      await onUpdateExpense(editingExpense.id, {
        totalAmount: parsedAmount,
        title: editTitle.trim() || editingExpense.title,
        dueDay: Number(editDueDay) || editingExpense.dueDay
      });
      setEditingExpense(null);
    } catch (err) {
      console.error('Erro ao salvar despesa fixa:', err);
      alert('Erro ao salvar no servidor.');
    } finally {
      setSaving(false);
    }
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-8 text-center text-slate-500 dark:text-zinc-400 font-mono text-xs space-y-3 shadow-sm">
        <p>Nenhuma despesa fixa encontrada para este período.</p>
        <button
          onClick={onOpenNewModal}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Adicionar Despesa Fixa
        </button>
      </div>
    );
  }

  const filteredList = expenses.filter(item => {
    if (filter === 'PENDING' && item.status !== 'PAGO') return true;
    if (filter === 'PAID' && item.status === 'PAGO') return true;
    if (filter === 'ALL') {
      if (categoryFilter !== 'ALL' && item.beneficiary !== categoryFilter) return false;
      return true;
    }
    return false;
  });

  const totalAlexandre = expenses.reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);
  const paidAlexandre = expenses
    .filter(e => e.status === 'PAGO')
    .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);
  const pendingAlexandre = totalAlexandre - paidAlexandre;
  const paidCount = expenses.filter(e => e.status === 'PAGO').length;
  const percentagePaid = expenses.length > 0 ? ((paidCount / expenses.length) * 100).toFixed(0) : 0;

  const handleExportCSV = () => {
    const rows = filteredList.map(e => ({
      Titulo: e.title,
      Categoria: e.category,
      ValorTotal_R$: e.totalAmount,
      ParteAlexandre_R$: e.alexandreShare,
      ParteAmanda_R$: e.amandaShare,
      Divisao5050: e.isSplit5050 ? 'SIM' : 'NAO',
      Beneficiario: e.beneficiary,
      Vencimento: e.dueDate,
      Status: e.status,
      FormaPagamento: e.paymentMethod,
      PagoEm: e.paidAt || ''
    }));
    downloadCSV(`mobillspro_despesas_fixas_${selectedMonth}.csv`, rows);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Tem certeza que deseja remover "${title}" do checklist?`)) {
      if (onDeleteExpense) onDeleteExpense(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION WITH PROGRESS METRICS */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/50 flex items-center gap-1.5">
                <CheckSquare className="w-3 h-3" />
                CHECKLIST OFICIAL DE DESPESAS FIXAS
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">MÊS: {selectedMonth}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Controle e Status de Quitação Mensal
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              Monitore cada boleto e Pix fixo com 1 clique. O balanço do "Número Mágico" 
              se ajusta automaticamente conforme as obrigações são liquidadas ou inseridas.
            </p>
          </div>

          {/* Quick Metrics Bar & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-[#12151D] border border-slate-200 dark:border-[#222838] rounded-xl p-3 min-w-[310px]">
              <div className="text-center">
                <span className="text-[9px] uppercase font-mono text-slate-500 dark:text-zinc-500 block">
                  Total Alexandre
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-zinc-200 font-mono tabular-nums mt-0.5 block">
                  {formatBRL(totalAlexandre)}
                </span>
              </div>

              <div className="text-center border-x border-slate-200 dark:border-[#1F232D]">
                <span className="text-[9px] uppercase font-mono text-emerald-700 dark:text-emerald-400 block font-semibold">
                  Quitado ({percentagePaid}%)
                </span>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums mt-0.5 block">
                  {formatBRL(paidAlexandre)}
                </span>
              </div>

              <div className="text-center">
                <span className="text-[9px] uppercase font-mono text-amber-700 dark:text-amber-400 block font-semibold">
                  Pendente
                </span>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-300 font-mono tabular-nums mt-0.5 block">
                  {formatBRL(pendingAlexandre)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportCSV}
                className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#141720] dark:hover:bg-[#1A1E29] text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-[#2B303E] text-xs font-mono flex items-center justify-center gap-1.5 transition cursor-pointer"
                title="Exportar checklist para CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                <span>CSV</span>
              </button>

              <button
                onClick={onOpenNewModal}
                className="w-full sm:w-auto px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Nova Fixa
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#1F232D]">
          <div className="flex justify-between items-center text-xs font-mono text-slate-600 dark:text-zinc-400 mb-1.5">
            <span>Liquidação ({paidCount} de {expenses.length} contas quitadas)</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">{percentagePaid}% Concluído</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#181C25] h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-transparent">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-300" 
              style={{ width: `${percentagePaid}%` }}
            />
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#12141B] p-3 rounded-xl border border-slate-200 dark:border-[#1F232D] shadow-sm">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
              filter === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-black font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#181B24]'
            }`}
          >
            Todos ({expenses.length})
          </button>
          <button
            onClick={() => setFilter('PAID')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
              filter === 'PAID'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#181B24]'
            }`}
          >
            Quitados ({paidCount})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
              filter === 'PENDING'
                ? 'bg-amber-600 text-white font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#181B24]'
            }`}
          >
            Pendentes ({expenses.length - paidCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">Tipo:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#0D0F14] text-xs font-mono text-slate-900 dark:text-zinc-200 border border-slate-300 dark:border-[#2B303E] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
          >
            <option value="ALL">Todas as Despesas</option>
            <option value="COMPARTILHADO">Compartilhadas (50/50 Amanda)</option>
            <option value="ALEXANDRE">Individuais Alexandre (100%)</option>
          </select>
        </div>
      </div>

      {/* CHECKLIST TABLE / CARDS */}
      <div className="space-y-2.5">
        {filteredList.map((item) => {
          const isPaid = item.status === 'PAGO';
          const isShared = item.isSplit5050;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                isPaid 
                  ? 'bg-emerald-50/40 dark:bg-[#101319] border-emerald-200/60 dark:border-[#1C202A]' 
                  : 'bg-white dark:bg-[#13161F] border-slate-200 dark:border-[#292F3D] hover:border-slate-300'
              }`}
            >
              
              {/* Left Column: Toggle Checkbox + Title + Metadata */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleStatus(item.id)}
                  title={isPaid ? "Clique para marcar como Pendente" : "Clique para marcar como Quitado"}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition shrink-0 cursor-pointer ${
                    isPaid
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'border-2 border-slate-300 dark:border-[#3D4559] hover:border-emerald-500 bg-white dark:bg-[#161922] text-transparent hover:text-emerald-500'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-sm font-bold ${isPaid ? 'text-slate-600 dark:text-zinc-300 line-through' : 'text-slate-900 dark:text-zinc-100'}`}>
                      {item.title}
                    </h3>
                    
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium border ${
                      isShared 
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40' 
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40'
                    }`}>
                      {isShared ? '50/50 Amanda' : '100% Alexandre'}
                    </span>

                    <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-[#161922] px-2 py-0.5 rounded-md border border-slate-200 dark:border-[#242A38]">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-zinc-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                      Venc: Dia {item.dueDay} ({formatDateBR(item.dueDate)})
                    </span>

                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                      {item.paymentMethod}
                    </span>

                    {item.pixCode && (
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                        {item.pixCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Values + Status Badge + Delete Button */}
              <div className="flex sm:flex-row items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-[#1F232D]">
                <div className="text-left sm:text-right">
                  <span className="text-[9px] uppercase font-mono text-slate-400 dark:text-zinc-500 block">
                    Cota Alexandre
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-zinc-100 font-mono tabular-nums">
                    {formatBRL(item.alexandreShare)}
                  </span>
                  {isShared && (
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono block">
                      Total: {formatBRL(item.totalAmount)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase border ${
                    isPaid
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/40'
                      : 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/40'
                  }`}>
                    {isPaid ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Quitado
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" /> Pendente
                      </>
                    )}
                  </span>

                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:text-zinc-500 dark:hover:text-purple-400 dark:hover:bg-purple-950/40 transition cursor-pointer"
                    title="Editar valor ou vencimento da conta (ex: energia Cemig, água Copasa)"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-zinc-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 transition cursor-pointer"
                    title="Excluir despesa fixa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL DE EDIÇÃO DE DESPESA FIXA (Ex: Variação de Luz Cemig e Água Copasa) */}
      {editingExpense && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-xs animate-fadeIn font-mono"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#12151D] border border-slate-200 dark:border-[#2B303E] rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#1F232D]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wide">
                    Ajustar Despesa Fixa
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Mês de referência: {selectedMonth}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingExpense(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-[#1E232F] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-400 block mb-1">
                  Nome da Conta:
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 py-2 text-slate-900 dark:text-zinc-100 font-semibold outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-400">
                    Valor Total da Fatura / Boleto (R$):
                  </label>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                    {editingExpense.isSplit5050 ? 'Rateio 50/50 Amanda' : '100% Alexandre'}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    R$
                  </span>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={editTotal}
                    onChange={(e) => setEditTotal(e.target.value)}
                    placeholder="Ex: 280,00 ou 310,50"
                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 pl-9 py-2 text-slate-900 dark:text-zinc-100 font-bold text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 tabular-nums"
                  />
                </div>
                
                {/* Rateio Preview em Tempo Real */}
                <div className="mt-2 p-2.5 rounded-lg bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-[#1F232D] text-[11px]">
                  {editingExpense.isSplit5050 ? (
                    <div className="flex justify-between items-center text-slate-700 dark:text-zinc-300">
                      <span>Sua Cota (50%): <strong className="text-emerald-600 dark:text-emerald-400">{formatBRL(parseMoneyInput(editTotal) / 2)}</strong></span>
                      <span>Amanda (50%): <strong className="text-slate-500">{formatBRL(parseMoneyInput(editTotal) / 2)}</strong></span>
                    </div>
                  ) : (
                    <div className="text-slate-700 dark:text-zinc-300">
                      <span>Sua Responsabilidade: <strong className="text-emerald-600 dark:text-emerald-400">{formatBRL(parseMoneyInput(editTotal))}</strong> (Individual Alexandre)</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-400 block mb-1">
                  Dia do Vencimento:
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  value={editDueDay}
                  onChange={(e) => setEditDueDay(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 py-2 text-slate-900 dark:text-zinc-100 outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-[#1F232D]">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#161922] dark:hover:bg-[#1E232F] dark:text-zinc-400 font-semibold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
