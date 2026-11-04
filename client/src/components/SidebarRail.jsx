import React from 'react';
import {
  Terminal,
  Target,
  CheckSquare,
  CreditCard,
  Zap,
  Building2,
  TrendingUp,
  Users,
  Plus,
  RotateCcw,
  Sun,
  Moon,
  Crown
} from 'lucide-react';

export function SidebarRail({
  activeTab,
  setActiveTab,
  onOpenNewModal,
  onResetSystem,
  isDark,
  toggleTheme
}) {
  const railItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Terminal, tooltip: 'Visão Geral e Saldo Livre Real' },
    { id: 'budget503020', label: '50/30/20', icon: Target, tooltip: 'Método 50/30/20 & Planilha Mensal' },
    { id: 'checklist', label: 'Contas Fixas', icon: CheckSquare, tooltip: 'Contas Fixas & Rateio 50/50' },
    { id: 'cards', label: 'Cartões', icon: CreditCard, tooltip: 'Faturas Nubank, Bradesco e Mercado Pago' },
    { id: 'pix', label: 'Pix & Extrato', icon: Zap, tooltip: 'Lançamentos Instantâneos de Pix' },
    { id: 'housing', label: 'Moradia Centro', icon: Building2, tooltip: 'Simulação Financiamento Caixa vs Aluguel' },
    { id: 'investments', label: 'Investimentos', icon: TrendingUp, tooltip: 'Patrimônio Nomad USD + Tesouro Selic' },
    { id: 'incomes', label: 'Receitas', icon: Users, tooltip: 'Salários, Monitoria e Reembolsos Wellhub' },
  ];

  return (
    <aside 
      aria-label="Barra de navegação lateral Mobills"
      className="fixed left-0 top-0 bottom-0 w-16 sm:w-18 z-40 bg-white dark:bg-[#0E1015] border-r border-slate-200/80 dark:border-[#1E222B] shadow-xs hidden md:flex flex-col items-center justify-between py-4 select-none"
    >
      {/* Top: Mobills 3-Bar Logo & Purple (+) Button */}
      <div className="flex flex-col items-center w-full">
        {/* Mobills 3 Vertical Bars Chart Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-end gap-1 h-7 cursor-pointer group mb-4 p-1"
          title="MobillsPro - Dashboard Principal"
          role="button"
          tabIndex={0}
        >
          <span className="w-1.5 h-3.5 bg-[#8B5CF6] rounded-full transition-all group-hover:h-4" />
          <span className="w-1.5 h-5 bg-[#7C3AED] rounded-full transition-all group-hover:h-5.5" />
          <span className="w-1.5 h-7 bg-[#6D28D9] rounded-full transition-all group-hover:h-7" />
        </div>

        {/* Mobills Iconic Purple Round (+) Button */}
        {onOpenNewModal && (
          <button
            onClick={onOpenNewModal}
            className="w-10 h-10 rounded-full bg-[#6D28D9] hover:bg-[#5B21B6] text-white flex items-center justify-center shadow-md shadow-purple-500/25 active:scale-95 transition cursor-pointer mb-5"
            title="Novo Lançamento Rápido (Atalho de teclado: N)"
            aria-label="Adicionar novo lançamento"
          >
            <Plus className="w-5 h-5 stroke-[2.8]" />
          </button>
        )}

        {/* Navigation Rail Icons */}
        <nav className="flex flex-col items-center gap-1.5 w-full px-2" aria-label="Navegação em trilho">
          {railItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer group ${
                  isActive
                    ? 'text-[#6D28D9] bg-purple-50 dark:bg-purple-950/40 shadow-xs'
                    : 'text-slate-400 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-[#151922]'
                }`}
                title={item.tooltip}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active Purple Indicator Bar on Left Edge */}
                {isActive && (
                  <span className="absolute -left-2 top-2 bottom-2 w-1 bg-[#6D28D9] rounded-r-full" />
                )}

                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />

                {/* Floating Tooltip */}
                <span className="absolute left-14 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg hidden sm:block">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Theme Toggle, Reset & User Profile */}
      <div className="flex flex-col items-center gap-2.5 w-full px-2 pt-2 border-t border-slate-100 dark:border-[#1E222B]">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-[#1A1D24] transition cursor-pointer"
          title={isDark ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
          aria-label="Alternar tema"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Reset System */}
        {onResetSystem && (
          <button
            onClick={() => {
              if (window.confirm('Deseja restaurar os dados originais do seed (Alexandre & Amanda em Muriaé/MG)?')) {
                onResetSystem();
              }
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
            title="Restaurar dados originais do sistema"
            aria-label="Restaurar dados"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* User Profile Pill Avatar with Gold Crown */}
        <div 
          className="relative mt-1 cursor-pointer group"
          title="Alexandre (Owner) • MobillsPro"
        >
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-xs flex items-center justify-center border-2 border-white dark:border-[#0E1015] shadow-xs">
            A
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-[9px] shadow-xs">
            <Crown className="w-2.5 h-2.5 stroke-[2.5]" />
          </div>
        </div>
      </div>
    </aside>
  );
}

