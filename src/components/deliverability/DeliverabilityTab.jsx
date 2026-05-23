import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function DeliverabilityTab({
  domainHealth,
  spamTextInput,
  setSpamTextInput,
  analyzeSpamPhrases,
  spamAnalysisResult
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="text-indigo-400" size={24} />
          Hub de Entregabilidade (Anti-Spam)
        </h2>
        <p className="text-xs text-slate-400">Evite filtros de SPAM. Autentique domínios alternativos, acompanhe warm-up e previna bounces.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Domínios Conectados para Rotação</h3>
            <div className="space-y-3">
              {domainHealth.map((dom, i) => (
                <div key={i} className="bg-slate-950 border border-slate-850 p-4 rounded-lg flex flex-wrap justify-between items-center gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-200 block">{dom.domain}</span>
                    <span className="text-[10px] text-slate-500 block">Tipo: {dom.type} | {dom.inboxCount} Caixas</span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${dom.spf ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>SPF</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${dom.dkim ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>DKIM</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${dom.dmarc ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>DMARC</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Hoje: {dom.sentToday}/{dom.limit}</span>
                    <span className="text-xs font-bold text-emerald-400">Pontuação: {dom.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Analisador de Palavras SPAM (Termos de Risco)</h3>
          <textarea
            rows="4"
            placeholder="Cole o corpo do seu cold email aqui para analisar a entregabilidade estimada..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 font-mono"
            value={spamTextInput}
            onChange={(e) => setSpamTextInput(e.target.value)}
          />
          <button 
            onClick={analyzeSpamPhrases}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition-all shadow-lg"
          >
            Analisar Entregabilidade do E-mail
          </button>

          {spamAnalysisResult && (
            <div className={`p-3 rounded-lg border text-xs transition-all ${
              spamAnalysisResult.status === 'safe' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}>
              <div className="flex justify-between font-bold mb-1">
                <span>Resultado da Verificação</span>
                <span>Pontuação: {spamAnalysisResult.score}/100</span>
              </div>
              <p className="text-[11px] leading-relaxed">{spamAnalysisResult.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
