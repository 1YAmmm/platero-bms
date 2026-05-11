import { useEffect, useState } from "react";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import { FormField } from "../../components/Form";
import { formatDate } from "../../data/mockData";
import Toast from "../../components/Toast";
import {
  IconPlus,
  IconEdit,
  IconDelete,
  IconSearch,
  IconInfo,
} from "../../assets/svg/Icons";

import {
  createBusiness,
  listenBusinesses,
  updateBusiness,
  deleteBusiness,
} from "../../service/business.service";

const EMPTY_FORM = {
  businessName: "",
  ownerName: "",
  businessType: "Retail",
  category: "",
  address: "",
  contactNumber: "",
  permitNumber: "",
  permitStatus: "Active",
  permitExpiry: "",
  capitalInvestment: "",
  employeeCount: "",
};

const BIZ_TYPES = [
  "Retail",
  "Food Service",
  "Automotive",
  "Manufacturing",
  "Services",
  "Agriculture",
  "Construction",
  "Other",
];

/* ======================
   FORM COMPONENT
====================== */
function BizForm({ form, setForm }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
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
          />
        </FormField>
      </div>

      <FormField label="Owner Name" required>
        <input
          className="input-field"
          value={form.ownerName}
          onChange={(e) =>
            setForm({
              ...form,
              ownerName: e.target.value,
            })
          }
        />
      </FormField>

      <FormField label="Business Type">
        <select
          className="input-field"
          value={form.businessType}
          onChange={(e) =>
            setForm({
              ...form,
              businessType: e.target.value,
            })
          }
        >
          {BIZ_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Category">
        <input
          className="input-field"
          placeholder="e.g., Sari-Sari Store"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
        />
      </FormField>

      <FormField label="Contact Number">
        <input
          className="input-field"
          value={form.contactNumber}
          onChange={(e) =>
            setForm({
              ...form,
              contactNumber: e.target.value,
            })
          }
        />
      </FormField>

      <div className="col-span-2">
        <FormField label="Business Address">
          <input
            className="input-field"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
          />
        </FormField>
      </div>

      <FormField label="Permit Number">
        <input
          className="input-field"
          value={form.permitNumber}
          onChange={(e) =>
            setForm({
              ...form,
              permitNumber: e.target.value,
            })
          }
        />
      </FormField>

      <FormField label="Permit Status">
        <select
          className="input-field"
          value={form.permitStatus}
          onChange={(e) =>
            setForm({
              ...form,
              permitStatus: e.target.value,
            })
          }
        >
          <option>Active</option>
          <option>Expired</option>
          <option>Renewed</option>
        </select>
      </FormField>

      <FormField label="Permit Expiry">
        <input
          type="date"
          className="input-field"
          value={form.permitExpiry}
          onChange={(e) =>
            setForm({
              ...form,
              permitExpiry: e.target.value,
            })
          }
        />
      </FormField>

      <FormField label="Capital Investment (₱)">
        <input
          type="number"
          className="input-field"
          value={form.capitalInvestment}
          onChange={(e) =>
            setForm({
              ...form,
              capitalInvestment: e.target.value,
            })
          }
        />
      </FormField>

      <FormField label="No. of Employees">
        <input
          type="number"
          className="input-field"
          value={form.employeeCount}
          onChange={(e) =>
            setForm({
              ...form,
              employeeCount: e.target.value,
            })
          }
        />
      </FormField>
    </div>
  );
}

