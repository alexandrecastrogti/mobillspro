import React, { useState } from 'react';
import {
  Smartphone,
  Zap,
  Send,
  CheckCircle2,
  Code2,
  Copy,
  Clock
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function IPhoneCaptureEngineView({ smsHistory, onCaptureSms }) {
  const [inputText, setInputText] = useState('');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [lastSuccess, setLastSuccess] = useState(null);

  const webhookUrl = 'http://localhost:3001/api/shortcuts/webhook';

  const quickSamples = [
    {
      title: "Bahamas Mix Muriaé (Nubank)",
      text: "Compra de R$ 142,50 aprovada no Nubank em BAHAMAS MIX MURIAE"
    },
    {
      title: "Posto Faisão Muriaé (Bradesco)",
      text: "Bradesco Cartoes: Compra aprovada de R$ 240,00 no POSTO FAISAO MURIAE em 31/10 as 14:20."
    },
    {
      title: "Supermercados BH Centro (Pix)",
      text: "Pix enviado com sucesso! R$ 90,00 para SUPERMERCADOS BH CENTRO."
    },
    {
      title: "Top Frut Gourmet Muriaé (Nubank)",
      text: "Compra de R$ 68,90 aprovada no Nubank em TOP FRUT GOURMET MURIAE"
    }
  ];

  const handleSimulate = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text) return;

    try {
      setSimulating(true);
      const res = await fetch('/api/sms/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          source: 'iPhone 17 Pro Max Push Simulator'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setLastSuccess(data);
        setInputText('');
        if (onCaptureSms) onCaptureSms();
      }
    } catch (err) {
      console.error('Erro na simulação de push:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="space-y-6">

      {/* HEADER HERO */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/50 flex items-center gap-1.5">
                <Smartphone className="w-3 h-3" />
                MOTOR IOS PUSH & SMS (IPHONE 17 PRO MAX)
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">APPLE SHORTCUTS • MURIAÉ/MG</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Captura Automática de Transações por Notificação
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              Leitura inteligente de SMS e push bancários (Nubank, Bradesco, Pix, Mercado Pago)
              via Apple Shortcuts e persistência autônoma sem intervenção manual.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-[#12151D] border border-slate-200 dark:border-[#222838] rounded-xl p-3 text-center min-w-[220px] font-mono">
            <span className="text-[9px] font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">
              Dispositivo Vinculado
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-0.5 block">
              iPhone 17 Pro Max
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 block flex items-center justify-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" /> Webhook Ativo
            </span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: Simulador de Push vs Guia de Configuração Apple Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Simulador Interativo */}
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F232D]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">Simulador de Notificação Push / SMS</h3>
            </div>
            <span className="text-[10px] uppercase font-mono font-semibold text-sky-700 bg-sky-50 border border-sky-200 dark:text-sky-300 dark:bg-sky-950/60 dark:border-sky-800/40 px-2 py-0.5 rounded">
              Tempo Real
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-zinc-400">
            Digite ou cole o texto de um SMS ou notificação push para testar o parser regex e o lançamento:
          </p>

          <div className="space-y-2.5">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ex: Compra de R$ 142,50 aprovada no Nubank em BAHAMAS MIX MURIAE..."
              className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg p-3 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 transition font-mono outline-none"
            />

            <button
              onClick={() => handleSimulate()}
              disabled={simulating || !inputText}
              className="w-full py-2 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono font-semibold text-xs flex items-center justify-center gap-2 transition disabled:opacity-40 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              {simulating ? 'Processando Captura...' : 'Simular Captura no iPhone'}
            </button>
          </div>

          {/* Quick Clickable Samples */}
          <div className="pt-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Exemplos de Muriaé/MG:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickSamples.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulate(sample.text)}
                  className="text-left p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#12141B] dark:hover:bg-[#1A1E29] border border-slate-200 dark:border-[#1F232D] text-xs text-slate-700 dark:text-zinc-300 transition cursor-pointer"
                >
                  <span className="font-bold text-slate-900 dark:text-zinc-100 block truncate">{sample.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono truncate block mt-0.5">{sample.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Card on Success */}
          {lastSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-[#141C26] border border-emerald-200 dark:border-[#243447] text-xs font-mono text-emerald-800 dark:text-emerald-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Transação Capturada e Sincronizada!
              </div>
              <div className="text-[11px] text-slate-700 dark:text-zinc-300 pl-5">
                Valor: <strong className="tabular-nums">{formatBRL(lastSuccess.parsedAmount)}</strong> • Estabelecimento: <strong>{lastSuccess.parsedMerchant}</strong> • Cartão: <strong>{lastSuccess.detectedCard}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Guia de Configuração Apple Shortcuts */}
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F232D]">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">Configuração no Apple Shortcuts</h3>
            </div>
            <span className="text-[10px] uppercase font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/60 dark:border-emerald-800/40 px-2 py-0.5 rounded">
              iOS 20
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Para ativar a captura 100% autônoma no <strong>iPhone 17 Pro Max</strong>:
          </p>

          <ol className="space-y-1.5 text-xs text-slate-700 dark:text-zinc-300 list-decimal list-inside leading-relaxed font-mono">
            <li>Abra o aplicativo <strong>Atalhos (Shortcuts)</strong> no iPhone.</li>
            <li>Toque na aba <strong>Automação</strong> e crie uma <strong>Automação Pessoal</strong>.</li>
            <li>Gatilho: <strong>"Mensagem" (contendo "compra" ou "aprovada")</strong>.</li>
            <li>Ação: <strong>"Obter Conteúdo do URL" (Método POST)</strong>.</li>
            <li>Cole o Webhook abaixo e defina o corpo com o texto da mensagem.</li>
          </ol>

          {/* Webhook copy box */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-[#262B37] flex items-center justify-between gap-3 font-mono">
            <span className="text-xs text-emerald-700 dark:text-emerald-400 truncate font-semibold">
              {webhookUrl}
            </span>
            <button
              onClick={handleCopyWebhook}
              className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-[#1A1F2C] dark:hover:bg-[#252C3D] dark:text-zinc-300 dark:hover:text-white transition shrink-0 cursor-pointer"
              title="Copiar URL do Webhook"
            >
              {copiedWebhook ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] text-[11px] text-slate-500 font-mono">
            <strong>Privacidade:</strong> O processamento ocorre exclusivamente no seu servidor privado local.
          </div>
        </div>

      </div>

      {/* HISTÓRICO DE NOTIFICAÇÕES CAPTURADAS */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-3 shadow-sm">
        <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          HISTÓRICO DE CAPTURAS RECENTES (IPHONE 17 PRO MAX)
        </h3>

        <div className="space-y-2">
          {smsHistory && smsHistory.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">{item.parsedMerchant}</span>
                  <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 dark:text-sky-300 dark:bg-sky-950/60 dark:border-sky-800/40">
                    {item.detectedCard}
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-[#161922] px-2 py-0.5 rounded border border-slate-200 dark:border-[#242A38]">
                    {item.assignedCategory}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800/40">
                    {item.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-zinc-500 truncate max-w-xl">
                  "{item.rawText}"
                </p>

                <span className="text-[10px] text-slate-400 dark:text-zinc-600 block">
                  Capturado em: {new Date(item.capturedAt).toLocaleString('pt-BR')} • {item.device}
                </span>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-base font-bold text-slate-900 dark:text-zinc-100 tabular-nums block">
                  {formatBRL(item.parsedAmount)}
                </span>
                <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase">
                  Debitado do Balanço
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
