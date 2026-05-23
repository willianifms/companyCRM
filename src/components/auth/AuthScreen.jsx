import React from 'react';

export default function AuthScreen({
  authMode,
  setAuthMode,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  regName,
  setRegName,
  regEmail,
  setRegEmail,
  regPassword,
  setRegPassword,
  regRole,
  setRegRole,
  handleLogin,
  handleRegisterSubmit
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans p-4 selection:bg-indigo-500/30 relative animate-fadeIn">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 animate-pulse" />
        
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center font-black text-white text-2xl tracking-widest mx-auto shadow-lg">
            O
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">Órbita Workspace</h1>
          <p className="text-xs text-slate-400">Sistema Operacional de Vendas B2B Local (Sincronizado na Web)</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
              authMode === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button 
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
              authMode === 'register' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Criar Conta Órbita
          </button>
        </div>

        {authMode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold">E-mail Corporativo</label>
              <input 
                type="email" 
                required
                placeholder="Ex: seu-nome@gtm.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs outline-none focus:border-indigo-500 text-slate-200"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold">Senha de Acesso</label>
              <input 
                type="password" 
                required
                placeholder="Sua senha"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs outline-none focus:border-indigo-500 text-slate-200"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-xs transition-all shadow-lg"
            >
              Ingressar no Workspace Órbita
            </button>
            <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-lg text-center text-[10px] text-slate-500">
              Acesso Demo: <strong className="text-indigo-400">admin@gtm.com</strong> / senha: <strong className="text-indigo-400">admin</strong>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold">Seu Nome Completo</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Lucas Oliveira"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs outline-none focus:border-indigo-500 text-slate-200"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold">E-mail Corporativo</label>
              <input 
                type="email" 
                required
                placeholder="Ex: lucas@gtm.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs outline-none focus:border-indigo-500 text-slate-200"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold">Senha</label>
              <input 
                type="password" 
                required
                placeholder="Senha para login"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs outline-none focus:border-indigo-500 text-slate-200"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold">Função / Cargo</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs outline-none focus:border-indigo-500 text-slate-300"
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
              >
                <option value="SDR Hunter">SDR Hunter (Prospecção)</option>
                <option value="CDR Closer">CDR Closer (Fechamento)</option>
                <option value="Diretor de RevOps">Diretor de RevOps (Gestão)</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-xs transition-all shadow-lg"
            >
              Solicitar Registro & Criar Conta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
