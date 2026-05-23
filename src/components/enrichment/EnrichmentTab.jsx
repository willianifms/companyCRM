import React from 'react';
import { Database, ChevronRight, Sparkles, RefreshCw, Trash2 } from 'lucide-react';

export default function EnrichmentTab({
  clayGrid,
  setClayGrid,
  enrichingId,
  runWaterfall,
  isGeneratingIcebreaker,
  generateIcebreaker,
  showToast
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Database className="text-indigo-400" size={24} />
          Tabela Clay: Enriquecimento em Cascata (Fluxo)
        </h2>
        <p className="text-xs text-slate-400">Enriqueça de forma condicional as empresas encontradas. Acione verificadores SMTP e de inteligência.</p>
      </div>

      <div className="bg-slate-900/10 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-xs font-semibold tracking-wider border-b border-slate-800">
                <th className="p-4">Nome / Domínio</th>
                <th className="p-4 w-48 text-center">Apollo → Hunter → Dropcontact</th>
                <th className="p-4">Validação SMTP</th>
                <th className="p-4">Score de Prioridade</th>
                <th className="p-4">Mapeador</th>
                <th className="p-4">Quebra-Gelo Inteligente (Personalização)</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {clayGrid.map(item => (
                <tr key={item.id} className="hover:bg-slate-900/20 transition-all">
                  <td className="p-4">
                    <div>
                      <span className="font-semibold text-slate-100 block">{item.name}</span>
                      <span className="text-xs text-indigo-400 block font-mono">{item.domain}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${
                        item.waterfall.apollo === 'success' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' :
                        item.waterfall.apollo === 'failed' ? 'bg-red-950/80 border-red-500 text-red-300' :
                        'bg-slate-950 border-slate-800 text-slate-600'
                      }`}>
                        AP
                      </div>
                      <ChevronRight size={10} className="text-slate-600" />
                      <div className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${
                        item.waterfall.hunter === 'success' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' :
                        item.waterfall.hunter === 'failed' ? 'bg-red-950/80 border-red-500 text-red-300' :
                        'bg-slate-950 border-slate-800 text-slate-600'
                      }`}>
                        HT
                      </div>
                      <ChevronRight size={10} className="text-slate-600" />
                      <div className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${
                        item.waterfall.dropcontact === 'success' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' :
                        item.waterfall.dropcontact === 'failed' ? 'bg-red-950/80 border-red-500 text-red-300' :
                        'bg-slate-950 border-slate-800 text-slate-600'
                      }`}>
                        DC
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${
                      item.verified === 'verified' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' :
                      item.verified === 'catch_all' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' :
                      item.verified === 'invalid' ? 'bg-red-950 text-red-300 border border-red-800/50' :
                      'bg-slate-900 text-slate-500'
                    }`}>
                      {item.verified === 'verified' ? 'Válido' :
                       item.verified === 'catch_all' ? 'Catch-All' : 
                       item.verified === 'invalid' ? 'Inválido' : 'Pendente'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-slate-950 rounded border border-slate-800 h-2 max-w-[80px]">
                        <div 
                          className={`h-full rounded-sm ${
                            item.priorityScore > 75 ? 'bg-emerald-500' :
                            item.priorityScore > 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.priorityScore}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold">{item.priorityScore} pts</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-xs text-indigo-400">
                    {item.prospector}
                  </td>
                  <td className="p-4 max-w-xs">
                    {isGeneratingIcebreaker === item.id ? (
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <RefreshCw className="animate-spin" size={14} />
                        <span>Gerando via IA...</span>
                      </div>
                    ) : item.icebreaker ? (
                      <p className="text-xs text-slate-300 italic line-clamp-2">"{item.icebreaker}"</p>
                    ) : (
                      <button
                        onClick={() => generateIcebreaker(item.id, item.name, item.company)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 bg-indigo-950/20 border border-indigo-900/50 px-2.5 py-1 rounded transition-all"
                      >
                        <Sparkles size={12} />
                        Criar Quebra-gelo
                      </button>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        disabled={enrichingId === item.id}
                        onClick={() => runWaterfall(item.id)}
                        className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-all ${
                          enrichingId === item.id 
                            ? 'bg-slate-800 text-slate-600' 
                            : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30'
                        }`}
                      >
                        <RefreshCw size={12} className={enrichingId === item.id ? 'animate-spin' : ''} />
                        Rodar Cascata
                      </button>
                      <button
                        onClick={() => {
                          setClayGrid(prev => prev.filter(i => i.id !== item.id));
                          showToast('Item removido do Clay Grid.', 'info');
                        }}
                        className="text-red-400 hover:text-red-300 p-1 bg-red-950/20 hover:bg-red-950/50 border border-red-900/40 rounded transition-all animate-all"
                        title="Excluir"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