/* ======================
   MAIN COMPONENT
====================== */
export default function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filter, setFilter] = useState("All");

  // ✅ TOAST STATE ADDED
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const unsubscribe = listenBusinesses((data) => {
      setBusinesses(data);
    });

    return () => unsubscribe();
  }, []);

  const filtered = businesses.filter((b) => {
    const matchSearch =
      `${b.businessName} ${b.ownerName} ${b.id} ${b.category} ${b.businessType}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchFilter = filter === "All" || b.permitStatus === filter;

    return matchSearch && matchFilter;
  });

  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setSelected(null);
    setModal("add");
  };

  const openEdit = (b) => {
    setForm({
      businessName: b.businessName || "",
      ownerName: b.ownerName || "",
      businessType: b.businessType || "Retail",
      category: b.category || "",
      address: b.address || "",
      contactNumber: b.contactNumber || "",
      permitNumber: b.permitNumber || "",
      permitStatus: b.permitStatus || "Active",
      permitExpiry: b.permitExpiry || "",
      capitalInvestment: b.capitalInvestment || "",
      employeeCount: b.employeeCount || "",
    });

    setSelected(b);
    setModal("edit");
  };

  /* ======================
     SAVE (WITH TOAST)
  ====================== */
  const handleSave = async () => {
    try {
      if (modal === "add") {
        await createBusiness({
          ...form,
          registeredDate: new Date().toISOString().split("T")[0],
        });

        setToast({
          message: "Business successfully registered!",
          type: "success",
        });
      } else if (modal === "edit" && selected) {
        await updateBusiness(selected.id, form);

        setToast({
          message: "Business updated successfully!",
          type: "success",
        });
      }

      setModal(null);
      setForm({ ...EMPTY_FORM });
      setSelected(null);
    } catch (error) {
      setToast({ message: "Failed to save business", type: "error" });
    }
  };

  /* ======================
     DELETE (WITH TOAST)
  ====================== */
  const handleDelete = async () => {
    try {
      if (deleteTarget) {
        await deleteBusiness(deleteTarget.id);

        setToast({
          message: "Business deleted successfully!",
          type: "success",
        });
      }

      setDeleteTarget(null);
    } catch (error) {
      setToast({ message: "Failed to delete business", type: "error" });
    }
  };

  const statusBadge = (s) =>
    ({
      Active: "badge-green",
      Expired: "badge-red",
      Renewed: "badge-yellow",
    })[s] || "badge-gray";

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (v) => (
        <span className="font-mono text-xs text-slate-500">{v}</span>
      ),
    },
    {
      key: "businessName",
      label: "Business",
      render: (v, r) => (
        <div>
          <p className="font-semibold text-slate-800">{v}</p>
          <p className="text-xs text-slate-400">{r.category}</p>
        </div>
      ),
    },
    { key: "ownerName", label: "Owner" },
    { key: "businessType", label: "Type" },
    { key: "permitNumber", label: "Permit No." },
    {
      key: "permitStatus",
      label: "Status",
      render: (v) => <span className={`badge ${statusBadge(v)}`}>{v}</span>,
    },
    {
      key: "permitExpiry",
      label: "Expires",
      render: (v) => formatDate(v),
    },
    {
      key: "id",
      label: "Actions",
      render: (_, r) => (
        <div className="flex gap-1">
          <button
            onClick={() => {
              setSelected(r);
              setModal("view");
            }}
            className="btn-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg"
          >
            <IconInfo size={14} />
          </button>

          <button
            onClick={() => openEdit(r)}
            className="btn-sm bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg"
          >
            <IconEdit size={14} />
          </button>

          <button
            onClick={() => setDeleteTarget(r)}
            className="btn-sm bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-lg"
          >
            <IconDelete size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* ✅ TOAST ADDED HERE */}
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title">Business Registration</h2>
          <p className="section-subtitle">
            {businesses.length} registered businesses
          </p>
        </div>

        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2"
        >
          <IconPlus size={18} />
          Register Business
        </button>
      </div>

      <div className="glass-card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <IconSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            className="input-field pl-9"
            placeholder="Search business..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {["All", "Active", "Expired", "Renewed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === s
                  ? "bg-blue-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <Table
          columns={columns}
          data={filtered}
          emptyMessage="No businesses found."
        />
      </div>

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={modal === "add" || modal === "edit"}
        onClose={() => setModal(null)}
        title={
          modal === "add" ? "Register New Business" : "Edit Business Record"
        }
        footer={
          <>
            <button onClick={() => setModal(null)} className="btn-secondary">
              Cancel
            </button>

            <button onClick={handleSave} className="btn-primary">
              {modal === "add" ? "Register" : "Save"}
            </button>
          </>
        }
      >
        <BizForm form={form} setForm={setForm} />
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Deletion"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button onClick={handleDelete} className="btn-danger">
              Delete
            </button>
          </>
        }
      >
        <p className="text-slate-600">
          Are you sure you want to remove{" "}
          <strong>{deleteTarget?.businessName}</strong>?
        </p>
      </Modal>

      {/* VIEW MODAL */}
      <Modal
        isOpen={modal === "view"}
        onClose={() => {
          setModal(null);
          setSelected(null);
        }}
        title="Business Information"
        footer={
          <button
            onClick={() => {
              setModal(null);
              setSelected(null);
            }}
            className="btn-primary"
          >
            Close
          </button>
        }
      >
        {selected && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Business Name</p>
              <p className="font-semibold">{selected.businessName}</p>
            </div>

            <div>
              <p className="text-slate-400">Owner Name</p>
              <p className="font-semibold">{selected.ownerName}</p>
            </div>

            <div>
              <p className="text-slate-400">Business Type</p>
              <p className="font-semibold">{selected.businessType}</p>
            </div>

            <div>
              <p className="text-slate-400">Category</p>
              <p className="font-semibold">{selected.category}</p>
            </div>

            <div>
              <p className="text-slate-400">Contact Number</p>
              <p className="font-semibold">{selected.contactNumber}</p>
            </div>

            <div>
              <p className="text-slate-400">Permit Number</p>
              <p className="font-semibold">{selected.permitNumber}</p>
            </div>

            <div>
              <p className="text-slate-400">Permit Status</p>
              <p className="font-semibold">{selected.permitStatus}</p>
            </div>

            <div>
              <p className="text-slate-400">Permit Expiry</p>
              <p className="font-semibold">
                {formatDate(selected.permitExpiry)}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Capital Investment</p>
              <p className="font-semibold">₱{selected.capitalInvestment}</p>
            </div>

            <div>
              <p className="text-slate-400">Employee Count</p>
              <p className="font-semibold">{selected.employeeCount}</p>
            </div>

            <div className="col-span-2">
              <p className="text-slate-400">Address</p>
              <p className="font-semibold">{selected.address}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
