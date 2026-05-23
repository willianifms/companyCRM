import React from 'react';
import { Kanban, Trash2 } from 'lucide-react';

export default function CrmTab({
  crmDeals,
  setCrmDeals,
  showToast,
  logMovement
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Kanban className="text-indigo-400" size={24} />
          Kanban do CRM HubSpot: Pipeline de Negócios
        </h2>
        <p className="text-xs text-slate-400">Mapeia as interações qualificadas geradas por prospecção e acompanhe as oportunidades comerciais.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['new', 'contacted', 'won'].map(stage => (
          <div key={stage} className="bg-slate-900/20 rounded-xl border border-slate-800 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-semibold text-sm text-slate-300 uppercase">
                {stage === 'new' ? 'Qualificados / Novas Propostas' : stage === 'contacted' ? 'Em Contato' : 'Reunião Realizada (Ganho)'}
              </span>
              <span className="bg-slate-850 px-2 py-0.5 rounded text-xs text-slate-400 font-mono font-bold">
                {crmDeals.filter(d => d.stage === stage).length}
              </span>
            </div>

            <div className="space-y-3">
              {crmDeals.filter(d => d.stage === stage).map(deal => (
                <div key={deal.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg space-y-3 hover:border-slate-700 transition-all relative group">
                  <button
                    onClick={() => {
                      setCrmDeals(prev => prev.filter(d => d.id !== deal.id));
                      showToast('Negócio removido do pipeline.', 'info');
                      logMovement(`Excluiu negócio do CRM: ${deal.name}`);
                    }}
                    className="absolute top-3 right-3 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remover Oportunidade"
                  >
                    <Trash2 size={13} />
                  </button>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">{deal.company}</span>
                    <h4 className="font-bold text-sm text-slate-200">{deal.name}</h4>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-400 font-mono">R$ {deal.value.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold text-right truncate max-w-[100px]" title={deal.riskScore}>Risco: {deal.riskScore}</span>
                  </div>
                  {stage !== 'won' && (
                    <button 
                      onClick={() => {
                        const next = stage === 'new' ? 'contacted' : 'won';
                        setCrmDeals(prev => prev.map(d => d.id === deal.id ? {...d, stage: next} : d));
                        showToast('Oportunidade movida no pipeline!', 'success');
                        logMovement(`Avançou estágio do negócio para "${next}"`);
                      }}
                      className="w-full bg-slate-900 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-400 text-xs py-1.5 rounded-lg border border-slate-800 transition-all font-semibold"
                    >
                      Avançar Próxima Etapa
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
