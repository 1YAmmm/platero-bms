// ─── MOCK DATA STORE ──────────────────────────────────────────────────────────
// Barangay Platero, Biñan, Laguna – Management System

export const BARANGAY_INFO = {
  name: "Barangay Platero",

  captain: "JUAN DELA CRUZ",
  captainTitle: "Punong Barangay",

  secretary: "MARIA SANTOS",
  secretaryTitle: "Barangay Secretary",

  treasurer: "PEDRO REYES",

  hotline: "09123456789",
};
export const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Community Clean-Up Drive",
    date: "2025-05-15",
    category: "Event",
    content:
      "Join us for the monthly Barangay Clean-Up Drive on May 15, 2025 at 6:00 AM. All residents are encouraged to participate.",
    pinned: true,
  },
  {
    id: 2,
    title: "Free Medical Mission",
    date: "2025-05-20",
    category: "Health",
    content:
      "Free medical consultations, blood pressure monitoring, and medicines will be provided on May 20 at the Barangay Health Center.",
    pinned: true,
  },
  {
    id: 3,
    title: "Senior Citizen ID Application",
    date: "2025-05-10",
    category: "Service",
    content:
      "Senior citizens may apply for their OSCA ID at the Barangay Hall every Monday and Wednesday, 8:00 AM – 12:00 PM.",
    pinned: false,
  },
  {
    id: 4,
    title: "Barangay Assembly Meeting",
    date: "2025-06-01",
    category: "Governance",
    content:
      "The quarterly Barangay Assembly will be held on June 1, 2025, 2:00 PM at the Barangay Covered Court.",
    pinned: false,
  },
];

export let RESIDENTS = [
  {
    id: "RES-2025-001",
    firstName: "Juan",
    lastName: "Dela Cruz",
    middleName: "Santos",
    birthdate: "1985-03-12",
    age: 40,
    gender: "Male",
    civilStatus: "Married",
    address: "123 Sampaguita St., Platero, Biñan",
    purok: "Purok 1",
    contactNumber: "09171234567",
    email: "juan.delacruz@email.com",
    occupation: "Carpenter",
    voterStatus: "Registered Voter",
    soloParent: false,
    indigent: false,
    senior: false,
    pwd: false,
    registeredDate: "2025-01-10",
    status: "Active",
    photo: null,
  },
  {
    id: "RES-2025-002",
    firstName: "Maria",
    lastName: "Santos",
    middleName: "Garcia",
    birthdate: "1990-07-25",
    age: 34,
    gender: "Female",
    civilStatus: "Single",
    address: "456 Rosal Ave., Platero, Biñan",
    purok: "Purok 2",
    contactNumber: "09281234567",
    email: "maria.santos@email.com",
    occupation: "Teacher",
    voterStatus: "Registered Voter",
    soloParent: true,
    indigent: false,
    senior: false,
    pwd: false,
    registeredDate: "2025-01-15",
    status: "Active",
    photo: null,
  },
  {
    id: "RES-2025-003",
    firstName: "Pedro",
    lastName: "Reyes",
    middleName: "Lim",
    birthdate: "1952-11-08",
    age: 72,
    gender: "Male",
    civilStatus: "Widower",
    address: "789 Dahlia St., Platero, Biñan",
    purok: "Purok 3",
    contactNumber: "09391234567",
    email: "",
    occupation: "Retired",
    voterStatus: "Registered Voter",
    soloParent: false,
    indigent: true,
    senior: true,
    pwd: false,
    registeredDate: "2025-02-01",
    status: "Active",
    photo: null,
  },
];

export let BUSINESSES = [
  {
    id: "BUS-2025-001",
    businessName: "Dela Cruz Sari-Sari Store",
    ownerName: "Juan Dela Cruz",
    businessType: "Retail",
    category: "Sari-Sari Store",
    address: "123 Sampaguita St., Platero, Biñan",
    contactNumber: "09171234567",
    permitNumber: "BP-2025-0001",
    permitStatus: "Active",
    permitExpiry: "2025-12-31",
    capitalInvestment: "50000",
    employeeCount: 1,
    registeredDate: "2025-01-05",
  },
  {
    id: "BUS-2025-002",
    businessName: "Santos Eatery & Carinderia",
    ownerName: "Luz Santos",
    businessType: "Food Service",
    category: "Restaurant/Eatery",
    address: "88 Rosal Ave., Platero, Biñan",
    contactNumber: "09281112233",
    permitNumber: "BP-2025-0002",
    permitStatus: "Active",
    permitExpiry: "2025-12-31",
    capitalInvestment: "120000",
    employeeCount: 3,
    registeredDate: "2025-01-12",
  },
  {
    id: "BUS-2025-003",
    businessName: "Reyes Auto Repair Shop",
    ownerName: "Roberto Reyes",
    businessType: "Automotive",
    category: "Repair Shop",
    address: "22 Gomez St., Platero, Biñan",
    contactNumber: "09451234567",
    permitNumber: "BP-2025-0003",
    permitStatus: "Expired",
    permitExpiry: "2024-12-31",
    capitalInvestment: "200000",
    employeeCount: 4,
    registeredDate: "2024-01-20",
  },
];

