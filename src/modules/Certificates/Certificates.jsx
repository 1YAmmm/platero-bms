import { useEffect, useState } from "react";
import { BARANGAY_INFO, formatDate } from "../../data/mockData";

import {
  createCertificate,
  listenCertificates,
  updateCertificate,
  deleteCertificate,
} from "../../service/certificate.service";
import Toast from "../../components/Toast";
import BarangayClearanceTemplate from "../../components/certificates/BarangayClearanceTemplate";
import BusinessPermitTemplate from "../../components/certificates/BusinessPermitTemplate";
import CertificationTemplate from "../../components/certificates/CertificationTemplate";
import { listenResidents } from "../../service/resident.service";
import { listenBusinesses } from "../../service/business.service";
import { listenComplaints } from "../../service/complaints.service";
import Modal from "../../components/Modal";
import { FormField } from "../../components/Form";

import {
  IconPlus,
  IconPrint,
  IconEye,
  IconSearch,
  IconInfo,
  IconDelete,
  IconBusiness,
  IconCertificate,
  IconReports,
  IconUsers,
  IconUser,
  IconAdmin,
  IconComplaint,
} from "../../assets/svg/Icons";

import { CERTIFICATE_CONFIG } from "../../data/certificateConfig";

const CERT_TYPES = [
  "Barangay Clearance",
  "Business Permit",
  "Solo Parent Certificate",
  "Certificate of Indigency",
  "Complaint Certification",
];

const CERT_FEES = {
  "Barangay Clearance": "50.00",
  "Business Permit": "200.00",
  "Solo Parent Certificate": "0.00",
  "Certificate of Indigency": "0.00",
  "Complaint Certification": "50.00",
};

