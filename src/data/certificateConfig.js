export const CERTIFICATE_CONFIG = {
  "Barangay Clearance": {
    fee: "50.00",
    fields: ["resident", "purpose", "orNumber"],
    purposePlaceholder: "Employment Requirement",
  },

  "Business Permit": {
    fee: "200.00",
    fields: [
      "businessName",
      "businessAddress",
      "businessNature",
      "operatorName",
      "orNumber",
    ],
  },

  "Solo Parent Certificate": {
    fee: "0.00",
    fields: ["resident", "purpose"],
    purposePlaceholder: "Solo Parent Benefit",
  },

  "Certificate of Indigency": {
    fee: "0.00",
    fields: ["resident", "purpose"],
    purposePlaceholder: "Medical Assistance",
  },

  "Complaint Certification": {
    fields: ["complainantName", "respondentName", "complaintType", "purpose"],

    purposePlaceholder: "Enter complaint details",
  },
};
