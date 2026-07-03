import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-t8E0ZGy83ijT-usAWQNsP208wmlq89M",
  authDomain: "lost-found-system-c0aa5.firebaseapp.com",
  projectId: "lost-found-system-c0aa5",
  storageBucket: "lost-found-system-c0aa5.firebasestorage.app",
  messagingSenderId: "535158542465",
  appId: "1:535158542465:web:9fcd16ae338dbd6e40fd80"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
