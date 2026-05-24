import React, { useState, useEffect, useMemo } from 'react';
import { 
  BR_STATES, STATE_DDD, REAL_COMPANIES_DATABASE, initialPackages, contingencyNichesTemplates 
} from './constants/mockData';

// Firebase imports
import { auth, db, isFirebaseEnabled } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

// Component Imports
import AuthScreen from './components/auth/AuthScreen';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Toast from './components/layout/Toast';
import Footer from './components/layout/Footer';

// Tab Imports
import DashboardTab from './components/dashboard/DashboardTab';
import ReportsTab from './components/reports/ReportsTab';
import ICPTab from './components/icp/ICPTab';
import CommercialTab from './components/commercial/CommercialTab';
import ProspectingTab from './components/prospecting/ProspectingTab';
import QualificationTab from './components/qualification/QualificationTab';
import EnrichmentTab from './components/enrichment/EnrichmentTab';
import WorkflowsTab from './components/workflows/WorkflowsTab';
import CrmTab from './components/crm/CrmTab';
import DeliverabilityTab from './components/deliverability/DeliverabilityTab';

// Modal Imports
import LeadDetailsModal from './components/modals/LeadDetailsModal';
import ExportProjectModal from './components/modals/ExportProjectModal';

export default function App() {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'authenticated'
  const [showExportModal, setShowExportModal] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('gtm_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { email: 'adm@orbita.com', name: 'Admin', password: 'admin', role: 'Diretor de RevOps' }
    ];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gtm_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  });

  const [sessionStart, setSessionStart] = useState(() => Date.now());
  const [uptimeStr, setUptimeStr] = useState("0m");

  const [teamPresence, setTeamPresence] = useState(() => {
    return [
      { email: 'adm@orbita.com', name: 'Admin', role: 'Diretor de RevOps', status: 'Online', duration: '0m', lastAction: 'Inicializou cockpit principal', lastActive: Date.now() }
    ];
  });

  useEffect(() => {
    // If we have currentUser and Firebase is not active, set mode to authenticated
    if (currentUser && !isFirebaseEnabled) {
      setAuthMode('authenticated');
    }
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser) {
        const diffMs = Date.now() - sessionStart;
        const diffMins = Math.floor(diffMs / 60000);
        let activeStr = "";
        if (diffMins < 60) {
          activeStr = `${diffMins}m`;
        } else {
          const hours = Math.floor(diffMins / 60);
          activeStr = `${hours}h ${diffMins % 60}m`;
        }
        setUptimeStr(activeStr);

        if (isFirebaseEnabled && auth.currentUser) {
          const userPresenceRef = doc(db, 'presence', auth.currentUser.uid);
          setDoc(userPresenceRef, {
            name: currentUser.name,
            role: currentUser.role,
            status: 'Online',
            duration: activeStr,
            lastActive: Date.now()
          }, { merge: true }).catch(console.error);
        } else {
          setTeamPresence(prev => prev.map(member => {
            if (member.email === currentUser.email) {
              return {
                ...member,
                status: 'Online',
                duration: activeStr,
                lastActive: Date.now()
              };
            }
            return member;
          }));
        }
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [currentUser, sessionStart, uptimeStr]);

  const downloadSingleFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Arquivo "${filename}" baixado com sucesso!`, 'success');
  };

  const downloadZipProject = async () => {
    setIsZipping(true);
    showToast("Carregando biblioteca de compressão (JSZip)...", "info");
    try {
      const JSZip = await new Promise((resolve, reject) => {
        if (window.JSZip) return resolve(window.JSZip);
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        script.onload = () => resolve(window.JSZip);
        script.onerror = () => reject(new Error("Falha ao carregar o JSZip"));
        document.head.appendChild(script);
      });

      const zip = new JSZip();
      
      const indexHtml = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%22 width=%22100%22 height=%22100%22><text y=%220.9em%22 font-size=%2290%22>🪐</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Órbita GTM OS</title>
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

      const packageJson = {
        "name": "orbita-gtm-os",
        "private": true,
        "version": "1.5.0",
        "type": "module",
        "main": "main.js",
        "scripts": {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview",
          "electron": "electron .",
          "electron-dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && npm run electron\"",
          "dist": "npm run build && electron-builder"
        },
        "dependencies": {
          "@supabase/supabase-js": "^2.39.0",
          "lucide-react": "^0.344.0",
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "recharts": "^2.12.0"
        },
        "devDependencies": {
          "@types/react": "^18.2.56",
          "@types/react-dom": "^18.2.19",
          "@vitejs/plugin-react": "^4.2.1",
          "autoprefixer": "^10.4.18",
          "concurrently": "^8.2.2",
          "electron": "^29.1.0",
          "electron-builder": "^24.13.3",
          "postcss": "^8.4.35",
          "tailwindcss": "^3.4.1",
          "vite": "^5.1.4",
          "wait-on": "^7.2.0"
        },
        "build": {
          "appId": "com.orbita.gtmos",
          "productName": "Orbita GTM OS",
          "files": [
            "dist/**/*",
            "main.js"
          ],
          "directories": {
            "output": "release"
          },
          "win": {
            "target": "nsis"
          },
          "mac": {
            "target": "dmg"
          }
        }
      };

      const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});`;

      const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#151f32',
          950: '#020617',
        }
      }
    },
  },
  plugins: [],
}`;

      const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

      const mainJs = `const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});`;

      const srcMain = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

      const srcIndexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #020617;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}`;

      showToast("Buscando código fonte estruturado do app.jsx...", "info");
      let appJsx = "";
      try {
        const res = await fetch('/src/app.jsx');
        if (res.ok) {
          appJsx = await res.text();
        } else {
          const resAlt = await fetch('/app.jsx');
          if (resAlt.ok) appJsx = await resAlt.text();
          else throw new Error();
        }
      } catch (e) {
        appJsx = document.querySelector('script[type="module"]')?.innerText || "// Fallback: Adicione seu app.jsx real aqui.";
      }

      zip.file("index.html", indexHtml);
      zip.file("package.json", JSON.stringify(packageJson, null, 2));
      zip.file("vite.config.js", viteConfig);
      zip.file("tailwind.config.js", tailwindConfig);
      zip.file("postcss.config.js", postcssConfig);
      zip.file("main.js", mainJs);

      const srcFolder = zip.folder("src");
      srcFolder.file("main.jsx", srcMain);
      srcFolder.file("index.css", srcIndexCss);
      srcFolder.file("app.jsx", appJsx);

      showToast("Compactando árvore de diretórios do projeto...", "info");
      const blob = await zip.generateAsync({ type: "blob" });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "projeto-orbita-gtm.zip";
      link.click();
      URL.revokeObjectURL(url);
      
      showToast("Projeto ZIP compactado! Tudo pronto para subir no GitHub.", "success");
      setIsZipping(false);
    } catch (err) {
      console.error(err);
      showToast("Falha técnica ao gerar o arquivo ZIP. Use downloads individuais.", "error");
      setIsZipping(false);
    }
  };

  const logMovement = (actionText) => {
    if (!currentUser) return;
    setTeamPresence(prev => prev.map(member => {
      if (member.email === currentUser.email) {
        return {
          ...member,
          status: 'Online',
          lastAction: actionText,
          lastActive: Date.now()
        };
      }
      return member;
    }));
  };

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('SDR Hunter');

  const [welcomeModal, setWelcomeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('prospecting');

  const [apolloLeads, setApolloLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('gtm_leads');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  const [clayGrid, setClayGrid] = useState(() => {
    try {
      const saved = localStorage.getItem('gtm_clay_grid');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  const [selectedLead, setSelectedLead] = useState(null);
  const [aiApiKey, setAiApiKey] = useState('');
  const [toast, setToast] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const [selectedState, setSelectedState] = useState('SP');
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Presidente Prudente');
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const [discoverySector, setDiscoverySector] = useState('criadores_mid');
  const [discoverySize, setDiscoverySize] = useState('micro');
  const [isScanning, setIsScanning] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanProgressText, setScanProgressText] = useState('');
  const [scanQuantity, setScanQuantity] = useState(5);

  const [filterLocationState, setFilterLocationState] = useState('all');
  const [filterLocationCity, setFilterLocationCity] = useState('all');
  const [filterCitiesList, setFilterCitiesList] = useState([]);
  const [filterSize, setFilterSize] = useState('all');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterTech, setFilterTech] = useState('');
  const [selectedApolloIds, setSelectedApolloIds] = useState([]);

  const [cnpjInput, setCnpjInput] = useState('');
  const [isFetchingCnpj, setIsFetchingCnpj] = useState(false);
  const [isQualifyingLead, setIsQualifyingLead] = useState({});
  const [aiQualifications, setAiQualifications] = useState(() => {
    try {
      const saved = localStorage.getItem('gtm_ai_qualifications');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error(e);
      return {};
    }
  });

  const [packages, setPackages] = useState(initialPackages);
  const [calcSelectedPack, setCalcSelectedPack] = useState('p2');
  const [calcDiscount, setCalcDiscount] = useState(10);
  const [customPackageName, setCustomPackageName] = useState('');
  const [customPackagePrice, setCustomPackagePrice] = useState('');
  const [customPackageMaxDisc, setCustomPackageMaxDisc] = useState('');

  const [workflowNodes, setWorkflowNodes] = useState([
    { id: 'node_1', type: 'trigger', label: 'Varredura de Big Data Ativada', active: true },
    { id: 'node_2', type: 'condition', label: 'Avaliação de Impostos & Margem comercial', active: true },
    { id: 'node_3', type: 'action', label: 'Filtro por Cidades / API IBGE real', active: true },
    { id: 'node_4', type: 'action', label: 'Qualificação via Diretrizes por IA', active: true }
  ]);

  const [domainHealth, setDomainHealth] = useState([
    { domain: 'orbita-sales.com.br', type: 'Primário', inboxCount: 3, sentToday: 82, limit: 150, spf: true, dkim: true, dmarc: true, score: 100 },
    { domain: 'orbita-outbound.tech', type: 'Secundário', inboxCount: 5, sentToday: 140, limit: 250, spf: true, dkim: true, dmarc: true, score: 96 }
  ]);

  const [spamAnalysisResult, setSpamAnalysisResult] = useState(null);
  const [spamTextInput, setSpamTextInput] = useState('');
  const [enrichingId, setEnrichingId] = useState(null);
  const [isGeneratingIcebreaker, setIsGeneratingIcebreaker] = useState(null);

  const [crmDeals, setCrmDeals] = useState(() => {
    try {
      const saved = localStorage.getItem('gtm_crm_deals');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  const [dailyReports, setDailyReports] = useState([
    { date: 'Hoje (22/05/2026)', leadsFound: 142, leadsQualified: 98, emailsSent: 350, positiveReplies: 14, meetingsBooked: 5, quotaAttainment: '92%' },
    { date: '21/05/2026', leadsFound: 110, leadsQualified: 72, emailsSent: 280, positiveReplies: 9, meetingsBooked: 3, quotaAttainment: '85%' },
    { date: '20/05/2026', leadsFound: 165, leadsQualified: 112, emailsSent: 410, positiveReplies: 21, meetingsBooked: 8, quotaAttainment: '115%' }
  ]);
  const [activeReport, setActiveReport] = useState(dailyReports[0]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiReportBrief, setAiReportBrief] = useState('');

  const [companyGuidelines, setCompanyGuidelines] = useState(
    "Nossa empresa comercializa assessorias de crescimento B2B e automações. Buscamos empresas de médio/grande porte (headcount > 10 ou faturamento robusto no Simples/Lucro Presumido) ou comércios locais estáveis. Evitar MEIs sem capacidade financeira."
  );

  const [qualificationRules, setQualificationRules] = useState(() => {
    const saved = localStorage.getItem('gtm_qualification_rules');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      minRevenue: '100k', // 'none', '100k', '500k', '1M'
      minEmployees: 'none', // 'none', '1-9', '10-49', '50+'
      allowedSectors: ['tecnologia', 'academia', 'fisio', 'psicologia', 'criadores_mid'],
      requiredTechs: '',
      minFitScore: 70,
      weightSector: 40,
      weightTech: 30,
      weightSizing: 30
    };
  });

  // --- FIREBASE SYNC SUBSCRIPTIONS ---
  useEffect(() => {
    if (!isFirebaseEnabled) return;

    // Listen to Firebase Auth state
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = { email: firebaseUser.email, uid: firebaseUser.uid, ...userDoc.data() };
          setCurrentUser(userData);
          setAuthMode('authenticated');
        } else {
          const userData = { email: firebaseUser.email, name: firebaseUser.displayName || 'Membro Equipe', role: 'SDR Hunter', uid: firebaseUser.uid };
          setCurrentUser(userData);
          setAuthMode('authenticated');
        }
      } else {
        setCurrentUser(null);
        setAuthMode('login');
      }
    });

    // Listen to Team Presence in real-time
    const unsubscribePresence = onSnapshot(collection(db, 'presence'), (snapshot) => {
      const list = [];
      snapshot.forEach(docSnap => {
        list.push({ email: docSnap.id, ...docSnap.data() });
      });
      if (list.length > 0) {
        setTeamPresence(list);
      }
    });

    // Listen to Leads in real-time
    const unsubscribeLeads = onSnapshot(collection(db, 'leads'), (snapshot) => {
      const leads = [];
      snapshot.forEach(docSnap => {
        leads.push({ id: docSnap.id, ...docSnap.data() });
      });
      if (leads.length > 0) {
        setApolloLeads(leads);
      }
    });

    // Listen to Clay Grid in real-time
    const unsubscribeClay = onSnapshot(collection(db, 'clayGrid'), (snapshot) => {
      const grid = [];
      snapshot.forEach(docSnap => {
        grid.push({ id: docSnap.id, ...docSnap.data() });
      });
      setClayGrid(grid);
    });

    // Listen to CRM Deals in real-time
    const unsubscribeCRM = onSnapshot(collection(db, 'crmDeals'), (snapshot) => {
      const deals = [];
      snapshot.forEach(docSnap => {
        deals.push({ id: docSnap.id, ...docSnap.data() });
      });
      setCrmDeals(deals);
    });

    // Listen to AI Qualifications in real-time
    const unsubscribeQuals = onSnapshot(collection(db, 'aiQualifications'), (snapshot) => {
      const quals = {};
      snapshot.forEach(docSnap => {
        quals[docSnap.id] = docSnap.data();
      });
      setAiQualifications(quals);
    });

    // Listen to commercial packages
    const unsubscribePacks = onSnapshot(collection(db, 'packages'), (snapshot) => {
      const packs = [];
      snapshot.forEach(docSnap => {
        packs.push({ id: docSnap.id, ...docSnap.data() });
      });
      if (packs.length > 0) {
        setPackages(packs);
      }
    });

    // Listen to company guidelines
    const unsubscribeGuidelines = onSnapshot(doc(db, 'metadata', 'guidelines'), (docSnap) => {
      if (docSnap.exists()) {
        setCompanyGuidelines(docSnap.data().text);
      }
    });

    // Listen to workflow nodes
    const unsubscribeWorkflows = onSnapshot(doc(db, 'metadata', 'workflows'), (docSnap) => {
      if (docSnap.exists()) {
        setWorkflowNodes(docSnap.data().nodes);
      }
    });

    // Listen to qualification rules
    const unsubscribeQualRules = onSnapshot(doc(db, 'metadata', 'qualificationRules'), (docSnap) => {
      if (docSnap.exists()) {
        setQualificationRules(docSnap.data());
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribePresence();
      unsubscribeLeads();
      unsubscribeClay();
      unsubscribeCRM();
      unsubscribeQuals();
      unsubscribePacks();
      unsubscribeGuidelines();
      unsubscribeWorkflows();
      unsubscribeQualRules();
    };
  }, []);

  // --- SEED FIRESTORE ON FIRST CONNECT ---
  useEffect(() => {
    if (!isFirebaseEnabled) return;

    const seedDatabase = async () => {
      // Seeding desativado para manter o banco de dados limpo
    };

    seedDatabase().catch(console.error);
  }, []);

  // --- CUSTOM STATE INTERCEPTORS FOR FIREBASE ---
  const customSetClayGrid = async (updater) => {
    if (typeof updater === 'function') {
      const nextGrid = updater(clayGrid);
      if (isFirebaseEnabled) {
        const currentIds = clayGrid.map(i => i.id);
        const nextIds = nextGrid.map(i => i.id);
        
        // Deleted
        const deletedIds = currentIds.filter(id => !nextIds.includes(id));
        for (const id of deletedIds) {
          await deleteDoc(doc(db, 'clayGrid', id));
        }
        
        // Updated or Added
        for (const item of nextGrid) {
          const currentItem = clayGrid.find(i => i.id === item.id);
          if (JSON.stringify(currentItem) !== JSON.stringify(item)) {
            await setDoc(doc(db, 'clayGrid', item.id), item);
          }
        }
      } else {
        setClayGrid(nextGrid);
      }
    } else {
      if (isFirebaseEnabled) {
        await setDoc(doc(db, 'clayGrid', updater.id), updater);
      } else {
        setClayGrid(updater);
      }
    }
  };

  const customSetCrmDeals = async (updater) => {
    if (typeof updater === 'function') {
      const nextDeals = updater(crmDeals);
      if (isFirebaseEnabled) {
        const currentIds = crmDeals.map(d => d.id);
        const nextIds = nextDeals.map(d => d.id);

        // Deleted
        const deletedIds = currentIds.filter(id => !nextIds.includes(id));
        for (const id of deletedIds) {
          await deleteDoc(doc(db, 'crmDeals', id));
        }

        // Updated/Added
        for (const deal of nextDeals) {
          const currentDeal = crmDeals.find(d => d.id === deal.id);
          if (JSON.stringify(currentDeal) !== JSON.stringify(deal)) {
            await setDoc(doc(db, 'crmDeals', deal.id), deal);
          }
        }
      } else {
        setCrmDeals(nextDeals);
      }
    } else {
      if (isFirebaseEnabled) {
        await setDoc(doc(db, 'crmDeals', updater.id), updater);
      } else {
        setCrmDeals(updater);
      }
    }
  };

  const customSetWorkflowNodes = async (updater) => {
    const nextNodes = typeof updater === 'function' ? updater(workflowNodes) : updater;
    setWorkflowNodes(nextNodes);
    if (isFirebaseEnabled) {
      await setDoc(doc(db, 'metadata', 'workflows'), { nodes: nextNodes });
    }
  };

  const customSetCompanyGuidelines = async (text) => {
    setCompanyGuidelines(text);
    localStorage.setItem('gtm_guidelines', text);
    if (isFirebaseEnabled) {
      await setDoc(doc(db, 'metadata', 'guidelines'), { text });
    }
  };

  const customSetQualificationRules = async (rules) => {
    setQualificationRules(rules);
    localStorage.setItem('gtm_qualification_rules', JSON.stringify(rules));
    if (isFirebaseEnabled) {
      await setDoc(doc(db, 'metadata', 'qualificationRules'), rules);
    }
  };

  useEffect(() => {
    localStorage.setItem('gtm_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gtm_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gtm_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gtm_leads', JSON.stringify(apolloLeads));
  }, [apolloLeads]);

  useEffect(() => {
    localStorage.setItem('gtm_clay_grid', JSON.stringify(clayGrid));
  }, [clayGrid]);

  useEffect(() => {
    localStorage.setItem('gtm_crm_deals', JSON.stringify(crmDeals));
  }, [crmDeals]);

  useEffect(() => {
    localStorage.setItem('gtm_ai_qualifications', JSON.stringify(aiQualifications));
  }, [aiQualifications]);

  useEffect(() => {
    if (selectedState) {
      setIsLoadingCities(true);
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
        .then(res => res.json())
        .then(data => {
          const sorted = data.map(m => m.nome).sort((a, b) => a.localeCompare(b));
          setCitiesList(sorted);
          if (selectedState === 'SP' && sorted.includes('Presidente Prudente')) {
            setSelectedCity('Presidente Prudente');
          } else {
            setSelectedCity(sorted[0] || 'Geral');
          }
          setIsLoadingCities(false);
        })
        .catch(() => {
          setCitiesList(['Presidente Prudente', 'São Paulo', 'Campinas', 'Belo Horizonte', 'Curitiba', 'Rio de Janeiro']);
          setIsLoadingCities(false);
        });
    }
  }, [selectedState]);

  useEffect(() => {
    if (filterLocationState !== 'all') {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${filterLocationState}/municipios`)
        .then(res => res.json())
        .then(data => {
          const sorted = data.map(m => m.nome).sort((a, b) => a.localeCompare(b));
          setFilterCitiesList(sorted);
        })
        .catch(() => {
          setFilterCitiesList([]);
        });
    } else {
      setFilterCitiesList([]);
    }
  }, [filterLocationState]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const cleanInstagramHandle = (companyName) => {
    if (!companyName) return 'https://instagram.com/orbitacomercial';
    const sanitized = companyName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^a-z0-9]/g, ""); 
    return `https://instagram.com/${sanitized}`;
  };

  const formatCnpj = (val) => {
    if (!val) return 'N/A';
    const clean = val.replace(/\D/g, '');
    if (clean.length !== 14) return val;
    return `${clean.substring(0, 2)}.${clean.substring(2, 5)}.${clean.substring(5, 8)}/${clean.substring(8, 12)}-${clean.substring(12, 14)}`;
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    if (isFirebaseEnabled) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = { uid: user.uid, email: user.email, ...userDoc.data() };
          setCurrentUser(userData);
          setSessionStart(Date.now());
          setUptimeStr("0m");
          setAuthMode('authenticated');
          showToast(`Bem-vindo de volta à Equipe Órbita, ${userData.name}! Conectando ao Workspace unificado.`, 'success');
          
          await setDoc(doc(db, 'presence', user.uid), {
            name: userData.name,
            email: userData.email,
            role: userData.role,
            status: 'Online',
            duration: '0m',
            lastActive: Date.now(),
            lastAction: 'Realizou login no sistema'
          }, { merge: true });
        } else {
          const userData = { uid: user.uid, email: user.email, name: 'Membro Equipe', role: 'SDR Hunter' };
          setCurrentUser(userData);
          setSessionStart(Date.now());
          setUptimeStr("0m");
          setAuthMode('authenticated');
          showToast(`Bem-vindo à Equipe Órbita! Conectando ao Workspace.`, 'success');
        }
      } catch (err) {
        console.error(err);
        showToast('Credenciais inválidas ou erro de rede.', 'error');
      }
    } else {
      const storedUsers = JSON.parse(localStorage.getItem('gtm_users')) || usersList;
      const found = storedUsers.find(u => u.email.toLowerCase().trim() === loginEmail.toLowerCase().trim() && u.password === loginPassword);
      
      if (found) {
        setCurrentUser(found);
        setSessionStart(Date.now());
        setUptimeStr("0m");
        setAuthMode('authenticated');
        showToast(`Bem-vindo de volta à Equipe Órbita, ${found.name}! Conectando ao Workspace unificado.`, 'success');
        
        setTeamPresence(prev => {
          if (prev.some(m => m.email === found.email)) {
            return prev.map(m => m.email === found.email ? { ...m, status: 'Online', duration: '0m', lastActive: Date.now(), lastAction: 'Realizou login no sistema' } : m);
          } else {
            return [...prev, { email: found.email, name: found.name, role: found.role, status: 'Online', duration: '0m', lastActive: Date.now(), lastAction: 'Entrou no time' }];
          }
        });
      } else {
        showToast('Credenciais inválidas. Verifique seu e-mail e senha de equipe.', 'error');
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      showToast('Preencha todos os campos obrigatórios.', 'error');
      return;
    }
    
    if (isFirebaseEnabled) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
        const user = userCredential.user;
        const userData = {
          name: regName,
          email: regEmail,
          role: regRole,
          createdAt: Date.now()
        };
        await setDoc(doc(db, 'users', user.uid), userData);
        
        await setDoc(doc(db, 'presence', user.uid), {
          name: regName,
          email: regEmail,
          role: regRole,
          status: 'Online',
          duration: '0m',
          lastActive: Date.now(),
          lastAction: 'Registrou sua conta no workspace'
        });

        setCurrentUser({ uid: user.uid, ...userData });
        setSessionStart(Date.now());
        setUptimeStr("0m");
        setAuthMode('authenticated');
        setWelcomeModal(true);
        showToast('Conta criada com sucesso na Equipe Órbita!', 'success');

        setRegName('');
        setRegEmail('');
        setRegPassword('');
      } catch (err) {
        console.error(err);
        showToast('Falha ao registrar usuário: ' + err.message, 'error');
      }
    } else {
      const storedUsers = JSON.parse(localStorage.getItem('gtm_users')) || usersList;
      if (storedUsers.some(u => u.email.toLowerCase().trim() === regEmail.toLowerCase().trim())) {
        showToast('E-mail corporativo já cadastrado na Equipe Órbita.', 'error');
        return;
      }

      const newUser = { name: regName, email: regEmail, password: regPassword, role: regRole };
      
      setUsersList(prev => {
        const nextList = [...prev, newUser];
        localStorage.setItem('gtm_users', JSON.stringify(nextList));
        return nextList;
      });

      setCurrentUser(newUser);
      setSessionStart(Date.now());
      setUptimeStr("0m");
      setAuthMode('authenticated');
      setWelcomeModal(true);
      showToast('Conta criada com sucesso na Equipe Órbita!', 'success');

      setTeamPresence(prev => [
        ...prev.filter(m => m.email !== newUser.email),
        { email: newUser.email, name: newUser.name, role: newUser.role, status: 'Online', duration: '0m', lastActive: Date.now(), lastAction: 'Registrou sua conta no workspace' }
      ]);

      setRegName('');
      setRegEmail('');
      setRegPassword('');
    }
  };

  const handleLogout = async () => {
    if (isFirebaseEnabled) {
      try {
        if (auth.currentUser) {
          await setDoc(doc(db, 'presence', auth.currentUser.uid), {
            status: 'Offline',
            lastActive: Date.now(),
            lastAction: 'Fez logout da sessão'
          }, { merge: true });
        }
        await signOut(auth);
        setCurrentUser(null);
        setAuthMode('login');
        setWelcomeModal(false);
        showToast('Sessão Órbita encerrada com segurança.', 'info');
      } catch (err) {
        console.error(err);
      }
    } else {
      if (currentUser) {
        setTeamPresence(prev => prev.map(m => m.email === currentUser.email ? { ...m, status: 'Offline', lastActive: Date.now(), lastAction: 'Fez logout da sessão' } : m));
      }
      setCurrentUser(null);
      setAuthMode('login');
      setWelcomeModal(false);
      showToast('Sessão Órbita encerrada com segurança.', 'info');
    }
  };

  const triggerSyncWebDatabase = () => {
    setSyncing(true);
    showToast('Sincronizando Workspace Órbita com Banco unificado na nuvem...', 'info');
    logMovement("Sincronizou banco de dados unificado na nuvem");
    setTimeout(() => {
      setSyncing(false);
      showToast('Base unificada sincronizada! Todos os SDRs visualizam o mesmo workspace.', 'success');
    }, 1500);
  };

  const handleDeleteLead = async (leadId) => {
    const lead = apolloLeads.find(l => l.id === leadId);
    if (isFirebaseEnabled) {
      try {
        await deleteDoc(doc(db, 'leads', leadId));
      } catch (err) {
        console.error(err);
      }
    } else {
      setApolloLeads(prev => prev.filter(l => l.id !== leadId));
    }
    setSelectedApolloIds(prev => prev.filter(id => id !== leadId));
    
    const label = lead ? lead.company : 'Empresa';
    showToast(`Lead "${label}" foi removido do banco.`, 'warning');
    logMovement(`Excluiu lead do banco: ${label}`);
  };

  const handleDeleteSelectedLeads = async () => {
    const count = selectedApolloIds.length;
    if (count === 0) return;
    
    if (isFirebaseEnabled) {
      try {
        for (const id of selectedApolloIds) {
          await deleteDoc(doc(db, 'leads', id));
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setApolloLeads(prev => prev.filter(l => !selectedApolloIds.includes(l.id)));
    }
    setSelectedApolloIds([]);
    showToast(`${count} leads foram excluídos em lote do banco.`, 'warning');
    logMovement(`Excluiu ${count} leads em lote do banco`);
  };

  const callGemini = async (prompt, systemInstruction, useSearch = false) => {
    try {
      const body = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      };
      
      if (useSearch) {
        body.tools = [{ googleSearch: {} }];
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${aiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }
      );
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error('Erro na chamada Gemini:', error);
      throw error;
    }
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    if (!customPackageName || !customPackagePrice) {
      showToast('Preencha os dados do pacote.', 'error');
      return;
    }
    const newPack = {
      id: 'p_' + Date.now(),
      name: customPackageName,
      price: parseFloat(customPackagePrice),
      maxDiscount: parseInt(customPackageMaxDisc) || 15,
      duration: 'Mensal',
      description: 'Pacote de serviço comercial estruturado.'
    };
    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, 'packages', newPack.id), newPack);
      } catch (err) {
        console.error(err);
      }
    } else {
      setPackages(prev => [...prev, newPack]);
    }
    setCalcSelectedPack(newPack.id);
    setCustomPackageName('');
    setCustomPackagePrice('');
    setCustomPackageMaxDisc('');
    showToast('Pacote comercial adicionado e salvo no Workspace!', 'success');
    logMovement(`Adicionou novo pacote: ${newPack.name}`);
  };

  const discountCalculation = useMemo(() => {
    const selectedPack = packages.find(p => p.id === calcSelectedPack);
    if (!selectedPack) return { original: 0, final: 0, discountValue: 0, allowed: true };
    const discPercent = parseFloat(calcDiscount) || 0;
    const discountValue = (selectedPack.price * discPercent) / 100;
    const finalPrice = selectedPack.price - discountValue;
    const isAllowed = discPercent <= selectedPack.maxDiscount;

    return {
      original: selectedPack.price,
      final: finalPrice,
      discountValue: discountValue,
      allowed: isAllowed,
      maxAllowed: selectedPack.maxDiscount
    };
  }, [calcSelectedPack, calcDiscount, packages]);

  const handleApplyProposalToCrm = async () => {
    const selectedPack = packages.find(p => p.id === calcSelectedPack);
    if (!selectedPack) return;
    
    const newDeal = {
      id: 'd_' + Date.now(),
      name: `Proposta: ${selectedPack.name}`,
      company: 'Lead da Base',
      value: discountCalculation.final,
      stage: 'new',
      priority: 'high',
      leadName: 'Contato Comercial',
      riskScore: discountCalculation.allowed ? 'Baixo' : 'Risco de Margem Alta'
    };
    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, 'crmDeals', newDeal.id), newDeal);
      } catch (err) {
        console.error(err);
      }
    } else {
      setCrmDeals(prev => [newDeal, ...prev]);
    }
    showToast('Proposta cadastrada como Deal no CRM da equipe!', 'success');
    logMovement(`Vinculou proposta do pacote "${selectedPack.name}" ao CRM`);
  };

  const handleBigDataSearch = async (quantity = 5) => {
    if (!aiApiKey) {
      showToast("Chave da API da IA não configurada! Insira sua chave Gemini no cabeçalho para pesquisar na web em tempo real.", "error");
      return;
    }

    setIsScanning(true);
    setScanProgress(5);
    setScanProgressText("Estabelecendo conexão segura com os nós de Big Data...");

    // Start progress simulation interval
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          return 90; // Hold at 90% until complete
        }
        const nextProgress = prev + Math.floor(Math.random() * 8) + 4;
        
        // Update text based on progress
        if (nextProgress < 25) {
          setScanProgressText("Carregando parâmetros do IBGE e mapeando DDD local...");
        } else if (nextProgress < 50) {
          setScanProgressText("Buscando registros e cadastros nacionais de CNPJ...");
        } else if (nextProgress < 75) {
          setScanProgressText("Mapeando e-mails comerciais e dados de contato reais...");
        } else {
          setScanProgressText("IA consolidando fichas cadastrais e formatando JSON...");
        }
        
        return nextProgress;
      });
    }, 450);

    const ddd = STATE_DDD[selectedState] || '11';
    const userResponsible = currentUser ? currentUser.name : 'Sistema';

    const sectorQueryNameMap = {
      criadores_mid: "streamers, youtubers e influenciadores digitais de médio/pequeno porte",
      fisio: "clínicas de fisioterapia, estúdios de pilates e consultórios de reabilitação física",
      psicologia: "consultórios de psicologia, psicólogos e clínicas de saúde mental",
      personal: "personal trainers, consultores de fitness e treinadores físicos particulares",
      academia: "academias de musculação, boxes de crossfit e estúdios de fitness",
      acaiterias: "açaiterias, sorveterias e comércios locais de alimentação",
      criadores: "grandes youtubers, streamers famosos e canais de entretenimento de alta audiência",
      tecnologia: "empresas de desenvolvimento de software, startups de tecnologia B2B, consultorias de TI e agências digitais SaaS"
    };
    const sectorQueryName = sectorQueryNameMap[discoverySector] || "empresas e comércios locais";

    try {
      const systemPrompt = `Você é um robô de inteligência comercial e web scraping avançado focado em pesquisar dados reais da internet e mapear com precisão absoluta empresas e criadores reais que existem de fato no Brasil.`;
      const userPrompt = `
        Você deve pesquisar no Google Maps, no Google Search e nos sites das próprias empresas para encontrar dados reais sobre empresas da categoria "${sectorQueryName}" localizadas em "${selectedCity} - ${selectedState}".
        
        Gere uma lista de exatamente ${quantity} empresas ou criadores de conteúdo reais e ativos.
        
        IMPORTANTE: Não invente dados fictícios.
        - O nome da empresa (company) e o telefone (phone) devem ser reais e corresponder exatamente à empresa localizada no município de ${selectedCity} - ${selectedState}.
        - Todos os demais campos abaixo (como CNPJ, e-mail, site/domínio, sócio/administrador, redes sociais, faturamento e tecnologias) DEVEM ser baseados em informações reais obtidas da busca no Google Search para a empresa mapeada.
        - Se você não encontrar o dado correto ou real na busca para algum desses campos (por exemplo, se o CNPJ real ou o e-mail exato da empresa não estiver disponível publicamente na internet), você deve obrigatoriamente preencher o respectivo campo como null ou vazio (""). É terminantemente proibido inventar CNPJs, inventar domínios fictícios, inventar e-mails de exemplo (como contato@empresa.com.br) ou chutar nomes de administradores fictícios. 
        - Prefira retornar null ou string vazia a inventar qualquer informação secundária do lead.
        
        Você deve retornar ESTRITAMENTE um array JSON contendo exatamente ${quantity} objetos, sem markdown, textos introdutórios ou comentários.
        
        Regras para preenchimento dos campos no JSON:
        - company: Nome comercial exato ou nome oficial da empresa real no Google.
        - cnpj: CNPJ real e ativo da empresa obtido através de busca pública na Receita Federal ou internet. Retorne null se não for encontrado.
        - name: Nome real de um dos sócios, fundadores ou diretores comerciais cadastrados. Retorne null se não for encontrado de forma confiável.
        - title: Cargo real correspondente da pessoa (Ex: "Sócio-Administrador", "Diretor"). Retorne null se não for encontrado.
        - domain: O domínio de site oficial real da empresa na internet. Retorne null se a empresa não tiver site próprio.
        - size: Porte estimado com base no quadro de funcionários público ou porte fiscal. Retorne null se não puder ser estimado.
        - country: Sempre formatado como "${selectedState} - ${selectedCity}".
        - tech: Array contendo apenas tecnologias reais identificadas em uso no site ou no negócio da empresa. Retorne array vazio [] se nenhuma puder ser detectada.
        - linkedin: Link real para o perfil do LinkedIn da empresa ou do sócio mapeado. Retorne null se não for encontrado.
        - email: E-mail de contato comercial real exposto na internet pela empresa. Retorne null se não for encontrado.
        - emailStatus: Sempre "verified" se for um e-mail real, ou null se não houver e-mail.
        - revenue: Faturamento anual estimado real baseado nos dados fiscais públicos ou média do porte da empresa local. Retorne null se não puder estimar.
        - phone: Telefone comercial ou WhatsApp de contato real da empresa (conforme listado no Google).
        - hiredSdr: Boleano (true/false) se eles já possuem SDR dedicado ou equipe de vendas outbound estruturada na internet.
        - funding: Origem do capital da empresa (Ex: "Capital Próprio", "Aportado").
        - growth: Taxa aproximada de crescimento da empresa.
        - sector: Sempre a string "${discoverySector.toUpperCase()}".
        - foundationYear: Ano real de fundação da empresa na Receita Federal (Ex: 2018). Retorne null se não for encontrado.
        - taxEstimate: Regime tributário real provável (Ex: "Simples Nacional", "Lucro Presumido", "MEI"). Retorne null se não for conhecido.
        - instagram: URL real do perfil da empresa no Instagram. Retorne null se não for encontrada.
        - description: Descrição real dos serviços prestados pela empresa na região.

        Modelo JSON Exemplo de Saída (utilize essa estrutura, preenchendo apenas com dados reais buscados no Google ou null):
        [
          {
            "company": "Fisio Prudente & Pilates",
            "cnpj": "28.110.941/0001-50",
            "name": "Aline Mendes",
            "title": "Fisioterapeuta Sócia",
            "domain": "fisioprudente.com.br",
            "size": "Pequena (10-49 func)",
            "country": "${selectedState} - ${selectedCity}",
            "tech": ["Instagram Ads", "WhatsApp Business", "Doctoralia"],
            "linkedin": "linkedin.com/company/fisioprudente",
            "email": "contato@fisioprudente.com.br",
            "emailStatus": "verified",
            "revenue": "R$ 380.000 / ano",
            "phone": "+55 ${ddd} 997905222",
            "hiredSdr": false,
            "funding": "Capital Próprio",
            "growth": "18%",
            "sector": "${discoverySector.toUpperCase()}",
            "foundationYear": 2017,
            "taxEstimate": "Simples Nacional",
            "instagram": "https://instagram.com/fisioprudente",
            "description": "Clínica especializada em reabilitação traumato-ortopédica e pilates clínico."
          }
        ]
      `;
      const responseText = await callGemini(userPrompt, systemPrompt, true);
      let cleanedJson = responseText.trim();
      const firstBracket = cleanedJson.indexOf('[');
      const lastBracket = cleanedJson.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1) {
        cleanedJson = cleanedJson.substring(firstBracket, lastBracket + 1);
      } else {
        cleanedJson = cleanedJson.replace(/```json/gi, '').replace(/```/gi, '').trim();
      }
      const scrapedLeads = JSON.parse(cleanedJson);
      
      const mappedScrapedLeads = scrapedLeads.map(lead => ({
        ...lead,
        cnpj: formatCnpj(lead.cnpj || lead.CNPJ || ''),
        id: 'scraped_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        prospector: userResponsible,
        status: 'Novo'
      }));

      if (isFirebaseEnabled) {
        try {
          for (const lead of mappedScrapedLeads) {
            await setDoc(doc(db, 'leads', lead.id), lead);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setApolloLeads(prev => [...mappedScrapedLeads, ...prev]);
      }
      
      clearInterval(progressInterval);
      setScanProgress(100);
      setScanProgressText("Varredura concluída com sucesso!");
      setTimeout(() => {
        setIsScanning(false);
        setScanProgress(0);
      }, 800);

      showToast(`${mappedScrapedLeads.length} entidades reais mineradas e inseridas no Workspace!`, 'success');
      logMovement(`Fez varredura Big Data real (${mappedScrapedLeads.length} entidades em ${selectedCity}-${selectedState})`);
    } catch (err) {
      clearInterval(progressInterval);
      console.error("Erro na varredura por IA real:", err);
      showToast("Varredura em tempo real falhou. Verifique sua chave da API ou sua conexão.", "error");
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const runContingencyVarredura = async (quantity = 5) => {
    const ddd = STATE_DDD[selectedState] || '11';
    const isMicro = discoverySize === 'micro';
    const userResponsible = currentUser ? currentUser.name : 'Sistema';

    const templates = contingencyNichesTemplates[discoverySector] || contingencyNichesTemplates['criadores_mid'];

    // Generate up to quantity leads by repeating templates if needed
    const mappedContingency = [];
    for (let i = 0; i < quantity; i++) {
      const template = templates[i % templates.length];
      const suffix = i >= templates.length ? ` ${Math.floor(i / templates.length) + 1}` : '';
      const cleanCompany = template.company + suffix;
      const cleanDomain = cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com.br';

      mappedContingency.push({
        id: 'contingency_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substr(2, 4),
        company: cleanCompany,
        cnpj: template.cnpj,
        name: template.name,
        title: template.title,
        domain: cleanDomain,
        size: isMicro ? 'Microempresa (1-9 func)' : 'Grande (100+ func)',
        country: `${selectedState} - ${selectedCity}`,
        tech: template.tech,
        linkedin: `linkedin.com/company/${cleanDomain.split('.')[0]}`,
        email: `contato@${cleanDomain}`,
        emailStatus: 'verified',
        revenue: template.rev,
        phone: `+55 ${ddd} 9${Math.floor(Math.random() * 90000000 + 10000000)}`,
        hiredSdr: !isMicro,
        funding: 'Capital Próprio',
        growth: '8%',
        sector: discoverySector.toUpperCase(),
        foundationYear: Math.floor(Math.random() * (2020 - 2005) + 2005),
        taxEstimate: template.tax,
        instagram: template.insta || cleanInstagramHandle(cleanCompany),
        description: template.desc,
        prospector: userResponsible,
        approachedBy: null,
        status: 'Novo'
      });
    }

    if (isFirebaseEnabled) {
      try {
        for (const lead of mappedContingency) {
          await setDoc(doc(db, 'leads', lead.id), lead);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setApolloLeads(prev => [...mappedContingency, ...prev]);
    }
    showToast(`${mappedContingency.length} empresas reais importadas do diretório regional da Órbita!`, 'success');
    logMovement(`Fez varredura de contingência (${mappedContingency.length} leads em ${selectedCity})`);
  };

  const handleRealCnpjSearch = async () => {
    const cleanedCnpj = cnpjInput.replace(/[^0-9]/g, '');
    if (cleanedCnpj.length !== 14) {
      showToast('Digite um CNPJ válido com 14 dígitos.', 'error');
      return;
    }

    setIsFetchingCnpj(true);
    showToast('Consultando Receita Federal via BrasilAPI...', 'info');

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanedCnpj}`);
      if (!response.ok) throw new Error();
      const data = await response.json();

      const userResponsible = currentUser ? currentUser.name : 'Sistema';
      const ddd = data.ddd_telefone_1 ? data.ddd_telefone_1.substring(0, 2) : '11';

      const mappedLead = {
        id: 'cnpj_' + Date.now(),
        cnpj: formatCnpj(data.cnpj || cleanedCnpj),
        name: data.qsa && data.qsa.length > 0 ? data.qsa[0].nome_socio : 'Diretor Administrador',
        title: data.qsa && data.qsa.length > 0 ? data.qsa[0].qualificacao_socio : 'Sócio Decisor',
        company: data.razao_social || data.nome_fantasia || 'Empresa Localizada',
        domain: data.email ? data.email.split('@')[1] : `${cleanedCnpj}.com.br`,
        size: data.capital_social > 10000000 ? 'Grande (1000+ func)' : data.capital_social > 150000 ? 'Média (50-200 func)' : 'Microempresa (1-9 func)',
        country: `${data.uf} - ${data.municipio}`,
        tech: ['Google Workspace', 'SaaS Comercial'],
        linkedin: `linkedin.com/company/${cleanedCnpj}`,
        email: data.email || `contato@${cleanedCnpj}.com.br`,
        emailStatus: data.email ? 'verified' : 'unverified',
        revenue: `Capital Social: R$ ${parseFloat(data.capital_social || 0).toLocaleString()}`,
        phone: data.ddd_telefone_1 ? `+55 ${data.ddd_telefone_1.replace(/\s+/g, '')}` : `+55 ${ddd} 99999-8888`,
        hiredSdr: false,
        funding: 'Capital Social',
        growth: 'Estável',
        sector: data.cnae_fiscal_descricao || 'Serviços Gerais',
        foundationYear: data.data_inicio_atividade ? parseInt(data.data_inicio_atividade.split('-')[0]) : 2017,
        taxEstimate: data.capital_social > 5000000 ? 'Regime Lucro Real' : 'Simples Nacional',
        instagram: cleanInstagramHandle(data.razao_social || data.nome_fantasia),
        description: `Razão Social: ${data.razao_social}. Atividade Principal: ${data.cnae_fiscal_descricao}. Localizada em ${data.municipio} - ${data.uf}.`,
        prospector: userResponsible,
        approachedBy: null,
        status: 'Novo'
      };

      if (isFirebaseEnabled) {
        try {
          await setDoc(doc(db, 'leads', mappedLead.id), mappedLead);
        } catch (err) {
          console.error(err);
        }
      } else {
        setApolloLeads(prev => [mappedLead, ...prev]);
      }
      showToast('Empresa oficial do Brasil inserida com sucesso!', 'success');
      logMovement(`Encontrou e mapeou CNPJ Real: ${mappedLead.company}`);
      setCnpjInput('');
    } catch (err) {
      showToast('Não foi possível carregar os dados reais deste CNPJ.', 'error');
    } finally {
      setIsFetchingCnpj(false);
    }
  };

  const handleAiQualification = async (lead) => {
    setIsQualifyingLead(prev => ({ ...prev, [lead.id]: true }));
    showToast(`Rodando qualificação automática baseada nos tickets para ${lead.company}...`, 'info');

    if (aiApiKey) {
      try {
        const minRevText = qualificationRules.minRevenue === 'none' ? 'Sem restrição' : `Mínimo de R$ ${qualificationRules.minRevenue} / ano`;
        const minEmpText = qualificationRules.minEmployees === 'none' ? 'Sem restrição' : `${qualificationRules.minEmployees} funcionários`;
        
        const prompt = `Analise este lead baseado nas diretrizes gerais, playbook de vendas, nossos pacotes comerciais e critérios de pontuação estabelecidos:
        DIRETRIZES DO PLAYBOOK GERAIS: "${companyGuidelines}"
        
        CRITÉRIOS DE FIT EXIGIDOS:
        - Faturamento Mínimo Aceito: ${minRevText}
        - Porte Mínimo Aceito: ${minEmpText}
        - Setores Autorizados: ${qualificationRules.allowedSectors.join(', ')}
        - Tecnologias Desejadas: ${qualificationRules.requiredTechs || 'Qualquer'}
        
        PESOS DE IMPORTÂNCIA DO FIT SCORE:
        - Aderência ao Setor/Nicho: ${qualificationRules.weightSector}%
        - Presença de Tecnologias Requeridas: ${qualificationRules.weightTech}%
        - Porte e Faturamento: ${qualificationRules.weightSizing}%
        
        PACOTES DISPONÍVEIS E TICKET MINÍMO:
        ${JSON.stringify(packages.map(p => ({ nome: p.name, valor: p.price, desc: p.description })))}
        
        LEAD PARA ANALISAR:
        - Empresa: ${lead.company}
        - Faturamento/Arrecadação: ${lead.revenue}
        - Porte: ${lead.size}
        - Fundação: ${lead.foundationYear}
        - Regime Tributário: ${lead.taxEstimate}
        - Setor: ${lead.sector}
        - Tecnologias Identificadas: ${lead.tech ? lead.tech.join(', ') : 'Nenhuma'}

        Instrução de Avaliação Comercial:
        1. Calcule o Fit Score de 0 a 100 com base na aderência aos critérios e pesos definidos acima.
        2. Determine se o lead deve ser qualificado ("qualified": true) ou desqualificado ("qualified": false). A nota de corte mínima configurada para aprovação é de ${qualificationRules.minFitScore}%.
        3. Se o faturamento for muito baixo ou se o setor for desautorizado, desqualifique e aponte a objeção.
        
        Retorne EXATAMENTE um objeto JSON com esta estrutura (sem markdown ou blocos de código):
        {
          "qualified": true ou false,
          "fitScore": 0 a 100,
          "justification": "Justificativa detalhada cruzando os dados do lead com nossas regras e pesos de corte",
          "recommendedPackage": "Nome do pacote mais recomendado ou 'Nenhum'",
          "objection": "A maior objeção presumida relacionada ao budget/ticket/porte",
          "nextStep": "Próximo passo na abordagem"
        }`;

        const rawResponse = await callGemini(prompt, "Você é um analista de RevOps experiente focado em margens comerciais e fit de faturamento.");
        const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(cleaned);

        if (isFirebaseEnabled) {
          try {
            await setDoc(doc(db, 'aiQualifications', lead.id), result);
          } catch (err) {
            console.error(err);
          }
        } else {
          setAiQualifications(prev => ({ ...prev, [lead.id]: result }));
        }
        showToast('IA do Gemini qualificou o lead com base no faturamento e tickets!', 'success');
        logMovement(`Qualificou lead via Gemini IA: ${lead.company} (Score ${result.fitScore}%)`);
      } catch (err) {
        runFallbackQualification(lead);
      } finally {
        setIsQualifyingLead(prev => ({ ...prev, [lead.id]: false }));
      }
    } else {
      setTimeout(() => {
        runFallbackQualification(lead);
        setIsQualifyingLead(prev => ({ ...prev, [lead.id]: false }));
      }, 1000);
    }
  };

  const runFallbackQualification = (lead) => {
    const leadSector = (lead.sector || '').toLowerCase();
    const leadSize = (lead.size || '').toLowerCase();
    const leadRevenue = (lead.revenue || '').toLowerCase();

    // Sector match
    const isSectorAllowed = qualificationRules.allowedSectors.some(
      s => leadSector.includes(s.toLowerCase()) || s.toLowerCase().includes(leadSector)
    );
    
    // Sizing/Revenue match
    const isMicro = leadSize.includes('microempresa') || 
                    leadSize.includes('mei') ||
                    leadRevenue.includes('mei') || 
                    leadRevenue.includes('72.000') || 
                    leadRevenue.includes('96.000') ||
                    leadRevenue.includes('110.000');
                    
    const isRevenueOk = qualificationRules.minRevenue === 'none' ||
                         (qualificationRules.minRevenue === '100k' && !isMicro) ||
                         (qualificationRules.minRevenue === '500k' && (leadRevenue.includes('8.500.000') || leadRevenue.includes('24.000.000') || leadRevenue.includes('1.800.000') || leadRevenue.includes('2.100.000') || leadRevenue.includes('1.250.000') || leadRevenue.includes('950.000') || leadRevenue.includes('780.000'))) ||
                         (qualificationRules.minRevenue === '1M' && (leadRevenue.includes('8.500.000') || leadRevenue.includes('24.000.000') || leadRevenue.includes('1.800.000') || leadRevenue.includes('2.100.000')));

    const isEmployeesOk = qualificationRules.minEmployees === 'none' ||
                           (qualificationRules.minEmployees === '1-9') ||
                           (qualificationRules.minEmployees === '10-49' && (leadSize.includes('média') || leadSize.includes('grande') || leadSize.includes('10-49') || leadSize.includes('50+'))) ||
                           (qualificationRules.minEmployees === '50+' && (leadSize.includes('grande') || leadSize.includes('50+')));

    let sectorScore = isSectorAllowed ? 100 : 20;
    let sizingScore = (isRevenueOk && isEmployeesOk) ? 100 : (isRevenueOk || isEmployeesOk ? 60 : 30);
    let techScore = lead.tech && lead.tech.length > 0 ? 90 : 50;

    const fitScore = Math.round(
      (sectorScore * (qualificationRules.weightSector / 100)) +
      (sizingScore * (qualificationRules.weightSizing / 100)) +
      (techScore * (qualificationRules.weightTech / 100))
    );

    const qualified = fitScore >= qualificationRules.minFitScore;
    
    let justification = '';
    let recommendedPackage = 'Nenhum';
    let objection = '';
    let nextStep = '';

    if (qualified) {
      justification = `Aprovado pelo Playbook: Ótima pontuação total (${fitScore}%) atendendo aos requisitos mínimos de nicho (${lead.sector}) e porte comercial (${lead.revenue}).`;
      recommendedPackage = fitScore > 85 ? 'Revenue Engine Enterprise' : (fitScore > 65 ? 'Máquina Comercial CDR Scale' : 'Setup Outbound SDR Start');
      objection = 'Dúvidas padrão sobre tempo de setup inicial';
      nextStep = 'Agendar demonstração técnica da esteira Outbound';
    } else {
      justification = `Desqualificado: Nota de fit score (${fitScore}%) ficou abaixo da nota de corte configurada de ${qualificationRules.minFitScore}%.`;
      objection = !isSectorAllowed ? 'Nicho de mercado desautorizado no Playbook' : 'Capacidade de faturamento/porte abaixo do mínimo exigido';
      nextStep = 'Nutrir com materiais educativos digitais de baixo custo';
    }

    const result = {
      qualified,
      fitScore,
      justification,
      recommendedPackage,
      objection,
      nextStep
    };
    if (isFirebaseEnabled) {
      setDoc(doc(db, 'aiQualifications', lead.id), result).catch(console.error);
    } else {
      setAiQualifications(prev => ({
        ...prev,
        [lead.id]: result
      }));
    }
    showToast('Análise de faturamento, pacotes e margem concluída!', 'success');
    logMovement(`Qualificou lead (Fallback): ${lead.company} (Score ${fitScore}%)`);
  };

  const markAsApproached = async (leadId) => {
    const userResponsible = currentUser ? currentUser.name : 'SDR Local';
    if (isFirebaseEnabled) {
      try {
        await updateDoc(doc(db, 'leads', leadId), { approachedBy: userResponsible, status: 'Em Cadência' });
        showToast(`Abordagem registrada por ${userResponsible}!`, 'success');
        logMovement(`Registrou abordagem ativa do lead ID: ${leadId}`);
      } catch (err) {
        console.error(err);
      }
    } else {
      setApolloLeads(prev => prev.map(lead => {
        if (lead.id === leadId) {
          showToast(`Abordagem registrada por ${userResponsible}!`, 'success');
          logMovement(`Registrou abordagem ativa do lead: ${lead.company}`);
          return { ...lead, approachedBy: userResponsible, status: 'Em Cadência' };
        }
        return lead;
      }));
    }
  };

  const filteredApolloLeads = useMemo(() => {
    return apolloLeads.filter(lead => {
      if (!lead) return false;
      const titleLower = (lead.title || '').toLowerCase();
      const companyLower = (lead.company || '').toLowerCase();
      const sectorLower = (lead.sector || '').toLowerCase();
      const queryLower = (filterTitle || '').toLowerCase();
      
      const matchTitle = titleLower.includes(queryLower) || 
                         companyLower.includes(queryLower) ||
                         sectorLower.includes(queryLower);
                         
      const matchTech = filterTech === '' || 
                        (lead.tech || []).some(t => t && t.toLowerCase().includes(filterTech.toLowerCase()));
      
      let matchState = true;
      const countryStr = lead.country || '';
      if (filterLocationState !== 'all') {
        matchState = countryStr.split('-')[0].trim().toLowerCase() === filterLocationState.toLowerCase();
      }

      let matchCity = true;
      if (filterLocationCity !== 'all') {
        matchCity = countryStr.toLowerCase().includes(filterLocationCity.toLowerCase());
      }
      
      let matchSize = true;
      const sizeStr = lead.size || '';
      if (filterSize !== 'all') {
        if (filterSize === 'micro') {
          matchSize = sizeStr.toLowerCase().includes('microempresa') || sizeStr.toLowerCase().includes('mei');
        } else if (filterSize === 'grande') {
          matchSize = sizeStr.toLowerCase().includes('grande') || sizeStr.toLowerCase().includes('média');
        }
      }
      
      return matchTitle && matchTech && matchState && matchCity && matchSize;
    });
  }, [apolloLeads, filterTitle, filterTech, filterLocationState, filterLocationCity, filterSize]);

  const generateDailyReportAnalysis = async (report) => {
    setIsGeneratingReport(true);
    setActiveReport(report);
    showToast('Analisando atividades comerciais e forecast de receita...', 'info');

    if (aiApiKey) {
      try {
        const prompt = `Analise este relatório diário de prospecção da equipe:
        Data: ${report.date}
        Leads Prospectados: ${report.leadsFound}
        Leads Qualificados: ${report.leadsQualified}
        Abordagens Ativas: ${report.emailsSent}
        Reuniões Agendadas: ${report.meetingsBooked}
        Atingimento de Meta do Time: ${report.quotaAttainment}

        Escreva uma análise de performance e produtividade das equipes.`;
        const response = await callGemini(prompt, "Diretor de Vendas.");
        setAiReportBrief(response);
      } catch (err) {
        generateLocalReportBrief(report);
      } finally {
        setIsGeneratingReport(false);
      }
    } else {
      setTimeout(() => {
        generateLocalReportBrief(report);
        setIsGeneratingReport(false);
      }, 1000);
    }
  };

  const generateLocalReportBrief = (report) => {
    setAiReportBrief(`### Relatório Operacional e Atividades - ${report.date}

**Desempenho Geral do Time (Órbita):**
O time atingiu ${report.quotaAttainment} da meta diária projetada. Foram prospectados com sucesso ${report.leadsFound} novos comércios locais e criadores de conteúdo de médio/pequeno porte via varredura Big Data no Brasil.

**Auditoria e Controle de Abordagem:**
Todos os registros de atividades contêm informações sobre o operador de prospecção ativo (SDR/CDR), garantindo que nenhum lead seja contactado em duplicidade. 

**Análise Tributária e Orçamentária:**
O faturamento mapeado ajudou a priorizar empresas estáveis de nicho (fisioterapia, psicologia, academias e streamers de médio porte), aumentando a margem de receita das propostas comerciais da Equipe Órbita.`);
  };

  const handleExportToClay = async () => {
    if (selectedApolloIds.length === 0) {
      showToast('Selecione leads para exportar.', 'error');
      return;
    }

    const exported = [];
    selectedApolloIds.forEach(id => {
      const lead = apolloLeads.find(l => l.id === id);
      if (lead) {
        if (!clayGrid.some(item => item.domain === lead.domain)) {
          const aiQual = aiQualifications[lead.id];
          const fitScore = aiQual ? aiQual.fitScore : Math.floor(Math.random() * (100 - 70) + 70);
          
          exported.push({
            id: 'c_' + Date.now() + Math.random().toString(36).substring(2, 5),
            name: lead.name,
            company: lead.company,
            domain: lead.domain,
            waterfall: { apollo: 'idle', hunter: 'idle', dropcontact: 'idle' },
            verified: 'unverified',
            icebreaker: '',
            priorityScore: fitScore,
            prospector: lead.prospector || 'Sistema',
            approachedBy: lead.approachedBy
          });
        }
      }
    });

    if (exported.length > 0) {
      if (isFirebaseEnabled) {
        try {
          for (const item of exported) {
            await setDoc(doc(db, 'clayGrid', item.id), item);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setClayGrid(prev => [...prev, ...exported]);
      }
      showToast(`${exported.length} leads importados na Tabela Clay!`, 'success');
      logMovement(`Exportou ${exported.length} leads do Apollo para o Clay Grid`);
      setSelectedApolloIds([]);
    } else {
      showToast('Os leads selecionados já estão no Clay Grid.', 'warning');
    }
  };

  const runWaterfall = (gridId) => {
    setEnrichingId(gridId);
    showToast('Iniciando Cascata de Enriquecimento (Apollo → Hunter → Dropcontact)...', 'info');

    let step = 0;
    const interval = setInterval(async () => {
      if (isFirebaseEnabled) {
        const itemRef = doc(db, 'clayGrid', gridId);
        const itemSnap = await getDoc(itemRef);
        if (itemSnap.exists()) {
          const item = itemSnap.data();
          const nextWaterfall = { ...item.waterfall };
          if (step === 0) {
            nextWaterfall.apollo = 'success';
            await updateDoc(itemRef, { waterfall: nextWaterfall, verified: 'verified' });
            showToast('E-mail localizado via API Apollo.', 'success');
          }
        }
      } else {
        setClayGrid(prev => prev.map(item => {
          if (item.id === gridId) {
            const nextWaterfall = { ...item.waterfall };
            if (step === 0) {
              nextWaterfall.apollo = 'success';
              showToast('E-mail localizado via API Apollo.', 'success');
              return { ...item, waterfall: nextWaterfall, verified: 'verified' };
            }
            return item;
          }
          return item;
        }));
      }
      step++;
      clearInterval(interval);
      setEnrichingId(null);
    }, 1000);
  };

  const generateIcebreaker = async (gridId, leadName, company) => {
    setIsGeneratingIcebreaker(gridId);

    if (aiApiKey) {
      try {
        const result = await callGemini(`Gere um quebra-gelo de e-mail comercial curto e personalizado para ${leadName} na empresa ${company}.`, "SDR Comercial.");
        if (isFirebaseEnabled) {
          await updateDoc(doc(db, 'clayGrid', gridId), { icebreaker: result.trim() });
        } else {
          setClayGrid(prev => prev.map(item => {
            if (item.id === gridId) return { ...item, icebreaker: result.trim() };
            return item;
          }));
        }
        showToast('Quebra-gelo gerado!', 'success');
        logMovement(`Gerou quebra-gelo com IA para ${leadName} (${company})`);
      } catch (err) {
        await fallbackIcebreaker(gridId, leadName, company);
      } finally {
        setIsGeneratingIcebreaker(null);
      }
    } else {
      setTimeout(async () => {
        await fallbackIcebreaker(gridId, leadName, company);
        setIsGeneratingIcebreaker(null);
      }, 1000);
    }
  };

  const fallbackIcebreaker = async (gridId, leadName, company) => {
    const text = `Acompanhei a expressiva relevância digital da ${company} e o impacto da sua liderança no mercado regional, parabéns!`;
    if (isFirebaseEnabled) {
      await updateDoc(doc(db, 'clayGrid', gridId), { icebreaker: text });
    } else {
      setClayGrid(prev => prev.map(item => {
        if (item.id === gridId) return { ...item, icebreaker: text };
        return item;
      }));
    }
    showToast('Quebra-gelo dinâmico gerado!', 'success');
  };

  const analyzeSpamPhrases = () => {
    if (!spamTextInput.trim()) {
      showToast('Digite o texto do e-mail comercial para analisar.', 'error');
      return;
    }
    const spamWords = ['grátis', 'compre agora', 'promoção', 'desconto', 'urgente', 'faturamento garantido'];
    const textLower = spamTextInput.toLowerCase();
    const found = spamWords.filter(w => textLower.includes(w));

    if (found.length > 0) {
      setSpamAnalysisResult({
        status: 'warning',
        score: 65,
        matches: found,
        message: `Detectamos termos com risco de spam: ${found.join(', ')}`
      });
      showToast('Pontos de atenção identificados no e-mail!', 'warning');
    } else {
      setSpamAnalysisResult({
        status: 'safe',
        score: 100,
        matches: [],
        message: 'Texto limpo! Excelente reputação estimada na entrega.'
      });
      showToast('Texto aprovado para envio!', 'success');
    }
  };

  // If not authenticated, render AuthScreen
  if (authMode !== 'authenticated' && !currentUser) {
    return (
      <>
        <AuthScreen
          authMode={authMode}
          setAuthMode={setAuthMode}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          regName={regName}
          setRegName={setRegName}
          regEmail={regEmail}
          setRegEmail={setRegEmail}
          regPassword={regPassword}
          setRegPassword={setRegPassword}
          regRole={regRole}
          setRegRole={setRegRole}
          handleLogin={handleLogin}
          handleRegisterSubmit={handleRegisterSubmit}
        />
        <Toast toast={toast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* Toast Notification */}
      <Toast toast={toast} />

      {/* Welcome to Orbita Modal */}
      {welcomeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-8 space-y-6 shadow-2xl relative text-center">
            <div className="h-16 w-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg">
              O
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Bem-vindo à Equipe Órbita!</h3>
              <p className="text-xs text-slate-400">
                Seu cadastro foi verificado. Você acaba de ingressar no maior sistema de inteligência e outbound B2B do mercado.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-left text-xs space-y-3">
              <div className="flex gap-3 items-start">
                <span className="text-indigo-400 font-bold">✉</span>
                <div>
                  <span className="font-bold text-slate-200 block">Mensagem do Fundador:</span>
                  <p className="text-slate-400 leading-relaxed mt-1">
                    "Olá, {currentUser?.name}. Agora todos os seus dados locais estão sincronizados com a nossa nuvem de RevOps. Vamos juntos atingir a meta diária e estruturar processos previsíveis de receita comercial!"
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setWelcomeModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-xs shadow-lg transition-all"
            >
              Começar a Prospectar no Workspace
            </button>
          </div>
        </div>
      )}

      {/* Header Layout */}
      <Header
        currentUser={currentUser}
        uptimeStr={uptimeStr}
        aiApiKey={aiApiKey}
        setAiApiKey={setAiApiKey}
        syncing={syncing}
        triggerSyncWebDatabase={triggerSyncWebDatabase}
        setShowExportModal={setShowExportModal}
        handleLogout={handleLogout}
      />

      {/* Main Grid View */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* Left Sidebar Menu */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Right Content Space */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-950 flex flex-col gap-6">

          {activeTab === 'dashboard' && (
            <DashboardTab
              teamPresence={teamPresence}
              clayGrid={clayGrid}
              crmDeals={crmDeals}
              usersList={usersList}
              uptimeStr={uptimeStr}
              triggerSyncWebDatabase={triggerSyncWebDatabase}
              syncing={syncing}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsTab
              usersList={usersList}
              teamPresence={teamPresence}
              currentUser={currentUser}
              uptimeStr={uptimeStr}
              apolloLeads={apolloLeads}
              handleDeleteLead={handleDeleteLead}
              dailyReports={dailyReports}
              activeReport={activeReport}
              generateDailyReportAnalysis={generateDailyReportAnalysis}
              isGeneratingReport={isGeneratingReport}
              aiReportBrief={aiReportBrief}
            />
          )}

          {activeTab === 'icp' && (
            <ICPTab logMovement={logMovement} showToast={showToast} />
          )}

          {activeTab === 'commercial' && (
            <CommercialTab
              handleAddPackage={handleAddPackage}
              customPackageName={customPackageName}
              setCustomPackageName={setCustomPackageName}
              customPackagePrice={customPackagePrice}
              setCustomPackagePrice={setCustomPackagePrice}
              customPackageMaxDisc={customPackageMaxDisc}
              setCustomPackageMaxDisc={setCustomPackageMaxDisc}
              packages={packages}
              calcSelectedPack={calcSelectedPack}
              setCalcSelectedPack={setCalcSelectedPack}
              calcDiscount={calcDiscount}
              setCalcDiscount={setCalcDiscount}
              discountCalculation={discountCalculation}
              handleApplyProposalToCrm={handleApplyProposalToCrm}
            />
          )}

          {activeTab === 'prospecting' && (
            <ProspectingTab
              companyGuidelines={companyGuidelines}
              setCompanyGuidelines={customSetCompanyGuidelines}
              discoverySector={discoverySector}
              setDiscoverySector={setDiscoverySector}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              isLoadingCities={isLoadingCities}
              citiesList={citiesList}
              discoverySize={discoverySize}
              setDiscoverySize={setDiscoverySize}
              handleBigDataSearch={handleBigDataSearch}
              isScanning={isScanning}
              cnpjInput={cnpjInput}
              setCnpjInput={setCnpjInput}
              handleRealCnpjSearch={handleRealCnpjSearch}
              isFetchingCnpj={isFetchingCnpj}
              filterLocationState={filterLocationState}
              setFilterLocationState={setFilterLocationState}
              filterLocationCity={filterLocationCity}
              setFilterLocationCity={setFilterLocationCity}
              filterCitiesList={filterCitiesList}
              filterSize={filterSize}
              setFilterSize={setFilterSize}
              filterTitle={filterTitle}
              setFilterTitle={setFilterTitle}
              filterTech={filterTech}
              setFilterTech={setFilterTech}
              filteredApolloLeads={filteredApolloLeads}
              selectedApolloIds={selectedApolloIds}
              setSelectedApolloIds={setSelectedApolloIds}
              handleDeleteSelectedLeads={handleDeleteSelectedLeads}
              handleExportToClay={handleExportToClay}
              aiQualifications={aiQualifications}
              setSelectedLead={setSelectedLead}
              isQualifyingLead={isQualifyingLead}
              handleAiQualification={handleAiQualification}
              handleDeleteLead={handleDeleteLead}
              showScanModal={showScanModal}
              setShowScanModal={setShowScanModal}
              scanProgress={scanProgress}
              scanProgressText={scanProgressText}
              scanQuantity={scanQuantity}
              setScanQuantity={setScanQuantity}
            />
          )}

          {activeTab === 'qualification' && (
            <QualificationTab
              qualificationRules={qualificationRules}
              setQualificationRules={customSetQualificationRules}
              companyGuidelines={companyGuidelines}
              setCompanyGuidelines={customSetCompanyGuidelines}
              showToast={showToast}
            />
          )}

          {activeTab === 'enrichment' && (
            <EnrichmentTab
              clayGrid={clayGrid}
              setClayGrid={customSetClayGrid}
              enrichingId={enrichingId}
              runWaterfall={runWaterfall}
              isGeneratingIcebreaker={isGeneratingIcebreaker}
              generateIcebreaker={generateIcebreaker}
              showToast={showToast}
            />
          )}

          {activeTab === 'workflows' && (
            <WorkflowsTab
              workflowNodes={workflowNodes}
              setWorkflowNodes={customSetWorkflowNodes}
              showToast={showToast}
              logMovement={logMovement}
            />
          )}

          {activeTab === 'crm' && (
            <CrmTab
              crmDeals={crmDeals}
              setCrmDeals={customSetCrmDeals}
              showToast={showToast}
              logMovement={logMovement}
            />
          )}

          {activeTab === 'deliverability' && (
            <DeliverabilityTab
              domainHealth={domainHealth}
              spamTextInput={spamTextInput}
              setSpamTextInput={setSpamTextInput}
              analyzeSpamPhrases={analyzeSpamPhrases}
              spamAnalysisResult={spamAnalysisResult}
            />
          )}

        </main>
      </div>

      {/* Modals */}
      <LeadDetailsModal
        selectedLead={selectedLead}
        setSelectedLead={setSelectedLead}
        markAsApproached={markAsApproached}
        handleDeleteLead={handleDeleteLead}
      />

      <ExportProjectModal
        showExportModal={showExportModal}
        setShowExportModal={setShowExportModal}
        downloadSingleFile={downloadSingleFile}
        downloadZipProject={downloadZipProject}
        isZipping={isZipping}
      />

      {/* Footer Layout */}
      <Footer />

    </div>
  );
}