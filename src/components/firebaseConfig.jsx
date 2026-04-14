import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtJgzP27s8YKMOTzCEg2DTSwjq-8Z_H54",
  authDomain: "alyna-6c491.firebaseapp.com",
  projectId: "alyna-6c491",
  storageBucket: "alyna-6c491.firebasestorage.app",
  messagingSenderId: "46117403540",
  appId: "1:46117403540:web:498346bb139636fe99ad81",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
