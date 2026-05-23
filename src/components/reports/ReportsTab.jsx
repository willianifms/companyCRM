import React from 'react';
import { 
  Calendar, Radio, Activity, User, Trash2, RefreshCw, Sparkles 
} from 'lucide-react';

export default function ReportsTab({
  usersList,
  teamPresence,
  currentUser,
  uptimeStr,
  apolloLeads,
  handleDeleteLead,
  dailyReports,
  activeReport,
  generateDailyReportAnalysis,
  isGeneratingReport,
  aiReportBrief
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Calendar className="text-indigo-400" size={24} />
          Relatórios de Performance & Auditoria de Atividades
        </h2>
        <p className="text-xs text-slate-400">Rastreie a produtividade da equipe comercial. Saiba quem de sua equipe prospectou, quem abordou e quando.</p>
      </div>

      {/* AUDIT MONITOR TABLE */}
      <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-200">Trilha de Operação Ativa (Ao Vivo)</h3>
            <span className="text-xs text-slate-400">Mapeamento de quem fez cada ação no Workspace unificado</span>
          </div>
          <span className="text-xs bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-slate-400">
            Membros da equipe ativa: <strong className="text-indigo-400 font-mono">{usersList.length}</strong>
          </span>
        </div>

        {/* REAL LIVE TRACKING LOGS FOR ALL TEAM MEMBERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Radio className="text-indigo-400 animate-pulse" size={14} /> Atividades Recentes do Time
            </h4>
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {teamPresence.map((member, idx) => (
                <div key={idx} className="bg-slate-900/40 border border-slate-850 p-3 rounded-lg flex items-start gap-3">
                  <div className="h-8 w-8 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center font-bold text-indigo-400 text-xs uppercase">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-200">{member.name}</span>
                      <span className="text-[9px] text-slate-500 font-mono">Conectado há {member.duration}</span>
                    </div>
                    <span className="text-[9px] bg-slate-950 border border-slate-800/80 text-purple-300 px-1.5 py-0.5 rounded mt-0.5 inline-block font-mono font-semibold">
                      {member.role}
                    </span>
                    <p className="text-xs text-indigo-300 mt-1.5 font-medium truncate italic">
                      "{member.lastAction || 'Visualizou workspace'}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Activity className="text-emerald-400" size={14} /> Histórico de Ações da Sessão
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Todas as ações de exclusão, prospecção e abordagem realizadas neste computador local são enviadas instantaneamente ao banco unificado na web.
              </p>
            </div>
            <div className="bg-slate-900/50 p-3.5 border border-slate-850 rounded-lg space-y-2 text-xs font-mono mt-4">
              <div className="flex justify-between text-slate-500">
                <span>Minha ID:</span>
                <span className="text-indigo-400">{currentUser?.email}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tempo Online:</span>
                <span className="text-emerald-400 font-bold">{uptimeStr}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Último Log:</span>
                <span className="text-indigo-300 truncate max-w-[150px]" title={teamPresence.find(m => m.email === currentUser?.email)?.lastAction}>
                  {teamPresence.find(m => m.email === currentUser?.email)?.lastAction || 'Início da sessão'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pt-3 border-t border-slate-850">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-850">
                <th className="p-3">Empresa Mapeada</th>
                <th className="p-3">Responsável pela Varredura</th>
                <th className="p-3">Operador de Abordagem</th>
                <th className="p-3">Status Interno</th>
                <th className="p-3 text-right">Faturamento / Arrecadação</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {apolloLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-900/20">
                  <td className="p-3 font-semibold text-slate-200">{lead.company}</td>
                  <td className="p-3 text-indigo-400 font-mono font-bold flex items-center gap-1.5">
                    <User size={12} /> {lead.prospector || 'Sistema / API'}
                  </td>
                  <td className="p-3">
                    {lead.approachedBy ? (
                      <span className="bg-purple-950 text-purple-300 px-2 py-0.5 rounded font-mono font-bold border border-purple-800">
                        {lead.approachedBy}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Livre para abordagem</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                      lead.status === 'Novo' ? 'bg-blue-950 text-blue-300 border border-blue-900' : 'bg-emerald-950 text-emerald-300 border border-emerald-900'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-emerald-400 font-bold">{lead.revenue}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="text-red-400 hover:text-red-300 p-1 bg-red-950/20 hover:bg-red-950/50 border border-red-900/40 rounded transition-all"
                      title="Excluir Definitivamente"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analisador de Relatórios Mensais / Diários */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Histórico de Relatórios</h3>
          <div className="space-y-2">
            {dailyReports.map((report, i) => (
              <div 
                key={i} 
                onClick={() => generateDailyReportAnalysis(report)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  activeReport.date === report.date ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200' : 'bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">{report.date}</span>
                  <span className="text-[10px] bg-indigo-900/60 text-indigo-300 border border-indigo-800 px-1.5 py-0.5 rounded font-mono font-bold">Meta: {report.quotaAttainment}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 mt-2">
                  <div>
                    <span className="block text-slate-500">Varreduras</span>
                    <span className="font-semibold text-slate-300">{report.leadsFound}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Qualificados</span>
                    <span className="font-semibold text-emerald-400">{report.leadsQualified}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Agendamentos</span>
                    <span className="font-semibold text-indigo-400">{report.meetingsBooked}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-200">Relatório Executivo de RevOps</h3>
              <span className="text-xs text-slate-400">Análise de Performance do Dia</span>
            </div>
            <button 
              onClick={() => generateDailyReportAnalysis(activeReport)}
              disabled={isGeneratingReport}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              {isGeneratingReport ? <RefreshCw className="animate-spin" size={12} /> : <Sparkles size={12} />}
              Reanalisar com IA do Gemini
            </button>
          </div>

          {aiReportBrief ? (
            <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-4 leading-relaxed font-mono whitespace-pre-wrap bg-slate-950 p-4 rounded-lg border border-slate-850">
              {aiReportBrief}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs italic">
              Selecione um relatório ao lado e clique em Reanalisar para gerar o briefing completo por inteligência artificial.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
