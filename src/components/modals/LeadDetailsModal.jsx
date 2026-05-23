import React from 'react';
import { Briefcase, MapPin, User, Trash2, Info } from 'lucide-react';

export default function LeadDetailsModal({
  selectedLead,
  setSelectedLead,
  markAsApproached,
  handleDeleteLead
}) {
  if (!selectedLead) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-start justify-between">
          <div className="flex gap-4 items-center">
            <div className="h-12 w-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center font-bold text-white text-xl">
              {selectedLead.company.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">{selectedLead.company}</h3>
              <span className="text-xs text-indigo-400 font-mono flex items-center gap-1">
                <Briefcase size={12} /> {selectedLead.name} • {selectedLead.title}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setSelectedLead(null)}
            className="text-slate-400 hover:text-slate-200 font-bold text-xs bg-slate-950 hover:bg-slate-800 border border-slate-850 px-3 py-1.5 rounded-lg"
          >
            Fechar Ficha
          </button>
        </div>

        <div className="space-y-4 divide-y divide-slate-800 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">E-mail Cadastral</span>
              <span className="font-mono text-slate-200 bg-slate-950 px-2 py-1 rounded border border-slate-850 block">{selectedLead.email}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Telefone / WhatsApp</span>
              <span className="font-mono text-slate-200 bg-slate-950 px-2 py-1 rounded border border-slate-850 block">{selectedLead.phone}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Website / Canal</span>
              <span className="font-mono text-indigo-400 bg-slate-950 px-2 py-1 rounded border border-slate-855 block truncate">
                {selectedLead.domain}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Instagram</span>
              <span className="font-mono text-indigo-400 bg-slate-950 px-2 py-1 rounded border border-slate-855 block truncate">
                {selectedLead.instagram}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">CNPJ / Registro</span>
              <span className="font-mono text-slate-200 bg-slate-950 px-2 py-1 rounded border border-slate-850 block">
                {selectedLead.cnpj || 'Não Informado'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Porte da Empresa</span>
              <span className="font-mono text-slate-200 bg-slate-950 px-2 py-1 rounded border border-slate-850 block">
                {selectedLead.size || 'Não Informado'}
              </span>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Descrição e Metadados do Mapeamento</span>
            <p className="text-slate-350 bg-slate-950 p-3 rounded-lg border border-slate-855 leading-relaxed">
              {selectedLead.description || 'Nenhuma descrição detalhada provida.'}
            </p>
          </div>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Mapeador do Lead</span>
              <span className="font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-855 font-bold text-indigo-400 block">
                {selectedLead.prospector || 'Sistema'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Ação de Abordagem</span>
              {selectedLead.approachedBy ? (
                <span className="font-mono bg-purple-950 text-purple-300 px-3 py-1.5 rounded border border-purple-800 font-bold block text-center">
                  Abordado por {selectedLead.approachedBy}
                </span>
              ) : (
                <button 
                  onClick={() => {
                    markAsApproached(selectedLead.id);
                    setSelectedLead(null);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 rounded text-xs"
                >
                  Registrar Minha Abordagem Ativa
                </button>
              )}
            </div>
          </div>

          {/* Tech details and Exclusion Option inside detailed card */}
          <div className="pt-4 flex flex-wrap justify-between items-end gap-3">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block font-bold">Tecnologias Mapeadas & Faturamento</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedLead.tech.map((t, i) => (
                  <span key={i} className="text-[10px] bg-slate-950 border border-slate-800 text-slate-300 px-2 py-1 rounded">
                    {t}
                  </span>
                ))}
                <span className="text-[10px] bg-slate-950 border border-slate-800 text-indigo-400 font-bold px-2 py-1 rounded font-mono">
                  {selectedLead.revenue}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                handleDeleteLead(selectedLead.id);
                setSelectedLead(null);
              }}
              className="bg-red-950 border border-red-500/40 text-red-300 px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-red-900 transition-all flex items-center gap-1"
            >
              <Trash2 size={13} />
              Excluir Lead Permanentemente
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
