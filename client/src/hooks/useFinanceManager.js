import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const API_BASE = '/api';

// Cache keys matching the architectural recommendations
export const STORAGE_KEYS = {
  SUMMARY: '@MobillsPro:summary',
  CARTOES: '@MobillsPro:cartoes',
  FATURAS: '@MobillsPro:faturas',
  FIXAS: '@MobillsPro:fixas',
  METAS: '@MobillsPro:metas',
  PIX: '@MobillsPro:pix',
  RECEITAS: '@MobillsPro:receitas',
  INVESTIMENTOS: '@MobillsPro:investimentos'
};

export function useFinanceManager(selectedMonth, period, excludeAtypical, useNewApartment) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local storage state with cache fallback
  const [summaryData, setSummaryData] = useLocalStorage(STORAGE_KEYS.SUMMARY, null);
  const [fixedExpensesData, setFixedExpensesData] = useLocalStorage(STORAGE_KEYS.FIXAS, []);
  const [cardsAuditData, setCardsAuditData] = useLocalStorage(STORAGE_KEYS.FATURAS, null);
  const [detailedCardsData, setDetailedCardsData] = useLocalStorage(STORAGE_KEYS.CARTOES, []);
  const [budgetsData, setBudgetsData] = useLocalStorage(STORAGE_KEYS.METAS, []);
  const [pixData, setPixData] = useLocalStorage(STORAGE_KEYS.PIX, null);
  const [incomesData, setIncomesData] = useLocalStorage(STORAGE_KEYS.RECEITAS, []);
  const [investmentsData, setInvestmentsData] = useLocalStorage(STORAGE_KEYS.INVESTIMENTOS, null);
  
  const [housingData, setHousingData] = useState(null);
  const [wellhubData, setWellhubData] = useState(null);
  const [smsHistoryData, setSmsHistoryData] = useState([]);

  // Fetch all data from API and sync to LocalStorage
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const summaryRes = await fetch(
        `${API_BASE}/dashboard/summary?month=${selectedMonth}&period=${period}&excludeAtypical=${excludeAtypical}&useNewApartment=${useNewApartment}`
      );
      if (summaryRes.ok) {
        const summaryJson = await summaryRes.json();
        setSummaryData(summaryJson);
      }

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

      if (fixedRes.ok) {
        const data = await fixedRes.json();
        setFixedExpensesData(data.expenses || []);
      }
      if (cardsAuditRes.ok) setCardsAuditData(await cardsAuditRes.json());
      if (cardsDetailedRes.ok) setDetailedCardsData(await cardsDetailedRes.json());
      if (budgetsRes.ok) setBudgetsData(await budgetsRes.json());
      if (pixRes.ok) setPixData(await pixRes.json());
      if (housingRes.ok) setHousingData(await housingRes.json());
      if (investRes.ok) setInvestmentsData(await investRes.json());
      if (wellhubRes.ok) setWellhubData(await wellhubRes.json());
      if (incomesRes.ok) setIncomesData(await incomesRes.json());
      if (smsHistoryRes.ok) setSmsHistoryData(await smsHistoryRes.json());

    } catch (err) {
      console.warn('[useFinanceManager] Falha ao sincronizar com backend. Operando com cache local:', err);
      setError('Modo Offline: Operando com dados locais em cache (@MobillsPro).');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, period, excludeAtypical, useNewApartment, setSummaryData, setFixedExpensesData, setCardsAuditData, setDetailedCardsData, setBudgetsData, setPixData, setIncomesData, setInvestmentsData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Mutations
  const toggleFixedExpense = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/fixed-expenses/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) refreshData();
    } catch (err) {
      console.error('Erro ao alternar despesa fixa:', err);
    }
  };

  const deleteFixedExpense = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/fixed-expenses/${id}`, { method: 'DELETE' });
      if (res.ok) refreshData();
    } catch (err) {
      console.error('Erro ao excluir despesa fixa:', err);
    }
  };

  const toggleAtypicalTransaction = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/cards/transactions/${id}/toggle-atypical`, { method: 'PATCH' });
      if (res.ok) refreshData();
    } catch (err) {
      console.error('Erro ao alternar atípico:', err);
    }
  };

  const deleteCardTransaction = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/cards/transactions/${id}`, { method: 'DELETE' });
      if (res.ok) refreshData();
    } catch (err) {
      console.error('Erro ao excluir transação de cartão:', err);
    }
  };

  const updateCreditCard = async (id, payload) => {
    try {
      const res = await fetch(`${API_BASE}/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) refreshData();
    } catch (err) {
      console.error('Erro ao atualizar dados do cartão:', err);
    }
  };

  const deletePixTransaction = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/pix/${id}`, { method: 'DELETE' });
      if (res.ok) refreshData();
    } catch (err) {
      console.error('Erro ao excluir Pix:', err);
    }
  };

  const updateBudget = async (id, payload) => {
    try {
      const res = await fetch(`${API_BASE}/budgets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) refreshData();
    } catch (err) {
      console.error('Erro ao atualizar meta:', err);
    }
  };

  const deleteBudget = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/budgets/${id}`, { method: 'DELETE' });
      if (res.ok) refreshData();
    } catch (err) {
      console.error('Erro ao excluir meta:', err);
    }
  };

  const deleteIncome = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/incomes/${id}`, { method: 'DELETE' });
      if (res.ok) refreshData();
    } catch (err) {
      console.error('Erro ao excluir receita:', err);
    }
  };

  const resetSystem = async () => {
    if (window.confirm('Deseja recarregar a base de dados oficial pré-carregada do MobillsPro?')) {
      try {
        await fetch('/api/v1/reset', { method: 'POST' });
        await fetch(`${API_BASE}/system/reset`, { method: 'POST' }).catch(() => {});
        refreshData();
      } catch (err) {
        console.error('Erro no reset:', err);
      }
    }
  };

  return {
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
    // Actions
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
  };
}
