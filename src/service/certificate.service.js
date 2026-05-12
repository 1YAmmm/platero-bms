import {
  ref,
  onValue,
  set,
  update,
  off,
  push,
  remove,
} from "firebase/database";
import { db } from "../lib/firebase";

const CERTIFICATE_PATH = "plateroBMS/certificates";

/* ======================
   CREATE CERTIFICATE
====================== */
export const createCertificate = async (data) => {
  const newRef = push(ref(db, CERTIFICATE_PATH));

  const certificateData = {
    // basic certificate info
    type: data.type || "",

    residentId: data.residentId || "",
    residentName: data.residentName || "",

    purpose: data.purpose || "",
    orNumber: data.orNumber || "",

    issuedBy: data.issuedBy || "",
    issuedDate: data.issuedDate || "",
    expiryDate: data.expiryDate || "",

    fee: data.fee || "0.00",

    // business certificate fields
    businessName: data.businessName || "",
    businessAddress: data.businessAddress || "",
    businessNature: data.businessNature || "",
    operatorName: data.operatorName || "",

    // complaint certificate fields
    complaintAgainst: data.complaintAgainst || "",
    complaintType: data.complaintType || "",

    // optional status
    status: data.status || "Issued",

    createdAt: Date.now(),
  };

  return await set(newRef, certificateData);
};

/* ======================
   READ CERTIFICATES (REALTIME)
====================== */
export const listenCertificates = (callback) => {
  const certificateRef = ref(db, CERTIFICATE_PATH);

  const listener = onValue(certificateRef, (snapshot) => {
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

  return () => off(certificateRef, "value", listener);
};

/* ======================
   UPDATE CERTIFICATE
====================== */
export const updateCertificate = async (id, updates) => {
  return await update(ref(db, `${CERTIFICATE_PATH}/${id}`), {
    ...updates,
    updatedAt: Date.now(),
  });
};
/* ======================
   DELETE CERTIFICATE
====================== */
export const deleteCertificate = async (id) => {
  return await remove(ref(db, `${CERTIFICATE_PATH}/${id}`));
};
