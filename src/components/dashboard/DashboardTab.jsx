import React from 'react';
import { 
  ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area 
} from 'recharts';
import { 
  Activity, Database, CheckCircle2, Wifi, BarChart3, Users, HardDrive, Clock, RefreshCcw 
} from 'lucide-react';

export default function DashboardTab({
  teamPresence,
  clayGrid,
  crmDeals,
  usersList,
  uptimeStr,
  triggerSyncWebDatabase,
  syncing
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-indigo-300 bg-clip-text text-transparent">Cockpit de Receita GTM</h2>
        <p className="text-xs text-slate-400">Visão analítica de desempenho do SDR ao Fechamento com atribuição multicanal e faturamento auditado.</p>
      </div>

      {/* LIVE TEAM STATUS WIDGET - DASHBOARD EXCLUSIVE */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="text-emerald-400 animate-pulse" size={16} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Monitor de Presença & Movimentos da Equipe</h3>
          </div>
          <span className="text-[10px] bg-slate-950 border border-slate-850 px-2 py-0.5 rounded-md text-indigo-400 font-mono">
            {teamPresence.filter(t => t.status === 'Online').length} SDRs Ativos Online
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {teamPresence.map((member, i) => (
            <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-xs text-slate-200 block">{member.name}</span>
                  <span className="text-[9px] text-slate-500">{member.role}</span>
                </div>
                <span className={`h-2 w-2 rounded-full ${member.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'} mt-1`} />
              </div>
              <div className="text-[10px] text-slate-400 border-t border-slate-900 pt-2 space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>Duração: {member.duration}</span>
                  <span>Última Atividade</span>
                </div>
                <p className="text-indigo-300 font-medium truncate italic">"{member.lastAction || 'Visualizou cockpit principal'}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="h-10 w-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
            <Database size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Base Enriquecida Clay</span>
            <span className="text-2xl font-bold text-slate-100">{clayGrid.length} leads</span>
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Sincronização Web DB</span>
            <span className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
              100% <Wifi className="text-emerald-400 animate-pulse" size={18} />
            </span>
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
            <BarChart3 size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Pipeline Qualificado (CRM)</span>
            <span className="text-2xl font-bold text-purple-400">R$ {crmDeals.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="h-10 w-10 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-400">
            <Users size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Equipe de Vendas Ativa</span>
            <span className="text-2xl font-bold text-rose-400">{usersList.length} Op.</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">Funil de Atração & Conversão Semanal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Seg', Encontrados: 80, Enriquecidos: 60, Contatados: 40, Reuniões: 5 },
                { name: 'Ter', Encontrados: 120, Enriquecidos: 95, Contatados: 70, Reuniões: 8 },
                { name: 'Qua', Encontrados: 150, Enriquecidos: 130, Contatados: 90, Reuniões: 12 },
                { name: 'Qui', Encontrados: 180, Enriquecidos: 160, Contatados: 110, Reuniões: 15 },
                { name: 'Sex', Encontrados: 200, Enriquecidos: 180, Contatados: 140, Reuniões: 18 },
              ]}>
                <defs>
                  <linearGradient id="colorEnriched" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="Enriquecidos" stroke="#4f46e5" fillOpacity={1} fill="url(#colorEnriched)" />
                <Area type="monotone" dataKey="Reuniões" stroke="#10b981" fillOpacity={1} fill="url(#colorMeetings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sincronização e Distribuição de Equipes no Desktop */}
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-300">Estrutura Local + Sincronização Web</h3>
            <p className="text-xs text-slate-400">Sua plataforma roda localmente de forma isolada, sincronizando-se com o banco unificado da Equipe Órbita.</p>
          </div>

          <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-855">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5"><HardDrive size={14} className="text-indigo-400" /> Versão Local</span>
              <span className="font-mono text-slate-300 font-bold">v1.5.0-desktop</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5"><Wifi size={14} className="text-emerald-400 animate-pulse" /> Sincronização Web</span>
              <span className="text-emerald-400 font-bold font-mono">Conectada (Nuvem)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-purple-400" /> Último Backup</span>
              <span className="font-mono text-slate-400">Há 2 minutos</span>
            </div>
          </div>

          <button 
            onClick={triggerSyncWebDatabase}
            disabled={syncing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            <RefreshCcw size={12} className={syncing ? 'animate-spin' : ''} /> Sincronizar Tudo Agora
          </button>
        </div>
      </div>
    </div>
  );
}
