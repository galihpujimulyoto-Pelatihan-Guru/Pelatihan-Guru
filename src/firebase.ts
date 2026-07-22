import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAEkK0YvB1pGEUtkXpDMYQFAhmUBrqXsbo",
  authDomain: "gen-lang-client-0682630055.firebaseapp.com",
  projectId: "gen-lang-client-0682630055",
  storageBucket: "gen-lang-client-0682630055.firebasestorage.app",
  messagingSenderId: "272409071724",
  appId: "1:272409071724:web:4d5e33880e2a9ed0010849"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-gurulevelup-12a08124-3d31-4e97-a841-80306cdab8f4");
