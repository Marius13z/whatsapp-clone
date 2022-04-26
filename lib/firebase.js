import { initializeApp, getApps, getApp } from '@firebase/app'
import { getFirestore } from '@firebase/firestore'
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDdvOl6vzgeMK3kSyOZj8DtCks2RM9uV18",
    authDomain: "whatsapp-2-c669c.firebaseapp.com",
    projectId: "whatsapp-2-c669c",
    storageBucket: "whatsapp-2-c669c.appspot.com",
    messagingSenderId: "702165295411",
    appId: "1:702165295411:web:4b10cf8020ac133f131e46",
    measurementId: "G-PPWH9J23Y5"
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

  const db = getFirestore(app);


  // Auth 

  const auth = getAuth(app);

  const provider = new GoogleAuthProvider();

  export { db, auth, provider };