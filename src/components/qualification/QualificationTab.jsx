import React, { useState, useMemo } from 'react';
import { Sliders, Cpu, CheckSquare, Save, Play, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function QualificationTab({
  qualificationRules,
  setQualificationRules,
  companyGuidelines,
  setCompanyGuidelines,
  showToast
}) {
  const [testLeadNiche, setTestLeadNiche] = useState('tecnologia');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  // Available sectors list for checklist
  const sectorsList = [
    { id: 'tecnologia', label: 'Tecnologia & Software B2B' },
    { id: 'academia', label: 'Academias & Studios de Fitness' },
    { id: 'fisio', label: 'Fisioterapia & Clínicas de Reabilitação' },
    { id: 'psicologia', label: 'Psicologia & Clínicas de Saúde Mental' },
    { id: 'personal', label: 'Personal Trainers & Consultores' },
    { id: 'acaiterias', label: 'Açaiterias & Comércio Local' },
    { id: 'criadores', label: 'Grandes Criadores de Conteúdo' },
    { id: 'criadores_mid', label: 'Micro/Médios Criadores de Conteúdo' }
  ];

  const handleCheckboxChange = (sectorId) => {
    setQualificationRules(prev => {
      const isAlreadyAllowed = prev.allowedSectors.includes(sectorId);
      const nextSectors = isAlreadyAllowed
        ? prev.allowedSectors.filter(id => id !== sectorId)
        : [...prev.allowedSectors, sectorId];
      
      const updated = { ...prev, allowedSectors: nextSectors };
      localStorage.setItem('gtm_qualification_rules', JSON.stringify(updated));
      return updated;
    });
  };

  const handleInputChange = (field, value) => {
    setQualificationRules(prev => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem('gtm_qualification_rules', JSON.stringify(updated));
      return updated;
    });
  };

  // Generate prompt preview dynamically
  const generatedPromptPreview = useMemo(() => {
    const minRevText = qualificationRules.minRevenue === 'none' ? 'Sem restrição' : `Mínimo de ${qualificationRules.minRevenue} / ano`;
    const allowedSectorsNames = sectorsList
      .filter(s => qualificationRules.allowedSectors.includes(s.id))
      .map(s => s.label)
      .join(', ');

    return `Você é um robô qualificador de leads B2B instruído a seguir rigorosamente este Playbook Comercial.
    
DIRETRIZES DO PLAYBOOK:
"${companyGuidelines}"

REGRAS DE FILTRO DO SISTEMA:
1. Setores Permitidos: [${allowedSectorsNames || 'Nenhum'}]
2. Faturamento Mínimo Aceito: ${minRevText}
3. Porte Mínimo da Empresa: ${qualificationRules.minEmployees === 'none' ? 'Sem restrição' : qualificationRules.minEmployees}
4. Tecnologias que o lead deve utilizar: ${qualificationRules.requiredTechs || 'Sem restrições de tecnologia'}

CRITÉRIOS DE PONTUAÇÃO (PESOS):
- Aderência ao Setor/Nicho: ${qualificationRules.weightSector}% de importância
- Presença de Tecnologias Requeridas: ${qualificationRules.weightTech}% de importância
- Porte e Capacidade de Faturamento: ${qualificationRules.weightSizing}% de importância

DIRETRIZ DE AVALIAÇÃO DE FIT:
Determine se o lead possui um Fit Score maior ou igual a ${qualificationRules.minFitScore}% com base nos pesos acima. Se o lead não atingir os requisitos mínimos, marque como "qualified: false".

DADOS DO LEAD PARA ANALISAR:
{
  "company": "Exemplo Ltda",
  "sector": "Setor do lead",
  "revenue": "Faturamento do lead",
  "size": "Porte do lead",
  "tech": ["Lista de tecnologias"]
}`;
  }, [qualificationRules, companyGuidelines]);

  const handleSimulateTest = () => {
    setIsSimulating(true);
    setSimulationResult(null);

    // Simulated lead properties
    const mockLeads = {
      tecnologia: { company: 'Delta Tech Solutions', sector: 'TECNOLOGIA', revenue: 'R$ 950.000 / ano', size: 'Pequena (5-15 func)', tech: ['Google Workspace', 'Python', 'Stripe'] },
      academia: { company: 'Power Gym Centro', sector: 'ACADEMIA', revenue: 'R$ 410.000 / ano', size: 'Microempresa (1-9 func)', tech: ['Instagram Ads', 'WhatsApp Business'] },
      criadores: { company: 'Gabriela Jojo (Caju em Cena)', sector: 'CRIADORES_MID', revenue: 'R$ 72.000 / ano', size: 'Microempresa (1-3 func)', tech: ['Twitch Sub'] }
    };

    const targetLead = mockLeads[testLeadNiche];

    setTimeout(() => {
      setIsSimulating(false);
      
      // Calculate scores dynamically based on the configuration rules
      const isSectorAllowed = qualificationRules.allowedSectors.includes(testLeadNiche);
      const isRevenueOk = qualificationRules.minRevenue === 'none' || 
                           (qualificationRules.minRevenue === '100k' && !targetLead.revenue.includes('72.000')) ||
                           (qualificationRules.minRevenue === '500k' && targetLead.revenue.includes('950.000')) ||
                           (qualificationRules.minRevenue === '1M' && false);

      let sectorScore = isSectorAllowed ? 100 : 20;
      let sizingScore = isRevenueOk ? 100 : 40;
      let techScore = 80; // default mock

      const finalScore = Math.round(
        (sectorScore * (qualificationRules.weightSector / 100)) +
        (sizingScore * (qualificationRules.weightSizing / 100)) +
        (techScore * (qualificationRules.weightTech / 100))
      );

      const isQualified = finalScore >= qualificationRules.minFitScore;

      setSimulationResult({
        qualified: isQualified,
        fitScore: finalScore,
        justification: isQualified 
          ? `Simulação Aprovada! O lead pertence ao setor de ${targetLead.sector} que está habilitado e atende ao faturamento de ${targetLead.revenue}. Pontuação de ${finalScore}% supera a nota de corte (${qualificationRules.minFitScore}%).`
          : `Simulação Rejeitada. A pontuação final de ${finalScore}% ficou abaixo da nota de corte (${qualificationRules.minFitScore}%) devido a restrições de porte ou nicho não prioritário.`,
        details: {
          sectorScore,
          sizingScore,
          techScore
        }
      });
      showToast('Simulação de qualificação concluída!', 'success');
    }, 1000);
  };

  const handleSaveAll = () => {
    localStorage.setItem('gtm_qualification_rules', JSON.stringify(qualificationRules));
    localStorage.setItem('gtm_guidelines', companyGuidelines);
    showToast('Playbook e Regras de Qualificação atualizados com sucesso!', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Sliders className="text-indigo-400" size={24} />
          Filtros & Playbook de Qualificação
        </h2>
        <p className="text-xs text-slate-400">Desenhe e configure visualmente as regras que a IA usará para analisar, pontuar e aprovar leads automaticamente.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: Configuration Fields */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Section 1: Playbook text */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Cpu size={16} className="text-indigo-400" />
              1. Instruções Gerais para o Agente de IA
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Escreva as regras gerais que o modelo de IA do Gemini deve interpretar ao analisar o lead. Descreva o perfil de cliente ideal e o que deve ser desqualificado.
            </p>
            <textarea
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-sans focus:border-indigo-500 outline-none"
              rows="4"
              value={companyGuidelines}
              onChange={(e) => setCompanyGuidelines(e.target.value)}
              placeholder="Descreva as diretrizes comerciais aqui..."
            />
          </div>

          {/* Section 2: Visual rule building */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare size={16} className="text-emerald-400" />
              2. Regras de Filtro de Dados
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Allowed Sectors */}
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-bold block">Setores Autorizados</label>
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg space-y-2 max-h-[180px] overflow-y-auto">
                  {sectorsList.map(sec => {
                    const isChecked = qualificationRules.allowedSectors.includes(sec.id);
                    return (
                      <label key={sec.id} className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(sec.id)}
                        />
                        <span>{sec.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Financial Constraints & Sizing */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Faturamento Mínimo Anual</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-200 outline-none focus:border-indigo-500"
                    value={qualificationRules.minRevenue}
                    onChange={(e) => handleInputChange('minRevenue', e.target.value)}
                  >
                    <option value="none">Sem Restrição (Qualquer faturamento)</option>
                    <option value="100k">Mínimo R$ 100.000 / ano</option>
                    <option value="500k">Mínimo R$ 500.000 / ano</option>
                    <option value="1M">Mínimo R$ 1.000.000 / ano</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Porte Mínimo (Funcionários)</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-200 outline-none focus:border-indigo-500"
                    value={qualificationRules.minEmployees}
                    onChange={(e) => handleInputChange('minEmployees', e.target.value)}
                  >
                    <option value="none">Sem Restrição</option>
                    <option value="1-9">Microempresa (1-9 func)</option>
                    <option value="10-49">Média (10-49 func)</option>
                    <option value="50+">Grande (50+ func)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Tecnologias Exigidas (Separadas por vírgula)</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-200 outline-none focus:border-indigo-500"
                    placeholder="Ex: Instagram Ads, iFood, AWS..."
                    value={qualificationRules.requiredTechs || ''}
                    onChange={(e) => handleInputChange('requiredTechs', e.target.value)}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Weights & Fit Score */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sliders size={16} className="text-amber-400" />
              3. Pesos & Nota de Corte da Qualificação
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Defina a nota de corte para aprovação automática e ajuste a distribuição de pesos para faturamento, tecnologias e setor.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Aderência ao Setor</span>
                  <span className="font-bold text-indigo-400">{qualificationRules.weightSector}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={qualificationRules.weightSector}
                  onChange={(e) => handleInputChange('weightSector', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Uso de Tecnologias</span>
                  <span className="font-bold text-indigo-400">{qualificationRules.weightTech}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={qualificationRules.weightTech}
                  onChange={(e) => handleInputChange('weightTech', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Porte / Faturamento</span>
                  <span className="font-bold text-indigo-400">{qualificationRules.weightSizing}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={qualificationRules.weightSizing}
                  onChange={(e) => handleInputChange('weightSizing', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg"
                />
              </div>

            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-300 block font-bold">Nota de Corte do Fit Score</span>
                <span className="text-[10px] text-slate-500 block">Leads com fit abaixo desta nota serão marcados como rejeitados comercialmente.</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range" min="30" max="95" 
                  value={qualificationRules.minFitScore}
                  onChange={(e) => handleInputChange('minFitScore', parseInt(e.target.value))}
                  className="w-32 accent-indigo-500 bg-slate-900"
                />
                <span className="font-mono text-lg font-black text-indigo-400 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">{qualificationRules.minFitScore}%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Simulation & Prompt preview */}
        <div className="space-y-6">
          
          {/* Quick Save Card */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
            <div className="space-y-2 mb-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Persistir Alterações</h4>
              <p className="text-[10px] text-slate-500">Salve as regras e playbook na nuvem. A IA utilizará estas regras atualizadas para a qualificação de novos leads.</p>
            </div>
            <button
              onClick={handleSaveAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Save size={14} /> Salvar Regras de Negócio
            </button>
          </div>

          {/* Rules Testing Sandbox */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Play size={16} className="text-indigo-400" />
              Laboratório de Teste (Sandbox)
            </h3>
            <p className="text-[11px] text-slate-400">
              Escolha uma amostragem de lead simulada para testar suas regras locais instantaneamente.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Escolher Perfil de Lead</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-200 outline-none focus:border-indigo-500"
                  value={testLeadNiche}
                  onChange={(e) => setTestLeadNiche(e.target.value)}
                >
                  <option value="tecnologia">Delta Tech (SaaS, Pequeno Porte, R$ 950k/ano)</option>
                  <option value="academia">Power Gym (Comércio Local, Microempresa, R$ 410k/ano)</option>
                  <option value="criadores">Caju em Cena (Micro-criador, MEI, R$ 72k/ano)</option>
                </select>
              </div>

              <button
                onClick={handleSimulateTest}
                disabled={isSimulating}
                className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                {isSimulating ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
                Testar Regras em Lote
              </button>

              {/* Simulation Result Output */}
              {simulationResult && (
                <div className={`p-4 rounded-xl border space-y-3 animate-fadeIn ${
                  simulationResult.qualified 
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' 
                    : 'bg-red-950/40 border-red-500/30 text-red-200'
                }`}>
                  <div className="flex justify-between items-center border-b border-slate-800/40 pb-2">
                    <span className="text-xs font-black uppercase flex items-center gap-1.5">
                      {simulationResult.qualified ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                      {simulationResult.qualified ? 'Aprovado (Qualificado)' : 'Rejeitado (Desqualificado)'}
                    </span>
                    <span className="font-mono text-xs font-black">{simulationResult.fitScore}% Fit</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-normal">{simulationResult.justification}</p>
                </div>
              )}
            </div>
          </div>

          {/* Generated Prompt Preview */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prompt Gerado pela IA</h4>
            <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg max-h-[220px] overflow-y-auto">
              <pre className="text-[9px] text-indigo-300/80 font-mono whitespace-pre-wrap leading-relaxed">{generatedPromptPreview}</pre>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
