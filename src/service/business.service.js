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

const BUSINESS_PATH = "plateroBMS/business";

/* ======================
   CREATE BUSINESS
====================== */
export const createBusiness = async (data) => {
  const newRef = push(ref(db, BUSINESS_PATH));

  const businessData = {
    businessName: data.businessName || "",
    ownerName: data.ownerName || "",
    businessType: data.businessType || "",
    category: data.category || "",
    address: data.address || "",
    contactNumber: data.contactNumber || "",
    permitNumber: data.permitNumber || "",
    permitStatus: data.permitStatus || "",
    permitExpiry: data.permitExpiry || "",
    capitalInvestment: data.capitalInvestment || "",
    employeeCount: data.employeeCount || "",
    createdAt: Date.now(),
  };

  return await set(newRef, businessData);
};

/* ======================
   READ BUSINESSES (REALTIME)
====================== */
export const listenBusinesses = (callback) => {
  const businessRef = ref(db, BUSINESS_PATH);

  const listener = onValue(businessRef, (snapshot) => {
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

  return () => off(businessRef, "value", listener);
};

/* ======================
   UPDATE BUSINESS
====================== */
export const updateBusiness = async (id, updates) => {
  return await update(ref(db, `${BUSINESS_PATH}/${id}`), {
    ...updates,
    updatedAt: Date.now(),
  });
};

/* ======================
   DELETE BUSINESS
====================== */
export const deleteBusiness = async (id) => {
  return await remove(ref(db, `${BUSINESS_PATH}/${id}`));
};
