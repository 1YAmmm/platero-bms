import { useState } from "react";
import {
  CERTIFICATES,
  RESIDENTS,
  BARANGAY_INFO,
  generateId,
  formatDate,
} from "../../data/mockData";

import BarangayClearanceTemplate from "../../components/certificates/BarangayClearanceTemplate";
import BusinessPermitTemplate from "../../components/certificates/BusinessPermitTemplate";
import CertificationTemplate from "../../components/certificates/CertificationTemplate";
import Modal from "../../components/Modal";
import { FormField } from "../../components/Form";
import {
  IconPlus,
  IconPrint,
  IconEye,
  IconSearch,
  IconInfo,
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
  complaintAgainst: "",
  complaintType: "",
};

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Certificates() {
  const [certificates, setCertificates] = useState(CERTIFICATES);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [barangayInfo, setBarangayInfo] = useState(BARANGAY_INFO);
  const filtered = certificates.filter((c) =>
    `${c.residentName} ${c.id} ${c.type} ${c.purpose}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

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

  const handleSave = () => {
    const nc = {
      ...form,
      id: generateId("CERT", certificates),
      fee: CERT_FEES[form.type] || "0.00",
      status: "Issued",
    };
    setCertificates([...certificates, nc]);
    setModal(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const certTypeColor = (t) =>
    ({
      "Barangay Clearance": "badge-blue",
      "Business Permit": "badge-green",
      "Solo Parent Certificate": "badge-yellow",
      "Certificate of Indigency": "badge-red",
      "Complaint Certification": "badge-gray",
    })[t] || "badge-gray";
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
            <IconPlus size={18} /> Issue Certificate
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
                    "Barangay Clearance": "📄",
                    "Business Permit": "🏢",
                    "Solo Parent Certificate": "👨‍👩‍👧",
                    "Certificate of Indigency": "🏥",
                    "Complaint Certification": "⚖️",
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
              {filtered.length === 0 ? (
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Modal */}
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
                  fee: config.fee,
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
                  const r = RESIDENTS.find((r) => r.id === e.target.value);

                  setForm({
                    ...form,
                    residentId: e.target.value,
                    residentName: r ? `${r.firstName} ${r.lastName}` : "",
                  });
                }}
              >
                <option value="">-- Select Resident --</option>

                {RESIDENTS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.firstName} {r.lastName}
                  </option>
                ))}
              </select>
            </FormField>
          )}

          {/* BUSINESS NAME */}
          {certConfig.fields.includes("businessName") && (
            <FormField label="Business Name" required>
              <input
                className="input-field"
                value={form.businessName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    businessName: e.target.value,
                  })
                }
                placeholder="Enter business name"
              />
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

          {/* COMPLAINT AGAINST */}
          {certConfig.fields.includes("complaintAgainst") && (
            <FormField label="Complaint Against">
              <input
                className="input-field"
                value={form.complaintAgainst}
                onChange={(e) =>
                  setForm({
                    ...form,
                    complaintAgainst: e.target.value,
                  })
                }
                placeholder="Respondent name"
              />
            </FormField>
          )}

          {/* COMPLAINT TYPE */}
          {certConfig.fields.includes("complaintType") && (
            <FormField label="Complaint Type">
              <input
                className="input-field"
                value={form.complaintType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    complaintType: e.target.value,
                  })
                }
                placeholder="Noise Complaint, Physical Injury..."
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
                className="input-field bg-gray-50"
                value={`₱${form.fee}`}
                disabled
              />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
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
              <IconPrint size={16} /> Print Certificate
            </button>
          </div>
        )}
      </Modal>

      {/* Print Modal */}
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
                <IconPrint size={16} /> Print
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
      {/* Edit official Modal */}
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
    </div>
  );
}