export let COMPLAINTS = [
  {
    id: "CMP-2025-001",
    complainantName: "Ana Villanueva",
    complainantAddress: "44 Orchid St., Platero, Biñan",
    complainantContact: "09176543210",
    respondentName: "Brgy. Garbage Collector",
    category: "Waste Management",
    description:
      "Garbage has not been collected in our street for two weeks. The smell is unbearable and there are flies everywhere. This is a health hazard.",
    status: "Pending",
    priority: "High",
    dateFiled: "2025-05-01",
    dateResolved: null,
    assignedTo: "Kagawad Flores",
    notes: "",
  },
  {
    id: "CMP-2025-002",
    complainantName: "Roberto Tan",
    complainantAddress: "12 Camia St., Platero, Biñan",
    complainantContact: "09289876543",
    respondentName: "Neighbor – Carlos Mendoza",
    category: "Noise Disturbance",
    description:
      "Neighbor plays loud music until 2:00 AM almost every night, disturbing the peace and sleep of residents in the area.",
    status: "Resolved",
    priority: "Medium",
    dateFiled: "2025-04-15",
    dateResolved: "2025-04-22",
    assignedTo: "Kagawad Ramos",
    notes:
      "Both parties agreed to a settlement. Noise ordinance ordinance explained to respondent.",
  },
  {
    id: "CMP-2025-003",
    complainantName: "Carina Lopez",
    complainantAddress: "9 Jasmine St., Platero, Biñan",
    complainantContact: "09354321098",
    respondentName: "Unknown Vandal",
    category: "Property Damage",
    description:
      "Someone vandalized my fence with graffiti. I have CCTV footage. Requesting barangay intervention to identify and apprehend the suspect.",
    status: "Under Investigation",
    priority: "Medium",
    dateFiled: "2025-05-05",
    dateResolved: null,
    assignedTo: "Kagawad Cruz",
    notes: "CCTV footage reviewed. Coordinating with PNP.",
  },
];

export let CERTIFICATES = [
  {
    id: "CERT-2025-001",
    type: "Barangay Clearance",
    residentId: "RES-2025-001",
    residentName: "Juan Dela Cruz",
    purpose: "Employment Requirement",
    issuedDate: "2025-05-02",
    expiryDate: "2025-11-02",
    orNumber: "OR-2025-0101",
    fee: "50.00",
    issuedBy: "Maria Luisa D. Santos",
    status: "Issued",
  },
  {
    id: "CERT-2025-002",
    type: "Certificate of Indigency",
    residentId: "RES-2025-003",
    residentName: "Pedro Reyes",
    purpose: "Medical Assistance",
    issuedDate: "2025-05-03",
    expiryDate: "2025-08-03",
    orNumber: "OR-2025-0102",
    fee: "0.00",
    issuedBy: "Maria Luisa D. Santos",
    status: "Issued",
  },
  {
    id: "CERT-2025-003",
    type: "Solo Parent Certificate",
    residentId: "RES-2025-002",
    residentName: "Maria Santos",
    purpose: "School Enrollment Privilege",
    issuedDate: "2025-05-06",
    expiryDate: "2026-05-06",
    orNumber: "OR-2025-0103",
    fee: "0.00",
    issuedBy: "Maria Luisa D. Santos",
    status: "Issued",
  },
];

export let ADMINS = [
  {
    id: "ADM-001",
    username: "admin",
    password: "admin123",
    fullName: "Maria Luisa D. Santos",
    role: "Secretary",
    email: "secretary@platero.gov.ph",
    lastLogin: "2025-05-09 08:32 AM",
    status: "Active",
    createdDate: "2025-01-01",
  },
  {
    id: "ADM-002",
    username: "treasurer",
    password: "treasurer123",
    fullName: "Jose Antonio P. Reyes",
    role: "Treasurer",
    email: "treasurer@platero.gov.ph",
    lastLogin: "2025-05-08 03:15 PM",
    status: "Active",
    createdDate: "2025-01-01",
  },
];

// Helpers
export const generateId = (prefix, list) => {
  const year = new Date().getFullYear();
  const num = String(list.length + 1).padStart(3, "0");
  return `${prefix}-${year}-${num}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};
