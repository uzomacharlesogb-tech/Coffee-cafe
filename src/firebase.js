import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyABphqTFowRmEq0AC8Fj-DI3AB7LhCCUyg",
    authDomain: "cafe-street-a4ceb.firebaseapp.com",
    projectId: "cafe-street-a4ceb",
    storageBucket: "cafe-street-a4ceb.firebasestorage.app",
    messagingSenderId: "364982842571",
    appId: "1:364982842571:web:33617e9a5baea302b1574e",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app;