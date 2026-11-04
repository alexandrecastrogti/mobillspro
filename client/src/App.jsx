import React, { useState } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DivisionIncomesView } from './components/DivisionIncomesView';
import { FixedExpensesChecklist } from './components/FixedExpensesChecklist';
import { CardsAuditView } from './components/CardsAuditView';
import { PixDetectorView } from './components/PixDetectorView';
import { HousingTransitionView } from './components/HousingTransitionView';
import { InvestmentsView } from './components/InvestmentsView';
import { BudgetsMetasView } from './components/BudgetsMetasView';
import { Budget503020View } from './components/Budget503020View';
import { CreditCardsAdvancedView } from './components/CreditCardsAdvancedView';
import { IPhoneCaptureEngineView } from './components/IPhoneCaptureEngineView';
import { NewTransactionModal } from './components/NewTransactionModal';
import { SidebarRail } from './components/SidebarRail';
import { useFinanceManager } from './hooks/useFinanceManager';
import { 
  Sparkles, 
  ArrowLeftRight, 
  CheckSquare, 
  CreditCard, 
  Wallet, 
  Building2, 
  TrendingUp,
  RotateCcw,
  Target,
  Smartphone,
  Plus
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [period, setPeriod] = useState('CURRENT_MONTH');
  const [excludeAtypical, setExcludeAtypical] = useState(true);
  const [useNewApartment, setUseNewApartment] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mobillspro_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mobillspro_theme', 'light');
    }
  };

  // Clean Architecture: Delegate state & persistence to Custom Hook
  const {
    loading,
    error,
    refreshData,
    summaryData,
    fixedExpensesData,
    cardsAuditData,
    detailedCardsData,
    budgetsData,
    pixData,
    housingData,
    investmentsData,
    wellhubData,
    incomesData,
    smsHistoryData,
    // CRUD Actions
    toggleFixedExpense,
    deleteFixedExpense,
    toggleAtypicalTransaction,
    deleteCardTransaction,
    updateCreditCard,
    deletePixTransaction,
    updateBudget,
    deleteBudget,
    deleteIncome,
    resetSystem
  } = useFinanceManager(selectedMonth, period, excludeAtypical, useNewApartment);

  const magicNumber = summaryData?.balance?.magicNumber;

  // UI Matrix: Atalhos de Teclado Globais para Digitação Acelerada (Heads-Down UX)
  React.useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName);
      if (!isInput) {
        if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          setIsNewModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-[#0D0F14] text-slate-900 dark:text-zinc-100 flex font-sans pb-20 md:pb-0 relative selection:bg-purple-500/20 selection:text-purple-700 dark:selection:text-purple-300 transition-colors duration-150">
      
      {/* Desktop Mobills Left Sidebar Rail */}
      <SidebarRail
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onResetSystem={resetSystem}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {/* Main Viewport Column (Offset by Sidebar on Desktop) */}
      <div className="flex-1 flex flex-col md:pl-16 sm:md:pl-18 min-w-0">
        
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          magicNumber={magicNumber}
          onRefresh={refreshData}
          loading={loading}
          onOpenNewModal={() => setIsNewModalOpen(true)}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-center justify-between font-mono">
            <span>{error}</span>
            <button
              onClick={refreshData}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded text-xs transition"
            >
              Reconectar
            </button>
          </div>
        )}

        {/* Tab 1: Dashboard Principal */}
        {activeTab === 'dashboard' && (
          <DashboardView
            summaryData={summaryData}
            excludeAtypical={excludeAtypical}
            setExcludeAtypical={setExcludeAtypical}
            useNewApartment={useNewApartment}
            setUseNewApartment={setUseNewApartment}
            setActiveTab={setActiveTab}
            onToggleFixedExpense={toggleFixedExpense}
            period={period}
            setPeriod={setPeriod}
            fixedExpenses={fixedExpensesData}
            cardTransactions={cardsAuditData?.transactions}
            onOpenNewModal={() => setIsNewModalOpen(true)}
            onResetSystem={resetSystem}
          />
        )}

        {/* Tab: Método 50/30/20 (Inspirado na Planilha Mensal do Alexandre) */}
        {activeTab === 'budget503020' && (
          <Budget503020View
            summaryData={summaryData}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Tab 2: Metas & Orçamento por Centro de Custo */}
        {activeTab === 'budgets' && (
          <BudgetsMetasView
            budgetsData={budgetsData}
            onUpdateBudget={updateBudget}
            onDeleteBudget={deleteBudget}
            onOpenNewModal={() => setIsNewModalOpen(true)}
          />
        )}

        {/* Tab 3: Gestão Avançada de Cartões & Faturas */}
        {activeTab === 'cards-advanced' && (
          <CreditCardsAdvancedView
            cardsData={detailedCardsData}
            onUpdateCard={updateCreditCard}
          />
        )}

        {/* Tab 4: Divisão 50/50 & Receitas */}
        {activeTab === 'incomes' && (
          <DivisionIncomesView
            wellhubData={wellhubData}
            incomesData={incomesData}
            fixedExpensesData={fixedExpensesData}
            onDeleteIncome={deleteIncome}
            onOpenNewModal={() => setIsNewModalOpen(true)}
          />
        )}

        {/* Tab 5: Checklist Despesas Fixas */}
        {activeTab === 'checklist' && (
          <FixedExpensesChecklist
            expenses={fixedExpensesData}
            onToggleStatus={toggleFixedExpense}
            onDeleteExpense={deleteFixedExpense}
            onOpenNewModal={() => setIsNewModalOpen(true)}
            selectedMonth={selectedMonth}
          />
        )}

        {/* Tab 6: Auditoria 6 Meses de Cartões & Supermercados */}
        {activeTab === 'cards' && (
          <CardsAuditView
            auditData={cardsAuditData}
            excludeAtypical={excludeAtypical}
            setExcludeAtypical={setExcludeAtypical}
            onToggleAtypicalTransaction={toggleAtypicalTransaction}
            onDeleteTransaction={deleteCardTransaction}
            onOpenNewModal={() => setIsNewModalOpen(true)}
            onRefresh={refreshData}
          />
        )}

        {/* Tab 7: Detector Pix */}
        {activeTab === 'pix' && (
          <PixDetectorView
            pixData={pixData}
            onDeletePix={deletePixTransaction}
            onOpenNewModal={() => setIsNewModalOpen(true)}
          />
        )}

        {/* Tab 8: Transição Centro Caixa SBPE */}
        {activeTab === 'housing' && (
          <HousingTransitionView
            simulationData={housingData}
            useNewApartment={useNewApartment}
            setUseNewApartment={setUseNewApartment}
          />
        )}

        {/* Tab 9: Investimentos & Ativos (Nomad & Selic) */}
        {activeTab === 'investments' && (
          <InvestmentsView
            investmentsData={investmentsData}
            onUpdateInvestment={async (id, payload) => {
              await fetch(`/api/investments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              refreshData();
            }}
          />
        )}

        {/* Tab 10: Motor de Captura Push/SMS iPhone 17 Pro Max */}
        {activeTab === 'iphone' && (
          <IPhoneCaptureEngineView
            smsHistory={smsHistoryData}
            onCaptureSms={refreshData}
          />
        )}

      </main>

      {/* GLOBAL FLOATING ACTION BUTTON (FAB) - NOVO LANÇAMENTO (SOLID WORKBENCH ACTION) */}
      <button
        onClick={() => setIsNewModalOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-6 z-40 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs tracking-wider uppercase shadow-xl shadow-black/60 flex items-center gap-2 transition active:scale-95 border border-emerald-400/80 cursor-pointer"
        title="Novo Lançamento Rápido (Pressione 'N' no teclado)"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span className="hidden sm:inline">Novo Lançamento</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-black/20 text-black text-[10px] font-mono">
          N
        </kbd>
      </button>

      {/* GLOBAL TRANSACTION MODAL */}
      <NewTransactionModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={refreshData}
      />

      {/* Footer / System Status Console */}
      <footer className="mt-auto border-t border-slate-200 dark:border-[#1F232D] bg-white dark:bg-[#0E1015] py-3.5 px-4 sm:px-6 text-xs text-slate-500 dark:text-[#8B909A] font-mono transition-colors duration-150">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-800 dark:text-zinc-300 font-bold">MOBILLSPRO</span>
            <span className="text-slate-300 dark:text-zinc-600">|</span>
            <span className="text-slate-600 dark:text-zinc-400">Muriaé/MG</span>
            <span className="text-slate-300 dark:text-zinc-600">|</span>
            <span className="text-slate-500 dark:text-zinc-500">Alexandre & Amanda</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={resetSystem}
              className="text-slate-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 transition cursor-pointer"
              title="Recarrega a base original oficial do MobillsPro"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Resetar Dados
            </button>
            <span className="text-slate-300 dark:text-zinc-600">|</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Sistema Operacional
            </span>
          </div>
        </div>
      </footer>

      </div>

      {/* Mobile Bottom Navigation Bar (Solid Engineering Bar with >= 48px Touch Targets) */}
      <nav 
        aria-label="Navegação inferior mobile" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0E1015]/95 backdrop-blur-sm border-t border-slate-200 dark:border-[#1F232D] px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))] grid grid-cols-6 transition-colors duration-150"
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          aria-current={activeTab === 'dashboard' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] text-[9px] font-mono font-medium rounded-lg transition active:scale-95 cursor-pointer ${
            activeTab === 'dashboard' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-[#161A22]' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>Balanço</span>
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          aria-current={activeTab === 'checklist' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] text-[9px] font-mono font-medium rounded-lg transition active:scale-95 cursor-pointer ${
            activeTab === 'checklist' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-[#161A22]' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <CheckSquare className="w-4 h-4 mb-0.5" />
          <span>Fixas</span>
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          aria-current={activeTab === 'cards' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] text-[9px] font-mono font-medium rounded-lg transition active:scale-95 cursor-pointer ${
            activeTab === 'cards' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-[#161A22]' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <CreditCard className="w-4 h-4 mb-0.5" />
          <span>Cartões</span>
        </button>
        <button
          onClick={() => setActiveTab('pix')}
          aria-current={activeTab === 'pix' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] text-[9px] font-mono font-medium rounded-lg transition active:scale-95 cursor-pointer ${
            activeTab === 'pix' ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-[#161A22]' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4 mb-0.5" />
          <span>Pix</span>
        </button>
        <button
          onClick={() => setActiveTab('housing')}
          aria-current={activeTab === 'housing' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] text-[9px] font-mono font-medium rounded-lg transition active:scale-95 cursor-pointer ${
            activeTab === 'housing' ? 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-[#161A22]' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <Building2 className="w-4 h-4 mb-0.5" />
          <span>Moradia</span>
        </button>
        <button
          onClick={() => setActiveTab('investments')}
          aria-current={activeTab === 'investments' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] text-[9px] font-mono font-medium rounded-lg transition active:scale-95 cursor-pointer ${
            activeTab === 'investments' ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-[#161A22]' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 mb-0.5" />
          <span>Ativos</span>
        </button>
      </nav>

    </div>
  );
}
