import { useState, useCallback } from "react";
import { COMPLAINTS, generateId, formatDate } from "../../data/mockData";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

import { FormField } from "../../components/Form";
import {
  IconPlus,
  IconEdit,
  IconSearch,
  IconEye,
  IconDelete,
} from "../../assets/svg/Icons";

const CATEGORIES = [
  "Noise Disturbance",
  "Waste Management",
  "Property Damage",
  "Domestic Dispute",
  "Theft",
  "Illegal Construction",
  "Water/Flooding",
  "Other",
];

const STATUSES = ["Pending", "Under Investigation", "Resolved", "Dismissed"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const EMPTY_FORM = {
  complainantName: "",
  complainantAddress: "",
  complainantContact: "",
  respondentName: "",
  category: "Noise Disturbance",
  description: "",
  status: "Pending",
  priority: "Medium",
  assignedTo: "",
  notes: "",
  dateFiled: new Date().toISOString().split("T")[0],
  dateResolved: "",
};

export default function Complaints() {
  const [complaints, setComplaints] = useState(COMPLAINTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  /* ================= FILTER ================= */
  const filtered = complaints.filter((c) => {
    const textMatch =
      `${c.complainantName} ${c.id} ${c.category} ${c.respondentName}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const statusMatch = statusFilter === "All" || c.status === statusFilter;

    const priorityMatch =
      priorityFilter === "All" || c.priority === priorityFilter;

    return textMatch && statusMatch && priorityMatch;
  });

  /* ================= MODAL ACTIONS ================= */
  const openAdd = useCallback(() => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal("add");
  }, []);

  const openEdit = useCallback((c) => {
    setSelected(c);
    setForm({ ...EMPTY_FORM, ...c });
    setModal("edit");
  }, []);

  const openDelete = useCallback((c) => {
    setDeleteTarget(c);
  }, []);
  const confirmDelete = useCallback(() => {
    setComplaints((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  }, [deleteTarget]);

  const openView = useCallback((c) => {
    setSelected(c);
    setModal("view");
  }, []);

  const handleSave = useCallback(() => {
    if (modal === "add") {
      const newItem = {
        ...form,
        id: generateId("CMP", complaints),
      };
      setComplaints((prev) => [...prev, newItem]);
    } else {
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === selected.id ? { ...form, id: selected.id } : c,
        ),
      );
    }
    setModal(null);
  }, [modal, form, complaints, selected]);

  /* ================= COLORS ================= */
  const statusColor = (s) =>
    ({
      Pending: "badge-yellow",
      "Under Investigation": "badge-blue",
      Resolved: "badge-green",
      Dismissed: "badge-gray",
    })[s] || "badge-gray";

  const priorityColor = (p) =>
    ({
      Low: "badge-gray",
      Medium: "badge-blue",
      High: "badge-yellow",
      Urgent: "badge-red",
    })[p] || "badge-gray";

  /* ================= TABLE ================= */
  const columns = [
    {
      key: "id",
      label: "ID",
      render: (v) => (
        <span className="font-mono text-xs text-slate-500">{v}</span>
      ),
    },
    {
      key: "complainantName",
      label: "Complainant",
      render: (v, r) => (
        <div>
          <p className="font-semibold text-slate-800">{v}</p>
          <p className="text-xs text-slate-400">{r.category}</p>
        </div>
      ),
    },
    { key: "respondentName", label: "Respondent" },
    {
      key: "priority",
      label: "Priority",
      render: (v) => <span className={`badge ${priorityColor(v)}`}>{v}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (v) => <span className={`badge ${statusColor(v)}`}>{v}</span>,
    },
    { key: "dateFiled", label: "Filed", render: (v) => formatDate(v) },
    { key: "assignedTo", label: "Assigned To" },
    {
      key: "id",
      label: "Actions",
      render: (_, r) => (
        <div className="flex gap-1">
          <button
            onClick={() => openView(r)}
            className="btn-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg"
          >
            <IconEye size={14} />
          </button>
          <button
            onClick={() => openEdit(r)}
            className="btn-sm bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg"
          >
            <IconEdit size={14} />
          </button>
          <button
            onClick={() => openDelete(r)}
            className="btn-sm bg-red-50 text-red-700 hover:bg-red-100 px-2.5 py-1.5 rounded-lg"
          >
            <IconDelete size={14} />
          </button>
        </div>
      ),
    },
  ];

  /* ================= UI ================= */
  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title">Complaint Records</h2>
          <p className="section-subtitle">
            {complaints.length} total complaints
          </p>
        </div>

        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2"
        >
          <IconPlus size={18} /> File Complaint
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="glass-card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        {/* SEARCH */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-field pl-9"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* STATUS */}
        <div className="flex gap-2 flex-wrap">
          {["All", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium ${
                statusFilter === s
                  ? "bg-blue-800 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* PRIORITY */}
        <div className="flex gap-2 flex-wrap">
          {["All", ...PRIORITIES].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-2 rounded-lg text-xs font-medium ${
                priorityFilter === p
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-card overflow-hidden">
        <Table columns={columns} data={filtered} />
      </div>

      {/* MODAL */}
      <Modal
        isOpen={modal === "add" || modal === "edit"}
        onClose={() => setModal(null)}
        title={modal === "add" ? "File New Complaint" : "Update Complaint"}
        footer={
          <>
            <button onClick={() => setModal(null)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary">
              {modal === "add" ? "Submit" : "Save"}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Complainant Name" required>
            <input
              className="input-field"
              value={form.complainantName}
              onChange={(e) =>
                setForm((p) => ({ ...p, complainantName: e.target.value }))
              }
            />
          </FormField>

          <FormField label="Contact Number">
            <input
              className="input-field"
              value={form.complainantContact}
              onChange={(e) =>
                setForm((p) => ({ ...p, complainantContact: e.target.value }))
              }
            />
          </FormField>

          <div className="col-span-2">
            <FormField label="Complainant Address">
              <input
                className="input-field"
                value={form.complainantAddress}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    complainantAddress: e.target.value,
                  }))
                }
              />
            </FormField>
          </div>

          <FormField label="Respondent/Subject">
            <input
              className="input-field"
              value={form.respondentName}
              onChange={(e) =>
                setForm((p) => ({ ...p, respondentName: e.target.value }))
              }
            />
          </FormField>

          <FormField label="Category">
            <select
              className="input-field"
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Priority">
            <select
              className="input-field"
              value={form.priority}
              onChange={(e) =>
                setForm((p) => ({ ...p, priority: e.target.value }))
              }
            >
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Assigned To">
            <input
              className="input-field"
              value={form.assignedTo}
              onChange={(e) =>
                setForm((p) => ({ ...p, assignedTo: e.target.value }))
              }
            />
          </FormField>

          <FormField label="Status">
            <select
              className="input-field"
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({ ...p, status: e.target.value }))
              }
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Description" required>
            <textarea
              className="input-field resize-none col-span-2"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />
          </FormField>

          <FormField label="Notes / Resolution">
            <textarea
              className="input-field resize-none col-span-2"
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
            />
          </FormField>
        </div>
      </Modal>
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Complaint"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button
              onClick={confirmDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="p-2">
          <p className="text-slate-700">
            Are you sure you want to delete this complaint?
          </p>

          {deleteTarget && (
            <div className="mt-3 text-sm text-slate-500">
              <p>
                <b>ID:</b> {deleteTarget.id}
              </p>
              <p>
                <b>Complainant:</b> {deleteTarget.complainantName}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
