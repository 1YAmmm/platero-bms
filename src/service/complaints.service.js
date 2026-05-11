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

const COMPLAINT_PATH = "plateroBMS/complaints";

/* ======================
   CREATE COMPLAINT
====================== */
export const createComplaint = async (data) => {
  const newRef = push(ref(db, COMPLAINT_PATH));

  const complaintData = {
    complainantName: data.complainantName || "",
    complainantAddress: data.complainantAddress || "",
    complainantContact: data.complainantContact || "",
    respondentName: data.respondentName || "",
    category: data.category || "",
    description: data.description || "",
    status: data.status || "Pending",
    priority: data.priority || "Low",
    assignedTo: data.assignedTo || "",
    notes: data.notes || "",
    dateFiled: data.dateFiled || Date.now(),
    dateResolved: data.dateResolved || "",
    createdAt: Date.now(),
  };

  return await set(newRef, complaintData);
};

/* ======================
   READ COMPLAINTS (REALTIME)
====================== */
export const listenComplaints = (callback) => {
  const complaintRef = ref(db, COMPLAINT_PATH);

  const listener = onValue(complaintRef, (snapshot) => {
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

  return () => off(complaintRef, "value", listener);
};

/* ======================
   UPDATE COMPLAINT
====================== */
export const updateComplaint = async (id, updates) => {
  return await update(ref(db, `${COMPLAINT_PATH}/${id}`), {
    ...updates,
    updatedAt: Date.now(),
  });
};

/* ======================
   DELETE COMPLAINT
====================== */
export const deleteComplaint = async (id) => {
  return await remove(ref(db, `${COMPLAINT_PATH}/${id}`));
};
