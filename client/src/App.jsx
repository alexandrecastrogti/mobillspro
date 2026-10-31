import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DivisionIncomesView } from './components/DivisionIncomesView';
import { FixedExpensesChecklist } from './components/FixedExpensesChecklist';
import { CardsAuditView } from './components/CardsAuditView';
import { PixDetectorView } from './components/PixDetectorView';
import { HousingTransitionView } from './components/HousingTransitionView';
import { InvestmentsView } from './components/InvestmentsView';
import { BudgetsMetasView } from './components/BudgetsMetasView';
import { CreditCardsAdvancedView } from './components/CreditCardsAdvancedView';
import { IPhoneCaptureEngineView } from './components/IPhoneCaptureEngineView';
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
  Smartphone
} from 'lucide-react';

const API_BASE = '/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [period, setPeriod] = useState('CURRENT_MONTH');
  const [excludeAtypical, setExcludeAtypical] = useState(true);
  const [useNewApartment, setUseNewApartment] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Data States
  const [summaryData, setSummaryData] = useState(null);
  const [fixedExpensesData, setFixedExpensesData] = useState([]);
  const [cardsAuditData, setCardsAuditData] = useState(null);
  const [detailedCardsData, setDetailedCardsData] = useState([]);
  const [budgetsData, setBudgetsData] = useState([]);
  const [pixData, setPixData] = useState(null);
  const [housingData, setHousingData] = useState(null);
  const [investmentsData, setInvestmentsData] = useState(null);
  const [wellhubData, setWellhubData] = useState(null);
  const [incomesData, setIncomesData] = useState([]);
  const [smsHistoryData, setSmsHistoryData] = useState([]);

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch summary with query params
      const summaryRes = await fetch(
        `${API_BASE}/dashboard/summary?month=${selectedMonth}&period=${period}&excludeAtypical=${excludeAtypical}&useNewApartment=${useNewApartment}`
      );
      const summaryJson = await summaryRes.json();
      setSummaryData(summaryJson);

      // Parallel fetch for specific modules
      const [
        fixedRes,
        cardsAuditRes,
        cardsDetailedRes,
        budgetsRes,
        pixRes,
        housingRes,
        investRes,
        wellhubRes,
        incomesRes,
        smsHistoryRes
      ] = await Promise.all([
        fetch(`${API_BASE}/fixed-expenses?month=${selectedMonth}`),
        fetch(`${API_BASE}/cards/audit`),
        fetch(`${API_BASE}/cards/detailed`),
        fetch(`${API_BASE}/budgets`),
        fetch(`${API_BASE}/pix?month=${selectedMonth}`),
        fetch(`${API_BASE}/housing/simulation`),
        fetch(`${API_BASE}/investments`),
        fetch(`${API_BASE}/wellhub?month=${selectedMonth}`),
        fetch(`${API_BASE}/incomes?month=${selectedMonth}`),
        fetch(`${API_BASE}/sms/history`)
      ]);

      const [
        fixedJson,
        cardsAuditJson,
        cardsDetailedJson,
        budgetsJson,
        pixJson,
        housingJson,
        investJson,
        wellhubJson,
        incomesJson,
        smsHistoryJson
      ] = await Promise.all([
        fixedRes.json(),
        cardsAuditRes.json(),
        cardsDetailedRes.json(),
        budgetsRes.json(),
        pixRes.json(),
        housingRes.json(),
        investRes.json(),
        wellhubRes.json(),
        incomesRes.json(),
        smsHistoryRes.json()
      ]);

      setFixedExpensesData(fixedJson.expenses || []);
      setCardsAuditData(cardsAuditJson);
      setDetailedCardsData(cardsDetailedJson || []);
      setBudgetsData(budgetsJson || []);
      setPixData(pixJson);
      setHousingData(housingJson);
      setInvestmentsData(investJson);
      setWellhubData(wellhubJson);
      setIncomesData(incomesJson);
      setSmsHistoryData(smsHistoryJson || []);
    } catch (err) {
      console.error('Erro ao carregar dados do MobillsPro:', err);
      setError('Não foi possível conectar ao servidor. Verifique se o backend está em execução.');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, period, excludeAtypical, useNewApartment]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle Fixed Expense Status (Pago / Pendente)
  const handleToggleFixedExpense = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/fixed-expenses/${id}/toggle`, {
        method: 'PATCH'
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Erro ao alternar status da despesa:', err);
    }
  };

  // Toggle Atypical Card Transaction
  const handleToggleAtypicalTransaction = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/cards/transactions/${id}/toggle-atypical`, {
        method: 'PATCH'
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Erro ao alternar atípico:', err);
    }
  };

  // Update Budget (Meta)
  const handleUpdateBudget = async (id, payload) => {
    try {
      const res = await fetch(`${API_BASE}/budgets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Erro ao atualizar meta orçamentária:', err);
    }
  };

  // Update Investment
  const handleUpdateInvestment = async (id, payload) => {
    try {
      const res = await fetch(`${API_BASE}/investments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Erro ao atualizar investimento:', err);
    }
  };

  // Reset to initial seed
  const handleResetSystem = async () => {
    if (window.confirm('Deseja recarregar a base de dados padrão pré-carregada do MobillsPro?')) {
      try {
        await fetch(`${API_BASE}/system/reset`, { method: 'POST' });
        fetchData();
      } catch (err) {
        console.error('Erro no reset:', err);
      }
    }
  };

  const magicNumber = summaryData?.balance?.magicNumber;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans pb-16 md:pb-0">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        magicNumber={magicNumber}
        onRefresh={fetchData}
        loading={loading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchData}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs"
            >
              Tentar Novamente
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
            onToggleFixedExpense={handleToggleFixedExpense}
            period={period}
            setPeriod={setPeriod}
            fixedExpenses={fixedExpensesData}
            cardTransactions={cardsAuditData?.transactions}
          />
        )}

        {/* Tab 2: Metas & Orçamento por Centro de Custo (Padrão Mobills) */}
        {activeTab === 'budgets' && (
          <BudgetsMetasView
            budgetsData={budgetsData}
            onUpdateBudget={handleUpdateBudget}
          />
        )}

        {/* Tab 3: Gestão Avançada de Cartões & Faturas */}
        {activeTab === 'cards-advanced' && (
          <CreditCardsAdvancedView
            cardsData={detailedCardsData}
          />
        )}

        {/* Tab 4: Divisão 50/50 & Receitas */}
        {activeTab === 'incomes' && (
          <DivisionIncomesView
            wellhubData={wellhubData}
            incomesData={incomesData}
            fixedExpensesData={fixedExpensesData}
          />
        )}

        {/* Tab 5: Checklist Despesas Fixas */}
        {activeTab === 'checklist' && (
          <FixedExpensesChecklist
            expenses={fixedExpensesData}
            onToggleStatus={handleToggleFixedExpense}
            selectedMonth={selectedMonth}
          />
        )}

        {/* Tab 6: Auditoria 6 Meses de Cartões & Supermercados */}
        {activeTab === 'cards' && (
          <CardsAuditView
            auditData={cardsAuditData}
            excludeAtypical={excludeAtypical}
            setExcludeAtypical={setExcludeAtypical}
            onToggleAtypicalTransaction={handleToggleAtypicalTransaction}
          />
        )}

        {/* Tab 7: Detector Pix */}
        {activeTab === 'pix' && (
          <PixDetectorView
            pixData={pixData}
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
            onUpdateInvestment={handleUpdateInvestment}
          />
        )}

        {/* Tab 10: Motor de Captura Push/SMS iPhone 17 Pro Max */}
        {activeTab === 'iphone' && (
          <IPhoneCaptureEngineView
            smsHistory={smsHistoryData}
            onCaptureSms={fetchData}
          />
        )}

      </main>

      {/* Footer / System Status */}
      <footer className="mt-auto border-t border-gray-900 bg-[#070A11] py-4 px-4 sm:px-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>MobillsPro v2.0 Web Elite • Muriaé/MG</span>
            <span>•</span>
            <span className="text-gray-400">Alexandre & Amanda</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetSystem}
              className="text-gray-500 hover:text-emerald-400 flex items-center gap-1 transition"
              title="Recarrega a base original com as regras de negócio pré-carregadas"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Resetar Dados Padrão
            </button>
            <span>•</span>
            <span className="text-emerald-400 font-mono">
              iPhone 17 Pro Max Push Ready & PWA
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0F19]/95 backdrop-blur-lg border-t border-gray-800 px-2 py-1 flex justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-1.5 text-[10px] font-semibold ${
            activeTab === 'dashboard' ? 'text-emerald-400' : 'text-gray-400'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          Balanço
        </button>
        <button
          onClick={() => setActiveTab('budgets')}
          className={`flex flex-col items-center py-1 px-1.5 text-[10px] font-semibold ${
            activeTab === 'budgets' ? 'text-emerald-400' : 'text-gray-400'
          }`}
        >
          <Target className="w-4 h-4 mb-0.5" />
          Metas
        </button>
        <button
          onClick={() => setActiveTab('cards-advanced')}
          className={`flex flex-col items-center py-1 px-1.5 text-[10px] font-semibold ${
            activeTab === 'cards-advanced' ? 'text-emerald-400' : 'text-gray-400'
          }`}
        >
          <CreditCard className="w-4 h-4 mb-0.5" />
          Faturas
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex flex-col items-center py-1 px-1.5 text-[10px] font-semibold ${
            activeTab === 'checklist' ? 'text-emerald-400' : 'text-gray-400'
          }`}
        >
          <CheckSquare className="w-4 h-4 mb-0.5" />
          Fixas
        </button>
        <button
          onClick={() => setActiveTab('iphone')}
          className={`flex flex-col items-center py-1 px-1.5 text-[10px] font-semibold ${
            activeTab === 'iphone' ? 'text-sky-400' : 'text-gray-400'
          }`}
        >
          <Smartphone className="w-4 h-4 mb-0.5" />
          iPhone
        </button>
      </nav>

    </div>
  );
}
