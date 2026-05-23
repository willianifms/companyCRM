import React from 'react';
import { Percent, Plus, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export default function CommercialTab({
  handleAddPackage,
  customPackageName,
  setCustomPackageName,
  customPackagePrice,
  setCustomPackagePrice,
  customPackageMaxDisc,
  setCustomPackageMaxDisc,
  packages,
  calcSelectedPack,
  setCalcSelectedPack,
  calcDiscount,
  setCalcDiscount,
  discountCalculation,
  handleApplyProposalToCrm
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Percent className="text-emerald-400" size={24} />
          Calculadora Comercial & Pacotes de Venda
        </h2>
        <p className="text-xs text-slate-400">Gerencie pacotes de serviços SDR/CDR e calcule descontos protegendo a comissão e a sustentabilidade financeira do time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* List and add service packages */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">Criar Novo Pacote</h3>
          </div>

          <form onSubmit={handleAddPackage} className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-500 uppercase block mb-1">Nome do Pacote</label>
              <input 
                type="text"
                placeholder="Ex: Consultoria GTM"
                value={customPackageName}
                onChange={(e) => setCustomPackageName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Valor Total (R$)</label>
                <input 
                  type="number"
                  placeholder="Ex: 5000"
                  value={customPackagePrice}
                  onChange={(e) => setCustomPackagePrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Teto Desc. (%)</label>
                <input 
                  type="number"
                  placeholder="Ex: 15"
                  value={customPackageMaxDisc}
                  onChange={(e) => setCustomPackageMaxDisc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-lg"
            >
              <Plus size={14} /> Adicionar Pacote
            </button>
          </form>

          <div className="border-t border-slate-800 pt-4 space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tabela de Serviços Ativos</h4>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {packages.map(pack => (
                <div key={pack.id} className="bg-slate-950 p-2.5 rounded border border-slate-850">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-slate-200">{pack.name}</span>
                    <span className="text-emerald-400 font-mono text-xs font-bold">R$ {pack.price.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{pack.description}</p>
                  <span className="text-[9px] bg-slate-900 border border-slate-800 text-indigo-400 font-semibold px-1.5 py-0.5 rounded mt-1.5 inline-block font-mono">Limite desconto: {pack.maxDiscount}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profitability and Discount calculator workspace */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200">Simulador de Descontos e Preservação de Margem</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Selecione o Pacote de Serviço</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-200"
                value={calcSelectedPack}
                onChange={(e) => setCalcSelectedPack(e.target.value)}
              >
                {packages.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - (R$ {p.price.toLocaleString()})</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Aplicar Desconto:</span>
                <span className="font-bold text-indigo-400 font-mono">{calcDiscount}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="50"
                value={calcDiscount}
                onChange={(e) => setCalcDiscount(e.target.value)}
                className="w-full accent-indigo-500 bg-slate-950"
              />
            </div>
          </div>

          {/* Profitability results dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850 text-center">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block mb-1">Valor de Tabela</span>
              <span className="text-base font-bold text-slate-300 font-mono">R$ {discountCalculation.original.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block mb-1">Desconto Aplicado</span>
              <span className="text-base font-bold text-rose-400 font-mono">- R$ {discountCalculation.discountValue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block mb-1">Preço Final Proposto</span>
              <span className="text-lg font-black text-emerald-400 font-mono">R$ {discountCalculation.final.toLocaleString()}</span>
            </div>
          </div>

          {/* Safety Margin Warning Panel */}
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            discountCalculation.allowed 
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' 
              : 'bg-red-950/40 border-red-500/30 text-red-200'
          }`}>
            {discountCalculation.allowed ? (
              <>
                <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-xs">Zona de Segurança - Margem Aprovada</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">O desconto de {calcDiscount}% está dentro do limite configurado de {discountCalculation.maxAllowed}% deste pacote. A comissão da equipe e a viabilidade operacional estão estáveis.</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="text-red-400 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-xs">Margem Comercial Comprometida!</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Aviso de Risco: O teto deste pacote é de {discountCalculation.maxAllowed}%. Conceder {calcDiscount}% compromete a saúde financeira do caixa de SDR, inviabilizando a retenção segura da equipe.</p>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              onClick={handleApplyProposalToCrm}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Send size={12} /> Vincular Proposta Comercial ao CRM
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
