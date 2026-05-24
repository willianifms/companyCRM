import React from 'react';
import { 
  Cpu, Compass, Building2, Filter, Trash2, Plus, User, MapPin, Info, RefreshCw, Zap
} from 'lucide-react';
import { BR_STATES } from '../../constants/mockData';

export default function ProspectingTab({
  companyGuidelines,
  setCompanyGuidelines,
  discoverySector,
  setDiscoverySector,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  isLoadingCities,
  citiesList,
  discoverySize,
  setDiscoverySize,
  handleBigDataSearch,
  isScanning,
  cnpjInput,
  setCnpjInput,
  handleRealCnpjSearch,
  isFetchingCnpj,
  filterLocationState,
  setFilterLocationState,
  filterLocationCity,
  setFilterLocationCity,
  filterCitiesList,
  filterSize,
  setFilterSize,
  filterTitle,
  setFilterTitle,
  filterTech,
  setFilterTech,
  filteredApolloLeads,
  selectedApolloIds,
  setSelectedApolloIds,
  handleDeleteSelectedLeads,
  handleExportToClay,
  aiQualifications,
  setSelectedLead,
  isQualifyingLead,
  handleAiQualification,
  handleDeleteLead,
  showScanModal,
  setShowScanModal,
  scanProgress,
  scanProgressText,
  scanQuantity,
  setScanQuantity
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Playbook Rules guidelines */}
      <div className="bg-slate-900 border border-indigo-900/50 p-5 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-400">
          <Cpu size={20} />
          <h3 className="font-bold text-sm uppercase tracking-wider">Playbook de Qualificação Comercial & Diretrizes</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Insira o seu playbook de vendas de forma simples. Nosso agente de IA Gemini fará a leitura e julgamento instantâneo de cada conta de acordo com essas instruções.
        </p>
        <textarea
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono focus:border-indigo-500 outline-none"
          rows="3"
          value={companyGuidelines}
          onChange={(e) => setCompanyGuidelines(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic Big Data Scan by niche / cities */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 lg:col-span-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <Compass size={18} />
            <h3 className="font-bold text-xs uppercase tracking-wider">Varredura de Mercado B2B</h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">Filtre por todos os estados e municípios brasileiros através da integração oficial com o IBGE.</p>
          
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-500 uppercase block mb-1">Setor / Nicho</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                value={discoverySector}
                onChange={(e) => setDiscoverySector(e.target.value)}
              >
                <option value="criadores_mid">Streamers & YouTubers Médios/Pequenos (ICP Focado)</option>
                <option value="fisio">Fisioterapia & Clínicas de Reabilitação</option>
                <option value="psicologia">Psicologia & Clínicas de Saúde Mental</option>
                <option value="personal">Personal Trainers & Consultores</option>
                <option value="academia">Academias & Studios de Fitness</option>
                <option value="acaiterias">Açaiterias & Comércio de Alimentos Local</option>
                <option value="criadores">Criadores de Conteúdo (Grandes)</option>
                <option value="tecnologia">Tecnologia & Software B2B</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Estado (UF)</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                  }}
                >
                  {BR_STATES.map(st => (
                    <option key={st.uf} value={st.uf}>{st.uf} - {st.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Município (IBGE)</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={isLoadingCities}
                >
                  {isLoadingCities ? (
                    <option>Carregando...</option>
                  ) : (
                    citiesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase block mb-1">Porte</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                value={discoverySize}
                onChange={(e) => setDiscoverySize(e.target.value)}
              >
                <option value="micro">Micro Empresas / MEI / ME</option>
                <option value="grande">Média / Grandes Corporações S.A.</option>
              </select>
            </div>

            <button
              onClick={() => setShowScanModal(true)}
              disabled={isScanning || isLoadingCities}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {isScanning ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} />}
              Iniciar Varredura Ativa
            </button>
          </div>
        </div>

        {/* Fetch via known CNPJ */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4 lg:col-span-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <Building2 size={18} />
            <h3 className="font-bold text-xs uppercase tracking-wider">Mapear CNPJ Conhecido</h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">Já possui um CNPJ específico e deseja puxar todos os dados oficiais da Receita Federal?</p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Ex: 06.990.590/0001-23"
              className="bg-slate-950 border border-slate-800 rounded-lg text-xs p-2.5 text-slate-200 outline-none focus:border-emerald-500 w-full font-mono"
              value={cnpjInput}
              onChange={(e) => setCnpjInput(e.target.value)}
            />
            <button
              onClick={handleRealCnpjSearch}
              disabled={isFetchingCnpj}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-lg"
            >
              {isFetchingCnpj ? <RefreshCw className="animate-spin" size={14} /> : 'Mapear CNPJ Ativo'}
            </button>
          </div>
        </div>

        {/* Filters sidebar */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-3 lg:col-span-1">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1"><Filter size={14} /> Filtrar Base</h3>
          
          <div>
            <label className="text-[10px] text-slate-500 uppercase block mb-1">Título / Empresa / Setor</label>
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-300 w-full outline-none focus:border-indigo-500"
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase block mb-1">Tecnologia Utilizada</label>
            <input
              type="text"
              placeholder="Ex: Instagram Ads, OBS..."
              className="bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-300 w-full outline-none focus:border-indigo-500"
              value={filterTech}
              onChange={(e) => setFilterTech(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-500 uppercase block mb-1">Estado</label>
              <select
                className="bg-slate-950 border border-slate-800 rounded-lg w-full text-xs p-2 text-slate-300 focus:outline-none focus:border-indigo-500"
                value={filterLocationState}
                onChange={(e) => {
                  setFilterLocationState(e.target.value);
                  setFilterLocationCity('all');
                }}
              >
                <option value="all">Todos</option>
                {BR_STATES.map(s => (
                  <option key={s.uf} value={s.uf}>{s.uf}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase block mb-1">Cidade</label>
              <select
                className="bg-slate-950 border border-slate-800 rounded-lg w-full text-xs p-2 text-slate-300 focus:outline-none focus:border-indigo-500"
                value={filterLocationCity}
                onChange={(e) => setFilterLocationCity(e.target.value)}
                disabled={filterLocationState === 'all'}
              >
                <option value="all">Todas</option>
                {filterCitiesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase block mb-1">Porte</label>
            <select
              className="bg-slate-950 border border-slate-800 rounded-lg w-full text-xs p-2 text-slate-300 focus:outline-none focus:border-indigo-500"
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
            >
              <option value="all">Todos os Portes</option>
              <option value="micro">Microempresas / MEI</option>
              <option value="grande">Médias e Grandes Empresas</option>
            </select>
          </div>
        </div>

      </div>

      {/* Mapped leads table display */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-800 flex-wrap gap-3">
        <h3 className="font-bold text-sm text-slate-300">Empresas & Criadores Mapeados ({filteredApolloLeads.length})</h3>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteSelectedLeads}
            disabled={selectedApolloIds.length === 0}
            className="bg-red-950/40 hover:bg-red-900 border border-red-500/30 text-red-300 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} />
            Excluir Selecionados ({selectedApolloIds.length})
          </button>
          <button
            onClick={handleExportToClay}
            disabled={selectedApolloIds.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
            Exportar para o Clay Grid ({selectedApolloIds.length})
          </button>
        </div>
      </div>

      <div className="bg-slate-900/20 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-[11px] font-semibold tracking-wider border-b border-slate-800">
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                  checked={selectedApolloIds.length === filteredApolloLeads.length && filteredApolloLeads.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedApolloIds(filteredApolloLeads.map(l => l.id));
                    } else {
                      setSelectedApolloIds([]);
                    }
                  }}
                />
              </th>
              <th className="p-4">Empresa / Criador / Canal</th>
              <th className="p-4">CNPJ / Reg. Canal</th>
              <th className="p-4">Localização / Canal</th>
              <th className="p-4">Mapeado Por</th>
              <th className="p-4 text-center">Qualificação Comercial (IA)</th>
              <th className="p-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs">
            {filteredApolloLeads.map(lead => {
              const qualification = aiQualifications[lead.id];
              return (
                <tr key={lead.id} className="hover:bg-slate-900/20 transition-all cursor-pointer">
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                      checked={selectedApolloIds.includes(lead.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedApolloIds(prev => [...prev, lead.id]);
                        } else {
                          setSelectedApolloIds(prev => prev.filter(id => id !== lead.id));
                        }
                      }}
                    />
                  </td>
                  <td className="p-4 font-medium" onClick={() => setSelectedLead(lead)}>
                    <div>
                      <span className="font-semibold text-slate-100 block hover:text-indigo-400 transition-colors">{lead.company}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <User size={11} /> {lead.name} • {lead.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-4" onClick={() => setSelectedLead(lead)}>
                    <div className="space-y-1">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700/60 inline-block font-bold">{lead.cnpj}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{lead.size}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300 font-mono" onClick={() => setSelectedLead(lead)}>
                    <span className="flex items-center gap-1"><MapPin size={11} className="text-slate-500" /> {lead.country}</span>
                  </td>
                  <td className="p-4 text-slate-400" onClick={() => setSelectedLead(lead)}>
                    <span className="font-mono bg-slate-900 px-2 py-1 rounded border border-slate-850 font-bold text-[10px]">
                      {lead.prospector || 'Sistema'}
                    </span>
                  </td>
                  <td className="p-4 max-w-xs" onClick={() => setSelectedLead(lead)}>
                    {qualification ? (
                      <div className={`p-2.5 rounded border text-[11px] ${qualification.qualified ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-red-950/40 border-red-500/30'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-bold ${qualification.qualified ? 'text-emerald-400' : 'text-red-400'}`}>
                            {qualification.qualified ? 'Aprovado' : 'Rejeitado'}
                          </span>
                          <span className="font-mono text-[9px] bg-slate-900 px-1.5 rounded border border-slate-800">{qualification.fitScore}% Fit</span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-tight line-clamp-1">{qualification.justification}</p>
                        {qualification.recommendedPackage && (
                          <span className="text-[9px] font-bold text-indigo-400 mt-1.5 block font-mono">
                            Pitch: {qualification.recommendedPackage}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-slate-500 italic">Pendente de qualificação</div>
                    )}
                  </td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg border border-slate-700/60"
                        title="Ver Ficha Cadastral Detalhada"
                      >
                        <Info size={12} />
                      </button>
                      <button
                        onClick={() => handleAiQualification(lead)}
                        disabled={isQualifyingLead[lead.id]}
                        className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 text-[10px] px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all"
                      >
                        {isQualifyingLead[lead.id] ? <RefreshCw className="animate-spin" size={12} /> : <Cpu size={12} />}
                        Qualificar
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="bg-red-950/25 hover:bg-red-600 text-red-400 hover:text-white border border-red-900/50 p-1.5 rounded-lg transition-all"
                        title="Excluir do Workspace"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de Quantidade de Leads */}
      {showScanModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-scaleUp">
            
            <div className="flex items-center gap-3 text-indigo-400 pb-3 border-b border-slate-800">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">Quantidade de Leads</h3>
                <p className="text-[10px] text-slate-500">Defina o volume de prospecção desta rodada</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Escolha a quantidade de leads reais que a inteligência da Órbita deve buscar, enriquecer e qualificar nesta varredura de mercado.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-2 font-semibold">Atalhos de Volume</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 20, 50].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setScanQuantity(qty)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all border ${
                        scanQuantity === qty
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {qty} Leads
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <label className="text-[10px] text-slate-500 uppercase block mb-1.5 font-semibold">Ou digite um valor customizado (1 - 100)</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-indigo-500 focus:outline-none"
                    value={scanQuantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) {
                        setScanQuantity(Math.max(1, Math.min(100, val)));
                      } else {
                        setScanQuantity('');
                      }
                    }}
                  />
                  <span className="absolute right-3 text-[10px] text-slate-500 font-mono">leads</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowScanModal(false)}
                className="w-1/2 bg-slate-950 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-slate-200 font-semibold text-xs py-2.5 rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const qty = parseInt(scanQuantity, 10) || 5;
                  setShowScanModal(false);
                  handleBigDataSearch(qty);
                }}
                className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-1.5"
              >
                <Zap size={14} />
                Iniciar Varredura
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Overlay de Progresso da Varredura */}
      {isScanning && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl text-center relative animate-scaleUp">
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-16 w-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 animate-pulse border border-indigo-500/20">
                  <Cpu size={32} className="animate-spin-slow" />
                </div>
                <div className="absolute inset-0 h-16 w-16 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">Varredura de Leads Ativa</h3>
              <p className="text-[11px] text-slate-400">
                A inteligência comercial está minerando a base do IBGE e consultando o Gemini...
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-850 p-0.5">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span className="truncate max-w-[80%] text-left">{scanProgressText}</span>
                <span className="font-bold text-indigo-400">{scanProgress}%</span>
              </div>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-855 text-[10px] text-slate-500 leading-normal text-left flex gap-2 items-start">
              <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
              <span>
                Esta operação realiza scraping avançado em lote de CNPJs ativos do município selecionado e analisa cada lead individualmente através do modelo Gemini. Isso pode levar alguns segundos.
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
