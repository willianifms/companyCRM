import React from 'react';
import { 
  LayoutDashboard, Calendar, Target, Compass, Percent, Database, Network, Kanban, ShieldCheck 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-full md:w-64 bg-slate-900/50 border-r border-slate-900 p-4 flex flex-col gap-5 shrink-0 overflow-y-auto">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase px-3 mb-1">Mapeamento & Estratégia</p>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard de Receita</span>
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'reports' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Calendar size={16} />
          <span className="flex-1 text-left font-semibold">Relatórios & Auditoria</span>
        </button>
        <button 
          onClick={() => setActiveTab('icp')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'icp' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Target size={16} />
          <span>Definição de ICP (TAM)</span>
        </button>
        <button 
          onClick={() => setActiveTab('prospecting')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'prospecting' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Compass size={16} />
          <span>Varredura Big Data</span>
        </button>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase px-3 mb-1">Comercial & Negociação</p>
        <button 
          onClick={() => setActiveTab('commercial')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'commercial' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Percent size={16} />
          <span>Pacotes & Descontos</span>
        </button>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase px-3 mb-1">Dados & Enriquecimento</p>
        <button 
          onClick={() => setActiveTab('enrichment')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'enrichment' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Database size={16} />
          <span>Tabela Clay (Cascata)</span>
        </button>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase px-3 mb-1">Engajamento & Fluxos</p>
        <button 
          onClick={() => setActiveTab('workflows')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'workflows' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Network size={16} />
          <span>Automação Workflows</span>
        </button>
        <button 
          onClick={() => setActiveTab('crm')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'crm' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Kanban size={16} />
          <span>CRM & Negócios (HubSpot)</span>
        </button>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase px-3 mb-1">Infraestrutura & IA</p>
        <button 
          onClick={() => setActiveTab('deliverability')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'deliverability' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <ShieldCheck size={16} />
          <span>Hub de Entregabilidade</span>
        </button>
      </div>
    </aside>
  );
}
