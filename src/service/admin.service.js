import { ref, onValue, set, update, remove, off, get } from "firebase/database";
import { db } from "../lib/firebase";

const ADMIN_PATH = "plateroBMS/admins";

// ======================
// READ (listen admins)
// ======================
export const listenAdmins = (callback) => {
  const adminsRef = ref(db, ADMIN_PATH);

  const listener = onValue(adminsRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      callback([]);
      return;
    }

    const formatted = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));

    callback(formatted);
  });

  // cleanup
  return () => off(adminsRef, "value", listener);
};

// ======================
// UPDATE ADMIN
// ======================
export const updateAdmin = async (uid, updates) => {
  return await update(ref(db, `${ADMIN_PATH}/${uid}`), updates);
};

// ======================
// DELETE ADMINs
// ======================
export const deleteAdmin = async (uid) => {
  return await remove(ref(db, `${ADMIN_PATH}/${uid}`));
};
export const getAdmins = async () => {
  const snapshot = await get(ref(db, ADMIN_PATH));

  if (!snapshot.exists()) return [];

  const data = snapshot.val();

  return Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));
};
