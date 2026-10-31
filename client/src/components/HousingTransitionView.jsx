import React, { useState } from 'react';
import { 
  Building2, 
  Car, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Footprints, 
  Home, 
  Landmark, 
  ShieldCheck, 
  DollarSign, 
  ArrowRight,
  Sliders
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function HousingTransitionView({ 
  simulationData, 
  useNewApartment, 
  setUseNewApartment 
}) {
  const [interactiveYears, setInteractiveYears] = useState(5); // 1 to 30 years SAC curve
  const [selectedStrategy, setSelectedStrategy] = useState('opt-1');

  if (!simulationData) {
    return <div className="p-8 text-center text-gray-400">Carregando simulador habitacional Caixa SBPE...</div>;
  }

  const { current, newCenterApartment } = simulationData;

  // SAC Amortization calculation
  // First installment: 3231.32, decreasing by ~9.85/month
  const monthsElapsed = interactiveYears * 12;
  const projectedInstallment = Math.max(850, Number((newCenterApartment.caixaSacFirstInstallment - (monthsElapsed * newCenterApartment.caixaSacAmortizationPerMonth)).toFixed(2)));
  const reductionAmount = Number((newCenterApartment.caixaSacFirstInstallment - projectedInstallment).toFixed(2));

  // Net difference calculation
  // Current: Rent 810.50 + Land 1343.26 + Fuel 480 = 2633.76
  const currentTotal = current.rentShare + current.landShare + current.fuelCost;
  // New Center: Caixa SAC 3231.32 + Condo 250 + New Fuel 120 = 3601.32
  const newTotal = newCenterApartment.caixaSacFirstInstallment + newCenterApartment.condoShare + newCenterApartment.newFuel;
  const netDelta = newTotal - currentTotal; // + 967.56

  return (
    <div className="space-y-6">
      
      {/* HEADER HERO */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Planejamento Imobiliário Caixa SBPE (SAC)
              </span>
              <span className="text-xs text-gray-400">Centro de Muriaé/MG</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Transição para o Apartamento no Centro
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1 leading-relaxed">
              Simulação financeira completa: troca do aluguel atual e terreno pelo financiamento Caixa SAC 
              no Centro, integrando a drástica economia de combustível de fazer tudo a pé.
            </p>
          </div>

          {/* Toggle Button: Apply to Magic Number */}
          <div className="bg-gray-900/90 border border-blue-500/40 rounded-2xl p-4 flex flex-col justify-between min-w-[280px]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  Ativar no Balanço Geral
                </span>
                <span className="text-[11px] text-gray-400">
                  Aplica impacto no Número Mágico
                </span>
              </div>
              <button
                type="button"
                onClick={() => setUseNewApartment(!useNewApartment)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  useNewApartment ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    useNewApartment ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-800 text-[11px] text-blue-300 font-mono">
              {useNewApartment ? '✓ Cenário Centro ativo no Saldo Livre' : '• Moradia Atual em vigor'}
            </div>
          </div>
        </div>
      </div>

      {/* COMPARATIVO LADO A LADO: MORADIA ATUAL VS APTO NO CENTRO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Lado Esquerdo: Moradia Atual (Bairro) */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-gray-400" />
              <h3 className="text-base font-bold text-white">1. Moradia Atual (Bairro)</h3>
            </div>
            <span className="text-xs font-mono font-bold text-gray-400 bg-gray-800 px-2.5 py-1 rounded-lg">
              {formatBRL(currentTotal)}/mês
            </span>
          </div>

          <p className="text-xs text-gray-400">
            Custo composto por aluguel transitório, parcela do terreno e elevado custo de transporte:
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-white block">Aluguel da Moradia (Metade Alexandre)</span>
                <span className="text-[11px] text-gray-400">Total do contrato: R$ 1.621,00</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">R$ 810,50</span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-white block">Prestação do Terreno (Metade Alexandre)</span>
                <span className="text-[11px] text-gray-400">Total da parcela: R$ 2.686,52</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">R$ 1.343,26</span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-rose-500/30 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-rose-300 block flex items-center gap-1.5">
                  <Car className="w-4 h-4" /> Combustível / Deslocamento Elevado
                </span>
                <span className="text-[11px] text-gray-400">Carro e moto diários para comércio e Centro</span>
              </div>
              <span className="text-sm font-bold text-rose-300 font-mono">R$ 480,00</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-900 text-xs text-gray-400 border border-gray-800">
            <strong>Limitação:</strong> O aluguel não gera patrimônio próprio, e o deslocamento consome tempo 
            e combustível contínuo nas subidas e descidas de Muriaé.
          </div>
        </div>

        {/* Lado Direito: Apartamento Novo no Centro (Caixa SBPE SAC) */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl border border-blue-500/40 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">2. Apartamento Novo no Centro (Caixa SAC)</h3>
            </div>
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-500/30 px-2.5 py-1 rounded-lg">
              {formatBRL(newTotal)}/mês
            </span>
          </div>

          <p className="text-xs text-blue-300/90">
            Aquisição definitiva via Caixa Econômica com parcelas decrescentes e redução logística:
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-blue-500/30 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-white block">Financiamento Caixa SAC (1ª Parcela)</span>
                <span className="text-[11px] text-gray-400">Sistema de Amortização Constante (Decrescente)</span>
              </div>
              <span className="text-sm font-bold text-blue-400 font-mono">R$ 3.231,32</span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-white block">Condomínio Centro (Metade Alexandre)</span>
                <span className="text-[11px] text-gray-400">Portaria, elevador e segurança central</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">R$ 250,00</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-emerald-400 block flex items-center gap-1.5">
                  <Footprints className="w-4 h-4" /> Economia Drástica Rodando a Pé
                </span>
                <span className="text-[11px] text-emerald-300">Supermercados BH, farmácias, padarias e trabalho a pé</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-emerald-400 font-mono block">R$ 120,00</span>
                <span className="text-[10px] text-emerald-500 uppercase font-bold">Economia: -R$ 360,00</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/20 text-xs text-emerald-300 border border-emerald-500/30">
            <strong>Diferencial Líquido:</strong> O incremento financeiro real para morar no Centro de Muriaé é de 
            apenas <strong>+{formatBRL(netDelta)}/mês</strong>, amplamente absorvido pelo Salário Líquido (R$ 11.096,21).
          </div>
        </div>

      </div>

      {/* CURVA INTERATIVA DE AMORTIZAÇÃO CAIXA SAC */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              Evolução da Parcela SAC da Caixa (Decrescimento Contínuo)
            </h3>
            <p className="text-xs text-gray-400">
              No sistema SAC, a amortização mensal é fixa e os juros caem todo mês (~R$ 9,85/mês de alívio).
            </p>
          </div>

          {/* Year Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-semibold">Simular após:</span>
            <span className="text-sm font-bold text-emerald-400 font-mono bg-gray-900 border border-gray-700 px-3 py-1 rounded-xl">
              {interactiveYears} anos ({monthsElapsed} meses)
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="range"
            min="1"
            max="20"
            value={interactiveYears}
            onChange={(e) => setInteractiveYears(Number(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 text-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                1ª Parcela (Inicial)
              </span>
              <span className="text-xl font-bold text-blue-400 font-mono mt-1 block">
                {formatBRL(newCenterApartment.caixaSacFirstInstallment)}
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5 block">Mês 1 (Pico)</span>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/90 border border-emerald-500/30 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                Parcela em {interactiveYears} Anos
              </span>
              <span className="text-xl font-bold text-emerald-300 font-mono mt-1 block">
                {formatBRL(projectedInstallment)}
              </span>
              <span className="text-[10px] text-emerald-500 mt-0.5 block">Queda de {formatBRL(reductionAmount)}</span>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 text-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Alívio Mensal na Parcela
              </span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">
                -{formatBRL(newCenterApartment.caixaSacAmortizationPerMonth * 12)}/ano
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5 block">~R$ 9,85 todo mês</span>
            </div>
          </div>
        </div>
      </div>

      {/* ESTRATÉGIAS PARA O TERRENO RESIDENCIAL */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Landmark className="w-5 h-5 text-amber-400" />
          Estratégia Patrimonial para o Terreno de Muriaé
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {newCenterApartment.landStrategyOptions.map((opt) => {
            const isSelected = selectedStrategy === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedStrategy(opt.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-amber-950/20 border-amber-500/50 shadow-md'
                    : 'bg-gray-900/80 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-white">{opt.name}</h4>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
