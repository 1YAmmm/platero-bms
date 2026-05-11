import {
  ref,
  onValue,
  set,
  update,
  remove,
  off,
  push,
} from "firebase/database";
import { db } from "../lib/firebase";

const RESIDENT_PATH = "plateroBMS/residents";

/* ======================
   CREATE
====================== */
export const createResident = async (data) => {
  const newRef = push(ref(db, RESIDENT_PATH));
  return await set(newRef, data);
};

/* ======================
   READ (REALTIME)
====================== */
export const listenResidents = (callback) => {
  const residentsRef = ref(db, RESIDENT_PATH);

  const listener = onValue(residentsRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      callback([]);
      return;
    }

    const formatted = Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }));

    callback(formatted);
  });

  return () => off(residentsRef, "value", listener);
};

/* ======================
   UPDATE
====================== */
export const updateResident = async (id, updates) => {
  return await update(ref(db, `${RESIDENT_PATH}/${id}`), updates);
};

/* ======================
   DELETE
====================== */
export const deleteResident = async (id) => {
  return await remove(ref(db, `${RESIDENT_PATH}/${id}`));
};
