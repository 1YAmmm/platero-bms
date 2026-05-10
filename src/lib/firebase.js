import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB5NYWdawKE3FdSnyg_lnOSyUC_SOFwU_s",
  authDomain: "brngyplaterobms.firebaseapp.com",
  databaseURL:
    "https://brngyplaterobms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "brngyplaterobms",
  storageBucket: "brngyplaterobms.firebasestorage.app",
  messagingSenderId: "732325163894",
  appId: "1:732325163894:web:a5e624e30553fe509bc057",
  measurementId: "G-5NZM4N5SWP",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
