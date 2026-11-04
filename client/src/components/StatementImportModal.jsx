import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function StatementImportModal({ isOpen, onClose, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [targetCardId, setTargetCardId] = useState('card-nubank');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null);
    setResult(null);

    const name = file.name.toLowerCase();
    if (name.includes('nubank')) setTargetCardId('card-nubank');
    else if (name.includes('bradesco')) setTargetCardId('card-bradesco');
    else if (name.includes('mercado') || name.includes('mp')) setTargetCardId('card-mercadopago');

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
    };
    reader.onerror = () => {
      setError('Falha ao ler o arquivo selecionado.');
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!fileContent) {
      setError('Por favor, selecione um arquivo de extrato válido (.ofx ou .csv).');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/cards/import-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileContent,
          fileName: selectedFile?.name || 'extrato.ofx',
          targetCardId
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Erro ao processar extrato');
      }

      setResult(json);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Erro na importação:', err);
      setError(err.message || 'Erro ao comunicar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFileContent('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-[#2B303E] p-5 sm:p-6 bg-white dark:bg-[#12151D] shadow-2xl relative">

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#1F232D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 dark:bg-[#191F2D] dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800/40">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wide">Importador de Extratos</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">OFX bancário e CSV (Nubank, Bradesco, Mercado Pago)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-[#1C202C] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="my-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800/40 dark:text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Success State */}
        {result ? (
          <div className="py-4 space-y-3 font-mono">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-[#141C26] border border-emerald-200 dark:border-[#233145] text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-900 dark:text-zinc-100">Extrato Processado com Sucesso!</h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Cartão destino: <strong>{result.cardName}</strong>
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 bg-white dark:bg-[#0D0F14] rounded-xl border border-slate-200 dark:border-[#1F232D]">
                  <span className="text-[9px] uppercase text-slate-400 dark:text-zinc-500 block">Importadas</span>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">+{result.importedCount}</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#0D0F14] rounded-xl border border-slate-200 dark:border-[#1F232D]">
                  <span className="text-[9px] uppercase text-slate-400 dark:text-zinc-500 block">Duplicadas Ignoradas</span>
                  <span className="text-lg font-bold text-slate-500 dark:text-zinc-400 tabular-nums">{result.skippedCount}</span>
                </div>
              </div>
            </div>

            {result.transactions && result.transactions.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Transações Cadastradas:
                </span>
                {result.transactions.map((tx) => (
                  <div key={tx.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-[#1F232D] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-zinc-200 block">{tx.establishment}</span>
                      <span className="text-[10px] text-purple-700 dark:text-purple-400">{tx.category} • {tx.transactionDate}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-zinc-100 tabular-nums">{formatBRL(tx.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-[#1F232D]">
              <button
                onClick={handleReset}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#161922] dark:text-zinc-400 text-xs font-mono transition cursor-pointer"
              >
                Outro Arquivo
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold cursor-pointer shadow-xs"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <div className="py-4 space-y-4 font-mono">

            {/* Target Card Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-400 mb-1.5">
                1. Selecione o Cartão de Crédito Destino
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card-nubank', label: 'Nubank' },
                  { id: 'card-bradesco', label: 'Bradesco' },
                  { id: 'card-mercadopago', label: 'Mercado Pago' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setTargetCardId(c.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${targetCardId === c.id
                      ? 'bg-slate-900 text-white dark:bg-[#1E232F] dark:text-zinc-100 border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-[#0D0F14] dark:text-zinc-400 dark:border-[#222631] hover:bg-slate-100'
                      }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* File Dropzone */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-400 mb-1.5">
                2. Selecione o arquivo de extrato (.ofx ou .csv)
              </label>
              <label className="border-2 border-dashed border-slate-300 dark:border-[#2B303E] hover:border-emerald-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-[#0D0F14] transition group">
                <FileText className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 mb-2 transition" />
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block text-center">
                  {selectedFile ? selectedFile.name : 'Clique para selecionar arquivo de extrato'}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">
                  Formatos aceitos: OFX bancário ou CSV do aplicativo
                </span>
                <input
                  type="file"
                  accept=".ofx,.csv,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Smart categorization callout */}
            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-[#141720] border border-emerald-200 dark:border-[#222838] text-[11px] text-slate-700 dark:text-zinc-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>Motor de Muriaé:</strong> Identifica automaticamente
                <em> Bahamas, Supermercados BH, Top Frut, Posto Faisão, Farmácia Indiana</em> e aplica a divisão 50/50.
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-[#1F232D]">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#161922] dark:text-zinc-400 text-xs font-mono transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={!selectedFile || loading}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition ${selectedFile && !loading
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-xs'
                  : 'bg-slate-200 text-slate-400 dark:bg-[#161922] dark:text-zinc-600 cursor-not-allowed'
                  }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <span>Processar Extrato</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
