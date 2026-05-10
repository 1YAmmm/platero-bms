import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

import { ref, set } from "firebase/database";
import { auth, db } from "../firebase";

//Register Admin + Save to RTDB
export const registerAdmin = async (email, password, fullName) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;

  // Save admin profile in RTDB
  await set(ref(db, `plateroBMS/admins/${user.uid}`), {
    uid: user.uid,
    fullName: fullName,
    email: email,
    role: "admin",
    status: "active",
    createdAt: Date.now(),
  });

  return userCredential;
};

//Login Admin
export const loginAdmin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout Admin
export const logoutAdmin = () => {
  return signOut(auth);
};

//Auth state listener
export const listenAdminAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};
// Reset Admin Password (via email link)
export const resetAdminPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};
