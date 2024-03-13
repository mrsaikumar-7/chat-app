import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8gNuFVTtR_l43pl_WF7Mc-cOaK7Ou2mo",
  authDomain: "chat-768e3.firebaseapp.com",
  projectId: "chat-768e3",
  storageBucket: "chat-768e3.appspot.com",
  messagingSenderId: "895177232174",
  appId: "1:895177232174:web:880831c8220659338974bf",
  measurementId: "G-G4MLPKF265"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, storage, db };