const EMPTY_FORM = {
  type: "Barangay Clearance",

  residentId: "",
  residentName: "",

  purpose: "",
  orNumber: "",

  issuedBy: BARANGAY_INFO.secretary,
  issuedDate: new Date().toISOString().split("T")[0],
  expiryDate: "",

  fee: "50.00",

  // business
  businessName: "",
  businessAddress: "",
  businessNature: "",
  operatorName: "",

  // complaint
  complaintId: "",
  complainantName: "",
  respondentName: "",
  complaintType: "",
};

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [barangayInfo, setBarangayInfo] = useState(BARANGAY_INFO);
  const [residents, setResidents] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });
  /* ======================
     REALTIME FIREBASE LISTENER
  ====================== */
  useEffect(() => {
    const unsubscribe = listenCertificates((data) => {
      setCertificates(data || []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  /* ======================
      Load resident,business,complaints
  ====================== */
  useEffect(() => {
    const unsubscribeResidents = listenResidents((data) => {
      setResidents(data || []);
    });

    const unsubscribeBusinesses = listenBusinesses((data) => {
      setBusinesses(data || []);
    });
    const unsubscribeComplaints = listenComplaints((data) => {
      setComplaints(data || []);
    });

    return () => {
      unsubscribeResidents();
      unsubscribeBusinesses();
      unsubscribeComplaints();
    };
  }, []);

  /* ======================
     FILTER
  ====================== */
  const filtered = certificates.filter((c) =>
    `${c.residentName} ${c.id} ${c.type} ${c.purpose}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  /* ======================
     MODAL ACTIONS
  ====================== */
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal("add");
  };

  const openView = (c) => {
    setSelected(c);
    setModal("view");
  };

  const openPrint = (c) => {
    setSelected(c);
    setModal("print");
  };

  /* ======================
     SAVE CERTIFICATE
  ====================== */
  const handleSave = async () => {
    try {
      // REQUIRED FIELDS VALIDATION
      const requiredFields = [];

      if (certConfig.fields.includes("resident") && !form.residentId) {
        requiredFields.push("Resident Name");
      }

      if (certConfig.fields.includes("businessName") && !form.businessName) {
        requiredFields.push("Business Name");
      }

      if (
        certConfig.fields.includes("businessAddress") &&
        !form.businessAddress
      ) {
        requiredFields.push("Business Address");
      }

      if (
        certConfig.fields.includes("businessNature") &&
        !form.businessNature
      ) {
        requiredFields.push("Nature of Business");
      }

      if (certConfig.fields.includes("purpose") && !form.purpose.trim()) {
        requiredFields.push("Purpose");
      }

      if (!form.issuedDate) {
        requiredFields.push("Issued Date");
      }

      if (!form.fee) {
        requiredFields.push("Fee");
      }

      // SHOW ERROR TOAST
      if (requiredFields.length > 0) {
        setToast({
          message: `Please fill in: ${requiredFields.join(", ")}`,
          type: "error",
        });

        return;
      }

      // SAVE
      const payload = {
        ...form,
        fee: form.fee || "0.00",
        status: "Issued",
      };

      await createCertificate(payload);

      // SUCCESS TOAST
      setToast({
        message: "Certificate issued successfully!",
        type: "success",
      });

      setModal(null);
      setForm(EMPTY_FORM);
    } catch (error) {
      console.error("Error saving certificate:", error);

      setToast({
        message: "Failed to issue certificate.",
        type: "error",
      });
    }
  };

  /* ======================
     UPDATE CERTIFICATE
  ====================== */
  const handleUpdate = async () => {
    try {
      if (!selected?.id) return;

      await updateCertificate(selected.id, form);

      setModal(null);
      setSelected(null);
    } catch (error) {
      console.error("Error updating certificate:", error);
      alert("Failed to update certificate.");
    }
  };

  /* ======================
   DELETE CERTIFICATE
====================== */
  const handleDelete = async () => {
    try {
      if (!deleteTarget?.id) return;

      await deleteCertificate(deleteTarget.id);

      setToast({
        message: "Certificate deleted successfully!",
        type: "success",
      });

      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting certificate:", error);

      setToast({
        message: "Failed to delete certificate.",
        type: "error",
      });
    }
  };
  /* ======================
     PRINT
  ====================== */
  const handlePrint = () => {
    window.print();
  };

  /* ======================
     BADGE COLORS
  ====================== */
  const certTypeColor = (t) =>
    ({
      "Barangay Clearance": "badge-blue",
      "Business Permit": "badge-green",
      "Solo Parent Certificate": "badge-yellow",
      "Certificate of Indigency": "badge-red",
      "Complaint Certification": "badge-gray",
    })[t] || "badge-gray";

  /* ======================
     TEMPLATE RENDERER
  ====================== */
  const renderTemplate = (cert, barangayInfo) => {
    if (!cert) return null;

    switch (cert.type) {
      case "Barangay Clearance":
        return (
          <BarangayClearanceTemplate cert={cert} barangayInfo={barangayInfo} />
        );

      case "Business Permit":
        return (
          <BusinessPermitTemplate cert={cert} barangayInfo={barangayInfo} />
        );

      default:
        return (
          <CertificationTemplate cert={cert} barangayInfo={barangayInfo} />
        );
    }
  };

  const certConfig = CERTIFICATE_CONFIG[form.type];
  const filteredResidents =
    form.type === "Solo Parent Certificate"
      ? residents.filter((r) => r.soloParent)
      : form.type === "Certificate of Indigency"
        ? residents.filter((r) => r.indigent)
        : residents;
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title">Certificate Generator</h2>

          <p className="section-subtitle">
            {certificates.length} certificates issued
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setModal("officials")}
            className="btn-secondary flex items-center gap-2"
          >
            <IconInfo size={18} />
            Edit Officials
          </button>

          <button
            onClick={openAdd}
            className="btn-primary flex items-center gap-2"
          >
            <IconPlus size={18} />
            Issue Certificate
          </button>
        </div>
      </div>

      {/* Cert Types Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        {CERT_TYPES.map((t) => {
          const count = certificates.filter((c) => c.type === t).length;

          return (
            <div
              key={t}
              className="glass-card p-4 text-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={openAdd}
            >
              <p className="text-xl mb-1">
                {
                  {
                    "Barangay Clearance": <IconCertificate size={24} />,
                    "Business Permit": <IconBusiness size={24} />,
                    "Solo Parent Certificate": <IconUser size={24} />,
                    "Certificate of Indigency": <IconUsers size={24} />,
                    "Complaint Certification": <IconComplaint size={24} />,
                  }[t]
                }
              </p>

              <p className="text-xs font-semibold text-slate-700 leading-tight mb-1">
                {t}
              </p>

              <p className="text-blue-800 font-bold text-lg">{count}</p>
            </div>
          );
        })}
      </div>

      {/* SEARCH */}
      <div className="glass-card p-4 mb-5">
        <div className="relative">
          <IconSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            className="input-field pl-9"
            placeholder="Search certificates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-card overflow-hidden">
        <div className="table-wrapper bg-white">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Resident</th>
                <th>Certificate Type</th>
                <th>Purpose</th>
                <th>Date Issued</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    Loading certificates...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    No certificates found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="font-mono text-xs text-slate-500">
                        {c.id}
                      </span>
                    </td>

                    <td>
                      <span className="font-semibold">{c.residentName}</span>
                    </td>

                    <td>
                      <span className={`badge ${certTypeColor(c.type)}`}>
                        {c.type}
                      </span>
                    </td>

                    <td className="max-w-xs truncate">{c.purpose}</td>

                    <td>{formatDate(c.issuedDate)}</td>

                    <td>₱{c.fee}</td>

                    <td>
                      <span className="badge badge-green">{c.status}</span>
                    </td>

                    <td>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openView(c)}
                          className="btn-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg"
                        >
                          <IconEye size={14} />
                        </button>

                        <button
                          onClick={() => openPrint(c)}
                          className="btn-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg"
                        >
                          <IconPrint size={14} />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="btn-sm bg-red-50 text-red-700 hover:bg-red-100 px-2.5 py-1.5 rounded-lg"
                        >
                          <IconDelete size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ISSUE MODAL */}
      <Modal
        isOpen={modal === "add"}
        onClose={() => setModal(null)}
        title="Issue Certificate"
        footer={
          <>
            <button onClick={() => setModal(null)} className="btn-secondary">
              Cancel
            </button>

            <button onClick={handleSave} className="btn-primary">
              Issue Certificate
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Certificate Type */}
          <FormField label="Certificate Type" required>
            <select
              className="input-field"
              value={form.type}
              onChange={(e) => {
                const selectedType = e.target.value;

                const config = CERTIFICATE_CONFIG[selectedType];

                setForm({
                  ...EMPTY_FORM,
                  type: selectedType,
                  fee: CERT_FEES[selectedType] || "0.00",
                  purpose: config.purposePlaceholder || "",
                });
              }}
            >
              {CERT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </FormField>

          {/* RESIDENT */}
          {certConfig.fields.includes("resident") && (
            <FormField label="Resident Name" required>
              <select
                className="input-field"
                value={form.residentId}
                onChange={(e) => {
                  const r = residents.find((r) => r.id === e.target.value);

                  setForm({
                    ...form,
                    residentId: e.target.value,
                    residentName: r ? `${r.firstName} ${r.lastName}` : "",
                  });
                }}
              >
                <option value="">-- Select Resident --</option>

                {filteredResidents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.firstName} {r.lastName}
                    {form.type === "Solo Parent Certificate" &&
                      " - Solo Parent"}
                    {form.type === "Certificate of Indigency" && " - Indigent"}
                  </option>
                ))}
              </select>
            </FormField>
          )}

          {/* BUSINESS NAME */}
          {certConfig.fields.includes("businessName") && (
            <FormField label="Business Name" required>
              <select
                className="input-field"
                value={form.businessName}
                onChange={(e) => {
                  const business = businesses.find(
                    (b) => b.id === e.target.value,
                  );

                  setForm({
                    ...form,

                    // resident / owner
                    residentId: business?.ownerId || "",
                    residentName: business?.ownerName || "",

                    // business details
                    businessName: business?.businessName || "",
                    businessAddress: business?.address || "",
                    businessNature: business?.businessType || "",
                    operatorName: business?.ownerName || "",
                    expiryDate: business?.permitExpiry || "",
                  });
                }}
              >
                <option value="">-- Select Business --</option>

                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.businessName}
                  </option>
                ))}
              </select>
            </FormField>
          )}

          {/* BUSINESS ADDRESS */}
          {certConfig.fields.includes("businessAddress") && (
            <FormField label="Business Address" required>
              <input
                className="input-field"
                value={form.businessAddress}
                onChange={(e) =>
                  setForm({
                    ...form,
                    businessAddress: e.target.value,
                  })
                }
                placeholder="Business address"
              />
            </FormField>
          )}

          {/* BUSINESS NATURE */}
          {certConfig.fields.includes("businessNature") && (
            <FormField label="Nature of Business" required>
              <input
                className="input-field"
                value={form.businessNature}
                onChange={(e) =>
                  setForm({
                    ...form,
                    businessNature: e.target.value,
                  })
                }
                placeholder="Wholesale, Retail, Services..."
              />
            </FormField>
          )}

          {/* OPERATOR */}
          {certConfig.fields.includes("operatorName") && (
            <FormField label="Operator / Manager">
              <input
                className="input-field"
                value={form.operatorName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    operatorName: e.target.value,
                  })
                }
                placeholder="Operator / Manager"
              />
            </FormField>
          )}

          {/* COMPLAINT SELECTOR (AUTO-FILL FROM COMPLAINT LISTEN ONLY) */}
          {certConfig.fields.includes("complainantName") && (
            <FormField label="Select Complaint">
              <select
                className="input-field"
                value={form.complaintId || ""}
                onChange={(e) => {
                  const selectedComplaint = complaints.find(
                    (c) => c.id === e.target.value,
                  );

                  if (!selectedComplaint) return;

                  setForm((prev) => ({
                    ...prev,

                    // complaint id
                    complaintId: selectedComplaint.id || "",

                    // complaint data
                    complainantName: selectedComplaint.complainantName || "",

                    respondentName: selectedComplaint.respondentName || "",

                    complaintType: selectedComplaint.category || "",

                    purpose: selectedComplaint.description || "",

                    residentName: selectedComplaint.complainantName || "",
                  }));
                }}
              >
                <option value="">-- Select Complaint --</option>

                {complaints.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.complainantName} vs {c.respondentName} ({c.category})
                  </option>
                ))}
              </select>
            </FormField>
          )}

          {/* COMPLAINANT NAME */}
          {certConfig.fields.includes("complainantName") && (
            <FormField label="Complainant Name">
              <input
                className="input-field"
                value={form.complainantName || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    complainantName: e.target.value,
                  })
                }
                placeholder="Complainant Name"
              />
            </FormField>
          )}

          {/* RESPONDENT NAME */}
          {certConfig.fields.includes("respondentName") && (
            <FormField label="Respondent Name">
              <input
                className="input-field"
                value={form.respondentName || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    respondentName: e.target.value,
                  })
                }
                placeholder="Respondent Name"
              />
            </FormField>
          )}

          {/* COMPLAINT TYPE */}
          {certConfig.fields.includes("complaintType") && (
            <FormField label="Complaint Type">
              <input
                className="input-field"
                value={form.complaintType || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    complaintType: e.target.value,
                  })
                }
                placeholder="Complaint Type"
              />
            </FormField>
          )}

          {/* PURPOSE */}
          {certConfig.fields.includes("purpose") && (
            <FormField label="Purpose">
              <input
                className="input-field"
                value={form.purpose}
                onChange={(e) =>
                  setForm({
                    ...form,
                    purpose: e.target.value,
                  })
                }
                placeholder={certConfig.purposePlaceholder || "Enter purpose"}
              />
            </FormField>
          )}

          {/* DATES */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date Issued">
              <input
                type="date"
                className="input-field"
                value={form.issuedDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    issuedDate: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label="Expiry Date">
              <input
                type="date"
                className="input-field"
                value={form.expiryDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    expiryDate: e.target.value,
                  })
                }
              />
            </FormField>
          </div>

          {/* OR + FEE */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="O.R. Number">
              <input
                className="input-field"
                value={form.orNumber}
                onChange={(e) =>
                  setForm({
                    ...form,
                    orNumber: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label="Fee">
              <input
                type="number"
                className="input-field"
                value={form.fee}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fee: e.target.value,
                  })
                }
              />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* VIEW MODAL */}
      <Modal
        isOpen={modal === "view"}
        onClose={() => setModal(null)}
        title="Certificate Details"
      >
        {selected && (
          <div className="space-y-3">
            {[
              ["Certificate ID", selected.id],
              ["Type", selected.type],
              ["Resident", selected.residentName],
              ["Purpose", selected.purpose],
              ["Date Issued", formatDate(selected.issuedDate)],
              [
                "Expiry",
                selected.expiryDate
                  ? formatDate(selected.expiryDate)
                  : "6 months from issuance",
              ],
              ["O.R. Number", selected.orNumber],
              ["Fee", `₱${selected.fee}`],
              ["Issued By", selected.issuedBy],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between text-sm border-b border-gray-50 pb-2"
              >
                <span className="text-slate-500">{k}</span>

                <span className="font-medium text-slate-800">{v}</span>
              </div>
            ))}

            <button
              onClick={() => openPrint(selected)}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              <IconPrint size={16} />
              Print Certificate
            </button>
          </div>
        )}
      </Modal>

      {/* PRINT MODAL */}
      <Modal
        isOpen={modal === "print"}
        onClose={() => setModal(null)}
        title={`Print: ${selected?.type}`}
      >
        {selected && (
          <div>
            <div className="mb-4 flex justify-end">
              <button
                onClick={handlePrint}
                className="btn-primary flex items-center gap-2"
              >
                <IconPrint size={16} />
                Print
              </button>
            </div>

            {/* Preview */}
            <div className="preview-wrapper">
              <div className="preview-scale">
                {renderTemplate(selected, barangayInfo)}
              </div>
            </div>

            {/* Actual print area */}
            <div className="print-area">
              {renderTemplate(selected, barangayInfo)}
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT OFFICIALS MODAL */}
      <Modal
        isOpen={modal === "officials"}
        onClose={() => setModal(null)}
        title="Barangay Officials"
        footer={
          <>
            <button onClick={() => setModal(null)} className="btn-secondary">
              Cancel
            </button>

            <button onClick={() => setModal(null)} className="btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Punong Barangay">
            <input
              className="input-field"
              value={barangayInfo.captain}
              onChange={(e) =>
                setBarangayInfo({
                  ...barangayInfo,
                  captain: e.target.value,
                })
              }
            />
          </FormField>

          <FormField label="Punong Barangay Title">
            <input
              className="input-field"
              value={barangayInfo.captainTitle}
              onChange={(e) =>
                setBarangayInfo({
                  ...barangayInfo,
                  captainTitle: e.target.value,
                })
              }
            />
          </FormField>

          <FormField label="Barangay Secretary">
            <input
              className="input-field"
              value={barangayInfo.secretary}
              onChange={(e) =>
                setBarangayInfo({
                  ...barangayInfo,
                  secretary: e.target.value,
                })
              }
            />
          </FormField>

          <FormField label="Secretary Title">
            <input
              className="input-field"
              value={barangayInfo.secretaryTitle}
              onChange={(e) =>
                setBarangayInfo({
                  ...barangayInfo,
                  secretaryTitle: e.target.value,
                })
              }
            />
          </FormField>
        </div>
      </Modal>
      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Certificate"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="space-y-2">
          <p className="text-slate-700">
            Are you sure you want to delete this certificate?
          </p>

          <div className="bg-slate-50 rounded-lg p-3 text-sm">
            <p>
              <span className="font-semibold">Resident:</span>{" "}
              {deleteTarget?.residentName}
            </p>

            <p>
              <span className="font-semibold">Type:</span> {deleteTarget?.type}
            </p>

            <p>
              <span className="font-semibold">Purpose:</span>{" "}
              {deleteTarget?.purpose}
            </p>
          </div>

          <p className="text-red-600 text-sm">This action cannot be undone.</p>
        </div>
      </Modal>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />
    </div>
  );
}
