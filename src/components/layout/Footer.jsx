import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
      <span>GTM OS v1.5.0-desktop — Equipe Órbita Workspace Sincronizado. IBGE Cidades Ativo. Auditoria Unificada.</span>
      <div className="flex gap-6">
        <a href="#" className="hover:text-slate-300">Auditoria LGPD</a>
        <a href="#" className="hover:text-slate-300">Conformidade e Redundância Web DB</a>
      </div>
    </footer>
  );
}
