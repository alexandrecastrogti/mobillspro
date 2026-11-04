import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[MobillsPro ErrorBoundary] Uncaught React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-zinc-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white dark:bg-[#141720] border border-rose-200 dark:border-rose-900/40 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-xl">
              !
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ops, ocorreu um imprevisto</h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">
                O MobillsPro encontrou uma falha temporária ao renderizar este módulo. Seus dados estão salvos e seguros.
              </p>
            </div>
            <pre className="p-3 rounded-lg bg-slate-100 dark:bg-black/40 text-[11px] font-mono text-rose-600 dark:text-rose-400 overflow-x-auto max-h-32">
              {this.state.error?.message || String(this.state.error)}
            </pre>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-semibold text-xs hover:bg-slate-300 transition"
              >
                Limpar Cache Local
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-500 text-white dark:text-black font-semibold text-xs hover:bg-emerald-400 transition"
              >
                Recarregar Sistema
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);


