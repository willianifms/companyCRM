import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-2xl transition-all ${
      toast.type === 'error' ? 'bg-red-950/90 border-red-500/50 text-red-200' :
      toast.type === 'warning' ? 'bg-amber-950/90 border-amber-500/50 text-amber-200' :
      toast.type === 'info' ? 'bg-blue-950/90 border-blue-500/50 text-blue-200' :
      'bg-slate-900/90 border-emerald-500/50 text-emerald-200'
    }`}>
      {toast.type === 'error' ? <ShieldAlert size={18} /> : <CheckCircle2 size={18} />}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
}
