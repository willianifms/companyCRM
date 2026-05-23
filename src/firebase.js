import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let firebaseApp = null;
let auth = null;
let db = null;
let isFirebaseEnabled = false;

// Check if credentials are set (not empty and not placeholders)
const hasValidConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey.trim() !== "" &&
  firebaseConfig.projectId && 
  firebaseConfig.projectId.trim() !== "";

if (hasValidConfig) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    isFirebaseEnabled = true;
    console.log("Firebase inicializado com sucesso no Órbita Workspace.");
  } catch (error) {
    console.warn("Falha ao inicializar o Firebase. Rodando no modo de contingência local:", error);
  }
} else {
  console.log("Credenciais do Firebase ausentes. Rodando no modo local (localStorage).");
}

export { firebaseApp, auth, db, isFirebaseEnabled };
