import React, { useState } from 'react';
import {
  Terminal,
  Layers,
  CreditCard,
  Users,
  TrendingUp,
  RefreshCw,
  ChevronDown,
  Calendar,
  CheckCircle2,
  Building2,
  Smartphone,
  Wallet,
  CheckSquare,
  Sparkles,
  Target,
  Zap,
  Sun,
  Moon,
  Plus,
  Crown
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function Header({
  activeTab,
  setActiveTab,
  selectedMonth,
  setSelectedMonth,
  magicNumber,
  onRefresh,
  loading,
  onOpenNewModal,
  isDark: propIsDark,
  toggleTheme: propToggleTheme
}) {
  const [internalDark, setInternalDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const isDark = propIsDark !== undefined ? propIsDark : internalDark;

  const toggleTheme = () => {
    if (propToggleTheme) {
      propToggleTheme();
    } else {
      const nextDark = !internalDark;
      setInternalDark(nextDark);
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('mobillspro_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('mobillspro_theme', 'light');
      }
    }
  };
  // As Telas Principais do MobillsPro (Navegação Fixa no Topo)
  const primaryTabs = [
    { id: 'dashboard', label: 'Balanço', icon: Terminal },
    { id: 'budget503020', label: '50/30/20', icon: Target },
    { id: 'checklist', label: 'Fixas', icon: CheckSquare },
    { id: 'cards', label: 'Cartões', icon: CreditCard },
    { id: 'pix', label: 'Pix', icon: Zap },
    { id: 'housing', label: 'Moradia', icon: Building2 },
    { id: 'investments', label: 'Investimentos', icon: TrendingUp },
  ];

  const navSections = [
    {
      id: 'dashboard',
      label: 'Balanço Geral',
      icon: Terminal,
      tabs: ['dashboard', 'budget503020', 'budgets']
    },
    {
      id: 'cards-group',
      label: 'Cartões & Faturas',
      icon: CreditCard,
      tabs: ['cards-advanced', 'cards'],
      defaultTab: 'cards'
    },
    {
      id: 'couple-group',
      label: 'Contas & Rateio 50/50',
      icon: Users,
      tabs: ['incomes', 'checklist', 'pix'],
      defaultTab: 'checklist'
    },
    {
      id: 'wealth-group',
      label: 'Patrimônio & Futuro',
      icon: TrendingUp,
      tabs: ['investments', 'housing', 'iphone'],
      defaultTab: 'investments'
    }
  ];

  const months = [
    { value: '2026-05', label: 'Maio/2026' },
    { value: '2026-06', label: 'Junho/2026' },
    { value: '2026-07', label: 'Julho/2026' },
    { value: '2026-08', label: 'Agosto/2026' },
    { value: '2026-09', label: 'Setembro/2026' },
    { value: '2026-10', label: 'Outubro/2026 (Atual)' },
  ];

  // Identifica a seção ativa
  const currentSection = navSections.find(s => s.tabs.includes(activeTab)) || navSections[0];

  const handleSectionClick = (section) => {
    if (section.id === 'dashboard') {
      setActiveTab('dashboard');
    } else {
      setActiveTab(section.defaultTab || section.tabs[0]);
    }
  };

  // Títulos das telas para o topo do Mobills Web
  const tabTitles = {
    dashboard: 'Dashboard',
    budget503020: 'Método 50/30/20',
    checklist: 'Contas Fixas & Rateio',
    cards: 'Auditoria de Cartões',
    'cards-advanced': 'Faturas & Limites',
    pix: 'Lançamentos Pix',
    housing: 'Moradia Centro vs Terreno',
    investments: 'Investimentos & Selic',
    incomes: 'Divisão de Receitas & Wellhub',
    budgets: 'Metas por Centro de Custo',
    iphone: 'Captura Instantânea'
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0E1015]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-[#1E222B] shadow-2xs transition-colors duration-150">

      {/* Top Bar: Brand (Mobile) / Title (Desktop), Centered Month Selector, User Profile Pill */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 md:py-3 flex items-center justify-between gap-3">

        {/* Desktop View Title (Matches Mobills Web Screenshot) */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            {tabTitles[activeTab] || 'Dashboard'}
          </h1>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
            Muriaé
          </span>
        </div>

        {/* Mobile Brand: Mobills 3-Bar Logo & (+) Button */}
        <div className="flex md:hidden items-center gap-2.5 shrink-0">
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer select-none"
            title="Ir para o Dashboard"
          >
            <div className="flex items-end gap-1 h-6">
              <span className="w-1.5 h-3 bg-[#8B5CF6] rounded-full" />
              <span className="w-1.5 h-4.5 bg-[#7C3AED] rounded-full" />
              <span className="w-1.5 h-6 bg-[#6D28D9] rounded-full" />
            </div>
            <span className="text-base font-black tracking-tight text-slate-800 dark:text-white">
              mobills<span className="text-purple-600 dark:text-purple-400">pro</span>
            </span>
          </div>

          {onOpenNewModal && (
            <button
              onClick={onOpenNewModal}
              className="w-7 h-7 rounded-full bg-[#6D28D9] text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
              title="Novo Lançamento (Atalho: N)"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
            </button>
          )}
        </div>

        {/* Centered Month Selector Pill (Iconic Mobills Web Pill Design) */}
        <div className="flex-1 flex justify-center">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              aria-label="Selecionar mês de referência"
              className="bg-white dark:bg-[#14161C] text-xs sm:text-sm font-semibold text-slate-700 dark:text-neutral-200 border border-slate-200/90 dark:border-[#222731] rounded-full pl-4 pr-9 py-1.5 min-h-[38px] sm:min-h-[40px] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer appearance-none shadow-xs hover:border-slate-300"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value} className="bg-white dark:bg-[#14161C] text-slate-900 dark:text-neutral-200">
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right Controls: User Profile Pill with Crown & Sync */}
        <div className="flex items-center gap-2 shrink-0">
          {/* User Profile Pill */}
          <div 
            onClick={() => setActiveTab('incomes')}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white dark:bg-[#14161C] border border-slate-200/90 dark:border-[#222731] shadow-xs cursor-pointer hover:border-purple-300 transition"
            title="Alexandre (Owner) • Rateio 50/50 Amanda"
          >
            <div className="relative w-7 h-7 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-xs flex items-center justify-center">
              <span>A</span>
              <Crown className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-zinc-200">
              Alexandre
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </div>

          {/* Sync / Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#14161C] border border-slate-200/80 dark:border-[#222731] text-slate-500 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 shadow-xs transition active:scale-95 cursor-pointer"
              title="Atualizar dados do servidor"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-600' : ''}`} />
            </button>
          )}
        </div>

      </div>
      {/* Sub-Context Bar (Workbench Perspective Tabs) */}
      <div className="border-t border-slate-200 dark:border-[#191C24] bg-slate-50 dark:bg-[#0B0D11] px-3 sm:px-6 lg:px-8 py-1.5 overflow-x-auto scrollbar-none transition-colors duration-150">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs gap-3">

          {/* Sub-Tabs contextuais baseadas na seção selecionada */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">

            {/* Seção 1: Balanço Geral */}
            {currentSection.id === 'dashboard' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] flex items-center rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-[#1E232E] text-white font-bold border border-[#2B3242]' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                  Painel Executivo
                </button>
                <button
                  onClick={() => setActiveTab('budgets')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] flex items-center rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${activeTab === 'budgets' ? 'bg-[#1E232E] text-white font-bold border border-[#2B3242]' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                  Metas & Centros de Custo
                </button>
              </>
            )}

            {/* Seção 2: Cartões & Faturas */}
            {currentSection.id === 'cards-group' && (
              <>
                <button
                  onClick={() => setActiveTab('cards-advanced')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] flex items-center rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${activeTab === 'cards-advanced' ? 'bg-[#1E232E] text-white font-bold border border-[#2B3242]' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                  Faturas & Linha do Tempo
                </button>
                <button
                  onClick={() => setActiveTab('cards')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] flex items-center rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${activeTab === 'cards' ? 'bg-[#1E232E] text-white font-bold border border-[#2B3242]' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                  Auditoria 6 Meses & Supermercados
                </button>
              </>
            )}

            {/* Seção 3: Contas & Rateio 50/50 */}
            {currentSection.id === 'couple-group' && (
              <>
                <button
                  onClick={() => setActiveTab('incomes')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] flex items-center rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${activeTab === 'incomes' ? 'bg-[#1E232E] text-white font-bold border border-[#2B3242]' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                  Acerto Bilateral 50/50 & Receitas
                </button>
                <button
                  onClick={() => setActiveTab('checklist')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] flex items-center rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${activeTab === 'checklist' ? 'bg-[#1E232E] text-white font-bold border border-[#2B3242]' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                  Checklist de Boletos Fixos
                </button>
                <button
                  onClick={() => setActiveTab('pix')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] flex items-center rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${activeTab === 'pix' ? 'bg-[#1E232E] text-white font-bold border border-[#2B3242]' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                  Detector de Pix Avulso
                </button>
              </>
            )}

            {/* Seção 4: Patrimônio & Futuro */}
            {currentSection.id === 'wealth-group' && (
              <>
                <button
                  onClick={() => setActiveTab('investments')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] flex items-center rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${activeTab === 'investments' ? 'bg-[#1E232E] text-white font-bold border border-[#2B3242]' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                  Carteira Nomad & Selic FIRE
                </button>
                <button
                  onClick={() => setActiveTab('housing')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] flex items-center rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${activeTab === 'housing' ? 'bg-[#1E232E] text-white font-bold border border-[#2B3242]' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                  Transição Caixa Centro (SBPE)
                </button>
                <button
                  onClick={() => setActiveTab('iphone')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] flex items-center rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${activeTab === 'iphone' ? 'bg-[#1E232E] text-white font-bold border border-[#2B3242]' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                  Motor de Captura Push/SMS
                </button>
              </>
            )}

          </div>

          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-neutral-400 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>PostgreSQL & JSON Sync Engine</span>
          </div>

        </div>
      </div>

    </header>
  );
}
