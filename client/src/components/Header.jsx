import React from 'react';
import { 
  Wallet, 
  MapPin, 
  Sparkles, 
  CreditCard, 
  CheckSquare, 
  ArrowLeftRight, 
  Building2, 
  TrendingUp, 
  RefreshCw,
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function Header({ 
  activeTab, 
  setActiveTab, 
  selectedMonth, 
  setSelectedMonth, 
  magicNumber, 
  onRefresh, 
  loading 
}) {
  const navTabs = [
    { id: 'dashboard', label: 'Balanço Geral', icon: Sparkles },
    { id: 'incomes', label: 'Divisão 50/50 & Receitas', icon: ArrowLeftRight },
    { id: 'checklist', label: 'Checklist Fixas', icon: CheckSquare },
    { id: 'cards', label: 'Auditoria Cartões', icon: CreditCard },
    { id: 'pix', label: 'Detector Pix', icon: Wallet },
    { id: 'housing', label: 'Transição Centro (Caixa)', icon: Building2 },
    { id: 'investments', label: 'Investimentos & Ativos', icon: TrendingUp },
  ];

  const months = [
    { value: '2026-05', label: 'Maio 2026' },
    { value: '2026-06', label: 'Junho 2026' },
    { value: '2026-07', label: 'Julho 2026' },
    { value: '2026-08', label: 'Agosto 2026' },
    { value: '2026-09', label: 'Setembro 2026' },
    { value: '2026-10', label: 'Outubro 2026 (Atual)' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-gray-800 shadow-xl">
      {/* Top Banner: Branding + Quick KPIs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & Context */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Mobills<span className="text-emerald-400">Pro</span>
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Produção PWA
              </span>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <span>Alexandre & Amanda</span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center text-gray-400">
                <MapPin className="w-3 h-3 text-emerald-500 inline mr-0.5" /> Muriaé/MG
              </span>
            </p>
          </div>
        </div>

        {/* Center / Right: Quick Magic Number pill + Month Selector + Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Quick Magic Number Pill */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer group flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-gray-900 border border-emerald-500/30 hover:border-emerald-400/60 transition shadow-inner"
            title="Número Mágico: Saldo Livre Mensal recalculado em tempo real"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider leading-none">
                Número Mágico
              </span>
              <span className="text-sm font-extrabold text-emerald-300 font-mono">
                {magicNumber !== undefined ? formatBRL(magicNumber) : 'Calculando...'}
              </span>
            </div>
          </div>

          {/* Month Selector */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-gray-900/90 text-xs font-semibold text-gray-200 border border-gray-700/80 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-emerald-500 transition appearance-none cursor-pointer"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value} className="bg-gray-900 text-gray-200">
                  {m.label}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <SlidersHorizontal className="w-3 h-3" />
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-emerald-400 transition"
            title="Atualizar dados em tempo real"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Mobile horizontal scrollable) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 sm:space-x-2 py-1.5 min-w-max">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 border border-emerald-400/40'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
