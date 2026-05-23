import React from 'react';
import { Target } from 'lucide-react';

export default function ICPTab({ logMovement, showToast }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Target className="text-indigo-400" size={24} />
          Definição Avançada de ICP & TAM Calculator
        </h2>
        <p className="text-xs text-slate-400">Configure as balizas do seu Perfil de Cliente Ideal e projete automaticamente a sua penetração de mercado.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Regras de Segmentação do ICP</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Setores-Chave</label>
              <input 
                type="text" 
                defaultValue="Tecnologia, Saúde, Varejo, Açaiterias, Criadores" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-sm p-2 text-slate-200"
                disabled
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Cargos dos Decisores (Persona)</label>
              <input 
                type="text" 
                defaultValue="Sócio, Proprietário, Streamer Principal, Diretor de Marketing" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-sm p-2 text-slate-200"
                disabled
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button 
              onClick={() => {
                showToast('Configurações de ICP salvas. Base recalculada.', 'success');
                logMovement("Atualizou parâmetros e recalculou a pontuação de ICP da base");
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-lg"
            >
              Atualizar ICP e Recalcular Pontuação da Base
            </button>
          </div>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Dimensionamento de Mercado (TAM)</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">TAM (Mercado Total Endereçável)</span>
                <span className="font-bold text-indigo-400">45.000 empresas/canais</span>
              </div>
              <div className="w-full bg-slate-950 rounded h-1.5 overflow-hidden">
                <div className="h-full bg-indigo-500 w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">SAM (Mercado Disponível Útil)</span>
                <span className="font-bold text-purple-400">12.500 empresas</span>
              </div>
              <div className="w-full bg-slate-950 rounded h-1.5 overflow-hidden">
                <div className="h-full bg-purple-500 w-[27%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
