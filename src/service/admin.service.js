import { ref, onValue, set, update, remove, off } from "firebase/database";
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
// DELETE ADMIN
// ======================
export const deleteAdmin = async (uid) => {
  return await remove(ref(db, `${ADMIN_PATH}/${uid}`));
};
