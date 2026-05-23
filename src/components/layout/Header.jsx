import React from 'react';
import { Sparkles, Download, RefreshCcw, LogOut, Wifi } from 'lucide-react';

export default function Header({
  currentUser,
  uptimeStr,
  aiApiKey,
  setAiApiKey,
  syncing,
  triggerSyncWebDatabase,
  setShowExportModal,
  handleLogout
}) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
      
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-black text-white text-lg tracking-wider">
          O
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm tracking-wide bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">Órbita Workspace</h1>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
              <Wifi size={10} className="animate-pulse" /> WORKSPACE COMPARTILHADO (SINCRONIZADO NA WEB)
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">PLATAFORMA AUTOMATIZADA DE AQUISIÇÃO B2B</p>
        </div>
      </div>

      {/* Gemini API Key configuration */}
      <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg max-w-md w-full sm:w-auto">
        <Sparkles className="text-indigo-400 shrink-0" size={16} />
        <input
          type="password"
          placeholder="Chave API Gemini para IA Real..."
          className="bg-transparent text-xs border-none outline-none focus:ring-0 text-slate-200 w-full placeholder:text-slate-600 font-mono"
          value={aiApiKey}
          onChange={(e) => setAiApiKey(e.target.value)}
        />
        {aiApiKey ? (
          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-1.5 py-0.5 rounded shrink-0">IA ATIVADA</span>
        ) : (
          <span className="text-[9px] font-bold text-indigo-400 bg-indigo-950/50 border border-indigo-800/50 px-1.5 py-0.5 rounded shrink-0">PLANO B LOCAL</span>
        )}
      </div>

      {/* User login info and sync buttons */}
      <div className="flex items-center gap-4 text-xs">
        <div className="text-right">
          <span className="text-slate-400">Usuário: </span>
          <span className="font-bold text-slate-200">{currentUser?.name}</span>
          <span className="text-[9px] text-indigo-400 block font-semibold">{currentUser?.role} • Online há {uptimeStr}</span>
        </div>
        
        {/* GitHub ZIP Exporter action Button */}
        <button 
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs transition-all shadow-lg"
          title="Baixar ZIP do projeto para subir no GitHub"
        >
          <Download size={14} /> Baixar Projeto Local
        </button>

        <button 
          onClick={triggerSyncWebDatabase}
          disabled={syncing}
          className="p-2 bg-slate-950 border border-slate-800 rounded-lg hover:border-indigo-500 transition-all text-slate-400 hover:text-white"
          title="Sincronizar Banco Web"
        >
          <RefreshCcw size={14} className={syncing ? 'animate-spin' : ''} />
        </button>
        <button 
          onClick={handleLogout}
          className="p-2 bg-red-950/30 border border-red-900/50 rounded-lg hover:bg-red-900 transition-all text-red-200"
          title="Sair"
        >
          <LogOut size={14} />
        </button>
      </div>

    </header>
  );
}
