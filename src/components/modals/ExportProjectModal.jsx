import React from 'react';
import { FolderOpen, Download, RefreshCw } from 'lucide-react';

export default function ExportProjectModal({
  showExportModal,
  setShowExportModal,
  downloadSingleFile,
  downloadZipProject,
  isZipping
}) {
  if (!showExportModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="text-indigo-400" size={22} />
            <div>
              <h3 className="text-base font-bold text-slate-100">Exportador Local Equipe Órbita</h3>
              <p className="text-[11px] text-slate-400">Baixe o pacote de arquivos para rodar como executável de desktop</p>
            </div>
          </div>
          <button 
            onClick={() => setShowExportModal(false)}
            className="text-slate-400 hover:text-slate-200 font-bold text-xs bg-slate-950 border border-slate-850 px-3 py-1 rounded-lg"
          >
            Fechar
          </button>
        </div>

        <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            Este exportador lê os arquivos gerados no seu editor (Vite + React) e gera um arquivo **projeto-orbita-gtm.zip** unificado com todas as pastas necessárias, pronto para subir no repositório do seu **GitHub**!
          </p>
          
          <div className="text-[11px] text-indigo-300 font-mono space-y-1 bg-slate-900/50 p-3 rounded border border-slate-800/80">
            <span className="font-bold text-slate-400 block mb-1">Árvore de arquivos do repositório:</span>
            <div>📁 meu-projeto-orbita/</div>
            <div>├── 📄 index.html</div>
            <div>├── 📄 package.json</div>
            <div>├── 📄 vite.config.js</div>
            <div>├── 📄 tailwind.config.js</div>
            <div>├── 📄 postcss.config.js</div>
            <div>├── 📄 main.js (Electron Boot)</div>
            <div>└── 📁 src/</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;├── 📄 main.jsx</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;├── 📄 app.jsx (Código GTM OS)</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;└── 📄 index.css</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg flex justify-between items-center">
            <div>
              <span className="font-bold text-slate-200 block">package.json</span>
              <span className="text-[10px] text-slate-500 font-mono">Dependências & Build</span>
            </div>
            <button 
              onClick={() => downloadSingleFile("package.json", JSON.stringify({ name: "orbita-gtm-os", version: "1.5.0", main: "main.js" }, null, 2))}
              className="p-1.5 bg-indigo-950 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded"
              title="Baixar arquivo isolado"
            >
              <Download size={14} />
            </button>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg flex justify-between items-center">
            <div>
              <span className="font-bold text-slate-200 block">schema.sql</span>
              <span className="text-[10px] text-slate-500 font-mono">Estrutura de Tabelas Supabase</span>
            </div>
            <button 
              onClick={() => downloadSingleFile("schema.sql", "create table orbita_users ( id uuid primary key, name text, email text );")}
              className="p-1.5 bg-indigo-950 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded"
              title="Baixar arquivo isolado"
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
          <button 
            onClick={downloadZipProject}
            disabled={isZipping}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800/50 text-white font-bold py-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {isZipping ? (
              <>
                <RefreshCw className="animate-spin" size={15} />
                <span>Gerando Arquivo ZIP...</span>
              </>
            ) : (
              <>
                <Download size={15} />
                <span>Baixar Todos os Arquivos Compactados (.ZIP)</span>
              </>
            )}
          </button>
          <span className="text-[10px] text-center text-slate-500 block">Após o download, extraia o arquivo e envie o conteúdo completo diretamente para o seu GitHub.</span>
        </div>
      </div>
    </div>
  );
}
