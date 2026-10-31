import React, { useState } from 'react';
import { 
  Smartphone, 
  Zap, 
  Send, 
  CheckCircle2, 
  Radio, 
  Sparkles, 
  Apple, 
  Code2, 
  Copy, 
  Clock, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { formatBRL, formatDateBR } from '../utils/formatters';

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
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-sky-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                Motor iOS Push & SMS (iPhone 17 Pro Max)
              </span>
              <span className="text-xs text-gray-400">Atalhos da Apple • Muriaé/MG</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Captura Automática de Transações por Notificação
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1 leading-relaxed">
              Engenharia reversa do consagrado sistema de captura do Mobills: leitura inteligente de SMS e push 
              bancários (Nubank, Bradesco, Pix, Mercado Pago) via Apple Shortcuts sem intervenção manual.
            </p>
          </div>

          <div className="bg-gray-900/90 border border-sky-500/30 rounded-2xl p-4 text-center min-w-[240px]">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
              Dispositivo Vinculado
            </span>
            <span className="text-lg font-black text-white mt-1 block">
              iPhone 17 Pro Max
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block flex items-center justify-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Webhook Ativo
            </span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: Simulador de Push vs Guia de Configuração Apple Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Simulador Interativo */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">Simulador de Notificação Push / SMS</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-sky-300 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded-full">
              Tempo Real
            </span>
          </div>

          <p className="text-xs text-gray-300">
            Digite ou cole o texto de um SMS ou notificação push bancária para testar o parser regex e o lançamento automático:
          </p>

          <div className="space-y-3">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ex: Compra de R$ 142,50 aprovada no Nubank em BAHAMAS MIX MURIAE..."
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500 transition font-mono"
            />

            <button
              onClick={() => handleSimulate()}
              disabled={simulating || !inputText}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {simulating ? 'Processando Captura...' : 'Simular Captura no iPhone 17 Pro Max'}
            </button>
          </div>

          {/* Quick Clickable Samples */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-gray-400 block mb-2">
              Modelos Rápidos de Muriaé/MG:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickSamples.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulate(sample.text)}
                  className="text-left p-2.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 hover:border-sky-500/40 text-xs text-gray-300 transition"
                >
                  <span className="font-bold text-white block truncate">{sample.title}</span>
                  <span className="text-[10px] text-gray-500 truncate block mt-0.5">{sample.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Card on Success */}
          {lastSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Transação Capturada e Sincronizada!
              </div>
              <div className="font-mono text-[11px] text-gray-300 pl-5">
                Valor: <strong>{formatBRL(lastSuccess.parsedAmount)}</strong> • Estabelecimento: <strong>{lastSuccess.parsedMerchant}</strong> • Cartão: <strong>{lastSuccess.detectedCard}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Guia de Configuração Apple Shortcuts (iOS 18/20) */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Configuração no Apple Shortcuts</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              iOS 20
            </span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            Para ativar a captura 100% autônoma no seu <strong>iPhone 17 Pro Max</strong>:
          </p>

          <ol className="space-y-2 text-xs text-gray-300 list-decimal list-inside leading-relaxed">
            <li>Abra o aplicativo <strong>Atalhos (Shortcuts)</strong> no iPhone.</li>
            <li>Toque na aba <strong>Automação</strong> e crie uma <strong>Automação Pessoal</strong>.</li>
            <li>Escolha o gatilho <strong>"Mensagem" (Ao receber mensagem contendo "compra" ou "aprovada")</strong>.</li>
            <li>Adicione a ação <strong>"Obter Conteúdo do URL" (Método POST)</strong>.</li>
            <li>Cole o Webhook abaixo e selecione o corpo com o texto da mensagem.</li>
          </ol>

          {/* Webhook copy box */}
          <div className="p-3 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-between gap-3">
            <span className="text-xs font-mono text-emerald-400 truncate">
              {webhookUrl}
            </span>
            <button
              onClick={handleCopyWebhook}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition shrink-0"
              title="Copiar URL do Webhook"
            >
              {copiedWebhook ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-[11px] text-gray-400">
            <strong>Privacidade & Segurança:</strong> O processamento ocorre exclusivamente no seu servidor privado, 
            sem envio de dados para servidores terceiros de publicidade.
          </div>
        </div>

      </div>

      {/* HISTÓRICO DE NOTIFICAÇÕES CAPTURADAS */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-400" />
          Histórico de Capturas Recentes (iPhone 17 Pro Max)
        </h3>

        <div className="space-y-2.5">
          {smsHistory && smsHistory.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">{item.parsedMerchant}</span>
                  <span className="text-[10px] text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-500/20 font-semibold">
                    {item.detectedCard}
                  </span>
                  <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                    {item.assignedCategory}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    {item.status}
                  </span>
                </div>

                <p className="text-[11px] text-gray-400 font-mono truncate max-w-xl">
                  "{item.rawText}"
                </p>

                <span className="text-[10px] text-gray-500 block">
                  Capturado em: {new Date(item.capturedAt).toLocaleString('pt-BR')} • {item.device}
                </span>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-base font-black text-white font-mono block">
                  {formatBRL(item.parsedAmount)}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">
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
