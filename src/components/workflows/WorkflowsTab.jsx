import React from 'react';
import { Network, Plus } from 'lucide-react';

export default function WorkflowsTab({
  workflowNodes,
  setWorkflowNodes,
  showToast,
  logMovement
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Network className="text-indigo-400" size={24} />
          Automação de Workflows Visuais
        </h2>
        <p className="text-xs text-slate-400">Desenhe condicionais lógicas de prospecção e roteamento de IA em escala estilo HubSpot & Clay.</p>
      </div>

      <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 space-y-6">
        <div className="flex flex-col items-center gap-4">
          {workflowNodes.map((node, i) => (
            <React.Fragment key={node.id}>
              <div className={`p-4 rounded-xl border max-w-md w-full flex items-center gap-4 justify-between transition-all ${
                node.type === 'trigger' ? 'bg-amber-950/40 border-amber-800/60' :
                node.type === 'condition' ? 'bg-purple-950/40 border-purple-800/60' : 'bg-slate-950 border-slate-855'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    node.type === 'trigger' ? 'bg-amber-500' :
                    node.type === 'condition' ? 'bg-purple-500' : 'bg-emerald-500'
                  }`} />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">{node.type}</span>
                    <span className="text-xs font-bold text-slate-200">{node.label}</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-mono font-bold">ATIVO</span>
              </div>
              {i !== workflowNodes.length - 1 && (
                <div className="h-8 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500 animate-pulse" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-center">
          <button 
            onClick={() => {
              setWorkflowNodes([...workflowNodes, { id: 'node_' + Date.now(), type: 'action', label: 'Verificar status da entrega SMTP', active: true }]);
              showToast('Novo nó de ação integrado ao workflow!', 'success');
              logMovement("Adicionou novo nó ao workflow de automação");
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
          >
            <Plus size={14} /> Adicionar Ação ao Fluxo
          </button>
        </div>
      </div>
    </div>
  );
}
