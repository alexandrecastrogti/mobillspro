import React, { useState } from 'react';
import { 
  Building2, 
  Car, 
  TrendingDown, 
  CheckCircle2, 
  Footprints, 
  Home, 
  Landmark
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function HousingTransitionView({ 
  simulationData, 
  useNewApartment, 
  setUseNewApartment 
}) {
  const [interactiveYears, setInteractiveYears] = useState(5);
  const [selectedStrategy, setSelectedStrategy] = useState('opt-1');

  if (!simulationData) {
    return <div className="p-8 text-center text-slate-500 dark:text-zinc-400 font-mono text-xs">Carregando simulador habitacional Caixa SBPE...</div>;
  }

  const { current, newCenterApartment } = simulationData;

  const monthsElapsed = interactiveYears * 12;
  const projectedInstallment = Math.max(850, Number((newCenterApartment.caixaSacFirstInstallment - (monthsElapsed * newCenterApartment.caixaSacAmortizationPerMonth)).toFixed(2)));
  const reductionAmount = Number((newCenterApartment.caixaSacFirstInstallment - projectedInstallment).toFixed(2));

  const currentTotal = 810.50 + 1343.26 + 480.00; // = 2633.76
  const newTotal = 3231.32 + 250.00 + 90.00; // = 3571.32
  const netDelta = newTotal - currentTotal; // = 937.56

  return (
    <div className="space-y-6">
      
      {/* HEADER HERO */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/50 flex items-center gap-1.5">
                <Building2 className="w-3 h-3" />
                TRANSIÇÃO HABITACIONAL CAIXA SBPE (SAC)
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">CENTRO DE MURIAÉ/MG</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Transição para o Apartamento no Centro
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              Simulação financeira: troca do aluguel atual e terreno pelo financiamento Caixa SAC 
              no Centro, integrando a drástica economia de combustível de fazer tudo a pé.
            </p>
          </div>

          {/* Toggle Button: Apply to Magic Number */}
          <div className="bg-slate-50 dark:bg-[#12151D] border border-slate-200 dark:border-[#222838] rounded-xl p-3 flex flex-col justify-between min-w-[270px]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-semibold text-slate-900 dark:text-zinc-200 block">
                  Ativar no Balanço Geral
                </span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
                  Impacto no Número Mágico
                </span>
              </div>
              <button
                type="button"
                onClick={() => setUseNewApartment(!useNewApartment)}
                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out ${
                  useNewApartment ? 'bg-sky-600' : 'bg-slate-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    useNewApartment ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-[#1F232D] text-[10px] text-sky-700 dark:text-sky-400 font-mono font-semibold">
              {useNewApartment ? '✓ Cenário Centro ativo no Saldo Livre' : '• Moradia Atual em vigor'}
            </div>
          </div>
        </div>
      </div>

      {/* COMPARATIVO LADO A LADO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Lado Esquerdo: Moradia Atual */}
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F232D]">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">1. Moradia Atual (Bairro)</h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-400 bg-slate-100 dark:bg-[#10131A] px-2.5 py-0.5 rounded border border-slate-200 dark:border-[#1F232D]">
              {formatBRL(currentTotal)}/mês
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-zinc-400">
            Custo composto por aluguel transitório, parcela do terreno e elevado custo de transporte:
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-200 block">Aluguel da Moradia (Metade Alexandre)</span>
                <span className="text-[10px] text-slate-500">Contrato: R$ 1.621,00 (50/50)</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 tabular-nums">R$ 810,50</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-200 block">Prestação do Terreno (Metade Alexandre)</span>
                <span className="text-[10px] text-slate-500">Parcela: R$ 2.686,52 (50/50)</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 tabular-nums">R$ 1.343,26</span>
            </div>

            <div className="p-3 rounded-lg bg-rose-50/60 dark:bg-[#12141B] border border-rose-200 dark:border-rose-900/40 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Combustível / Deslocamento
                </span>
                <span className="text-[10px] text-rose-600/80 dark:text-zinc-500">Deslocamento diário de subidas/descidas</span>
              </div>
              <span className="text-sm font-bold text-rose-800 dark:text-rose-300 tabular-nums">R$ 480,00</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#10131A] text-[11px] text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-[#1F232D] font-mono">
            <strong>Limitação:</strong> O aluguel não gera patrimônio próprio, e o deslocamento consome combustível contínuo em Muriaé.
          </div>
        </div>

        {/* Lado Direito: Apartamento Novo no Centro */}
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F232D]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">2. Apartamento Centro (Caixa SAC)</h3>
            </div>
            <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 border border-sky-200 dark:text-sky-400 dark:bg-sky-950/60 dark:border-sky-800/40 px-2.5 py-0.5 rounded">
              {formatBRL(newTotal)}/mês
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-zinc-400">
            Aquisição definitiva via Caixa Econômica com parcelas decrescentes e redução logística:
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-200 block">Financiamento Caixa SAC (1ª Parcela)</span>
                <span className="text-[10px] text-slate-500">Amortização Constante (Decrescente)</span>
              </div>
              <span className="text-sm font-bold text-sky-700 dark:text-sky-400 tabular-nums">R$ 3.231,32</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-200 block">Condomínio Centro (Metade Alexandre)</span>
                <span className="text-[10px] text-slate-500">Portaria, elevador e segurança central</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 tabular-nums">R$ 250,00</span>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-[#12141B] border border-emerald-200 dark:border-emerald-900/40 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 block flex items-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5 text-emerald-600" /> Economia Drástica a Pé
                </span>
                <span className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80">Supermercados BH, farmácias e trabalho a pé</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-400 tabular-nums block">R$ 90,00</span>
                <span className="text-[9px] text-emerald-700 uppercase font-semibold">Economia: -R$ 390,00</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-sky-50/60 dark:bg-[#10131A] text-[11px] text-slate-700 dark:text-zinc-300 border border-sky-100 dark:border-[#1F232D] font-mono">
            <strong>Diferencial Líquido:</strong> O incremento financeiro real para morar no Centro é de 
            apenas <strong>+{formatBRL(netDelta)}/mês</strong>, absorvido com segurança pelo Salário Líquido (R$ 11.096,21).
          </div>
        </div>

      </div>

      {/* CURVA INTERATIVA DE AMORTIZAÇÃO CAIXA SAC */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#1F232D]">
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              EVOLUÇÃO DA PARCELA SAC (DECRESCIMENTO CONTÍNUO)
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              No sistema SAC, a amortização mensal é fixa e os juros caem todo mês (~R$ 9,85/mês de alívio contínuo).
            </p>
          </div>

          {/* Year Slider */}
          <div className="flex items-center gap-2 font-mono">
            <span className="text-xs text-slate-500">Após:</span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-[#12151D] border border-emerald-200 dark:border-[#222838] px-2.5 py-1 rounded-lg">
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
            className="w-full h-2 bg-slate-200 dark:bg-[#1F232D] rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 font-mono">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] text-center">
              <span className="text-[9px] uppercase font-semibold text-slate-500 block">
                1ª Parcela (Inicial)
              </span>
              <span className="text-base font-bold text-sky-700 dark:text-sky-400 tabular-nums mt-0.5 block">
                {formatBRL(newCenterApartment.caixaSacFirstInstallment)}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Mês 1 (Pico)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-[#12141B] border border-emerald-200 dark:border-[#1F232D] text-center">
              <span className="text-[9px] uppercase font-semibold text-emerald-700 dark:text-emerald-400 block">
                Parcela em {interactiveYears} Anos
              </span>
              <span className="text-base font-bold text-emerald-800 dark:text-emerald-300 tabular-nums mt-0.5 block">
                {formatBRL(projectedInstallment)}
              </span>
              <span className="text-[10px] text-emerald-700 mt-0.5 block font-semibold">Queda de {formatBRL(reductionAmount)}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] text-center">
              <span className="text-[9px] uppercase font-semibold text-slate-500 block">
                Alívio na Parcela
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-zinc-100 tabular-nums mt-0.5 block">
                -{formatBRL(newCenterApartment.caixaSacAmortizationPerMonth * 12)}/ano
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">~R$ 9,85 todo mês</span>
            </div>
          </div>
        </div>
      </div>

      {/* ESTRATÉGIAS PARA O TERRENO RESIDENCIAL */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-3 shadow-sm">
        <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide flex items-center gap-2">
          <Landmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          ESTRATÉGIA PATRIMONIAL PARA O TERRENO DE MURIAÉ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {newCenterApartment.landStrategyOptions.map((opt) => {
            const isSelected = selectedStrategy === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedStrategy(opt.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-amber-50/60 border-amber-400 text-slate-900 dark:bg-[#181C26] dark:border-amber-600/60 dark:text-zinc-100'
                    : 'bg-slate-50 dark:bg-[#12141B] border-slate-200 dark:border-[#1F232D] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold">{opt.name}</h4>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
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
