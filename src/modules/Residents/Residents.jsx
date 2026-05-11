import { useEffect, useState } from "react";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import { FormField } from "../../components/Form";
import { calculateAge } from "../../ultils/CalculateAge";
import {
  createResident,
  listenResidents,
  updateResident,
  deleteResident,
} from "../../service/resident.service";
import {
  IconPlus,
  IconEdit,
  IconDelete,
  IconSearch,
  IconUser,
} from "../../assets/svg/Icons";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  middleName: "",
  birthdate: "",
  gender: "Male",
  civilStatus: "Single",
  purok: "Purok 1",
  contactNumber: "",
  email: "",
  occupation: "",
  voterStatus: "Registered Voter",
  soloParent: false,
  indigent: false,
  senior: false,
  pwd: false,
};

/* =========================
   STABLE FORM COMPONENT
========================= */
function ResidentForm({ form, setForm }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        ["firstName", "First Name"],
        ["lastName", "Last Name"],
        ["middleName", "Middle Name"],
        ["birthdate", "Birthdate", "date"],
        ["contactNumber", "Contact Number"],
        ["email", "Email"],
        ["occupation", "Occupation"],
      ].map(([key, label, type = "text"]) => (
        <FormField key={key} label={label}>
          <input
            type={type}
            className="input-field"
            value={form[key] || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                [key]: e.target.value,
              }))
            }
          />
        </FormField>
      ))}

      <FormField label="Gender">
        <select
          className="input-field"
          value={form.gender}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              gender: e.target.value,
            }))
          }
        >
          <option>Male</option>
          <option>Female</option>
        </select>
      </FormField>

      <FormField label="Civil Status">
        <select
          className="input-field"
          value={form.civilStatus}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              civilStatus: e.target.value,
            }))
          }
        >
          <option>Single</option>
          <option>Married</option>
          <option>Widower</option>
          <option>Separated</option>
        </select>
      </FormField>

      <FormField label="Purok">
        <select
          className="input-field"
          value={form.purok}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              purok: e.target.value,
            }))
          }
        >
          {["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </FormField>

      <div className="col-span-2">
        <label className="label mb-2">Special Classification</label>
        <div className="flex flex-wrap gap-4">
          {[
            ["soloParent", "Solo Parent"],
            ["indigent", "Indigent"],
            ["senior", "Senior Citizen"],
            ["pwd", "PWD"],
          ].map(([k, l]) => (
            <label key={k} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form[k]}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [k]: e.target.checked,
                  }))
                }
              />
              <span className="text-sm">{l}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ======================
     FIREBASE REALTIME READ
  ====================== */
  useEffect(() => {
    const unsubscribe = listenResidents(setResidents);
    return () => unsubscribe();
  }, []);
  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    civilStatus: "",
    purok: "",
    status: "",
    classification: "",
    age: "",
  });
  /* ======================
     SEARCH FILTER
  ====================== */
  const filtered = residents.filter((r) => {
    const q = filters.search.toLowerCase();
    const ageQuery = filters.age.toString();

    const matchesSearch =
      `${r.firstName} ${r.lastName} ${r.middleName}`
        .toLowerCase()
        .includes(q) ||
      r.id?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.contactNumber?.toLowerCase().includes(q);

    const matchesAge = filters.age ? String(r.age).includes(ageQuery) : true;

    const matchesGender = filters.gender ? r.gender === filters.gender : true;

    const matchesCivilStatus = filters.civilStatus
      ? r.civilStatus === filters.civilStatus
      : true;

    const matchesPurok = filters.purok ? r.purok === filters.purok : true;

    const matchesStatus = filters.status ? r.status === filters.status : true;

    const matchesClassification = filters.classification
      ? (filters.classification === "soloParent" && r.soloParent) ||
        (filters.classification === "indigent" && r.indigent) ||
        (filters.classification === "senior" && r.senior) ||
        (filters.classification === "pwd" && r.pwd)
      : true;

    return (
      matchesSearch &&
      matchesAge &&
      matchesGender &&
      matchesCivilStatus &&
      matchesPurok &&
      matchesStatus &&
      matchesClassification
    );
  });
  /* ======================
     MODALS
  ====================== */
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal("add");
  };

  const openEdit = (r) => {
    setForm(r);
    setSelected(r);
    setModal("edit");
  };

  const openView = (r) => {
    setSelected(r);
    setModal("view");
  };

  /* ======================
     SAVE (CREATE / UPDATE)
  ====================== */
  const handleSave = async () => {
    const age = calculateAge(form.birthdate);

    const payload = {
      ...form,
      age,
      status: "Active",
      registeredDate: new Date().toISOString().split("T")[0],
    };

    if (modal === "add") {
      await createResident(payload);
    } else {
      await updateResident(selected.id, payload);
    }

    setModal(null);
    setSelected(null);
    setForm(EMPTY_FORM);
  };

  /* ======================
     DELETE
  ====================== */
  const handleDelete = async () => {
    await deleteResident(deleteTarget.id);
    setDeleteTarget(null);
  };

  /* ======================
     TABLE COLUMNS (WITH ACTIONS)
  ====================== */
  const columns = [
    {
      key: "id",
      label: "ID",
      render: (v) => (
        <span className="badge badge-blue font-mono text-xs">{v}</span>
      ),
    },
    {
      key: "lastName",
      label: "Name",
      render: (v, r) => (
        <div>
          <p className="font-semibold text-slate-800">
            {r.firstName} {r.lastName}
          </p>
          <p className="text-xs text-slate-400">{r.purok}</p>
        </div>
      ),
    },
    { key: "gender", label: "Gender" },
    { key: "age", label: "Age" },
    { key: "civilStatus", label: "Civil Status" },
    { key: "contactNumber", label: "Contact" },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <span
          className={`badge ${v === "Active" ? "badge-green" : "badge-gray"}`}
        >
          {v}
        </span>
      ),
    },

    /* ======================
       ACTION BUTTONS
    ====================== */
    {
      key: "actions",
      label: "Actions",
      render: (_, r) => (
        <div className="flex gap-2">
          <button
            onClick={() => openView(r)}
            className="btn-sm bg-blue-50 text-blue-700 px-2 py-1 rounded"
          >
            <IconUser size={14} />
          </button>

          <button
            onClick={() => openEdit(r)}
            className="btn-sm bg-amber-50 text-amber-700 px-2 py-1 rounded"
          >
            <IconEdit size={14} />
          </button>

          <button
            onClick={() => setDeleteTarget(r)}
            className="btn-sm bg-red-50 text-red-600 px-2 py-1 rounded"
          >
            <IconDelete size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title">Resident Management</h2>
          <p className="section-subtitle">
            {residents.length} registered residents
          </p>
        </div>

        <button
          onClick={openAdd}
          className="btn-primary inline-flex items-center gap-2"
        >
          <IconPlus size={18} />
          Add Resident
        </button>
      </div>

      {/* SEARCH */}
      <div className="glass-card p-4 mb-5 flex flex-col gap-3">
        {/* Search Input */}
        <div className="relative">
          <IconSearch className="absolute left-3 top-3 text-slate-400" />
          <input
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            className="input-field pl-10"
            placeholder="Search name, email, ID, contact..."
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Gender */}
          <select
            className="input-field"
            value={filters.gender}
            onChange={(e) =>
              setFilters((p) => ({ ...p, gender: e.target.value }))
            }
          >
            <option value="">All Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          {/* Civil Status */}
          <select
            className="input-field"
            value={filters.civilStatus}
            onChange={(e) =>
              setFilters((p) => ({ ...p, civilStatus: e.target.value }))
            }
          >
            <option value="">Civil Status</option>
            <option>Single</option>
            <option>Married</option>
            <option>Widower</option>
            <option>Separated</option>
          </select>

          {/* Purok */}
          <select
            className="input-field"
            value={filters.purok}
            onChange={(e) =>
              setFilters((p) => ({ ...p, purok: e.target.value }))
            }
          >
            <option value="">All Purok</option>
            {["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5"].map(
              (p) => (
                <option key={p}>{p}</option>
              ),
            )}
          </select>

          {/* Classification */}
          <select
            className="input-field"
            value={filters.classification}
            onChange={(e) =>
              setFilters((p) => ({ ...p, classification: e.target.value }))
            }
          >
            <option value="">Classification</option>
            <option value="soloParent">Solo Parent</option>
            <option value="indigent">Indigent</option>
            <option value="senior">Senior Citizen</option>
            <option value="pwd">PWD</option>
          </select>
          <input
            type="number"
            className="input-field"
            placeholder="Age"
            value={filters.age}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                age: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-card overflow-hidden">
        <Table columns={columns} data={filtered} />
      </div>

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={modal === "add" || modal === "edit"}
        onClose={() => setModal(null)}
        title={modal === "add" ? "Register Resident" : "Edit Resident"}
        footer={
          <>
            <button onClick={() => setModal(null)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary">
              {modal === "add" ? "Register" : "Save Changes"}
            </button>
          </>
        }
      >
        <ResidentForm form={form} setForm={setForm} />
      </Modal>

      {/* VIEW MODAL */}
      <Modal
        isOpen={modal === "view"}
        onClose={() => setModal(null)}
        title="Resident Profile"
      >
        {selected && (
          <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {selected.firstName} {selected.middleName} {selected.lastName}
                </h2>
                <p className="text-sm text-slate-500">
                  Resident ID: {selected.id}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${
                  selected.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {selected.status}
              </span>
            </div>

            {/* GRID SECTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PERSONAL INFO */}
              <div className="p-4 rounded-xl bg-white border shadow-sm">
                <h3 className="text-sm font-semibold text-slate-500 mb-3">
                  Personal Information
                </h3>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-slate-500">Birthdate:</span>{" "}
                    {selected.birthdate}
                  </p>
                  <p>
                    <span className="text-slate-500">Age:</span> {selected.age}
                  </p>
                  <p>
                    <span className="text-slate-500">Gender:</span>{" "}
                    {selected.gender}
                  </p>
                  <p>
                    <span className="text-slate-500">Civil Status:</span>{" "}
                    {selected.civilStatus}
                  </p>
                  <p>
                    <span className="text-slate-500">Occupation:</span>{" "}
                    {selected.occupation}
                  </p>
                </div>
              </div>

              {/* CONTACT */}
              <div className="p-4 rounded-xl bg-white border shadow-sm">
                <h3 className="text-sm font-semibold text-slate-500 mb-3">
                  Contact Information
                </h3>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-slate-500">Phone:</span>{" "}
                    {selected.contactNumber}
                  </p>
                  <p>
                    <span className="text-slate-500">Email:</span>{" "}
                    {selected.email}
                  </p>
                </div>
              </div>

              {/* RESIDENCY */}
              <div className="p-4 rounded-xl bg-white border shadow-sm">
                <h3 className="text-sm font-semibold text-slate-500 mb-3">
                  Residency
                </h3>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-slate-500">Purok:</span>{" "}
                    {selected.purok}
                  </p>
                  <p>
                    <span className="text-slate-500">Registered:</span>{" "}
                    {selected.registeredDate}
                  </p>
                </div>
              </div>

              {/* CLASSIFICATION */}
              <div className="p-4 rounded-xl bg-white border shadow-sm">
                <h3 className="text-sm font-semibold text-slate-500 mb-3">
                  Classification
                </h3>

                <div className="flex flex-wrap gap-2">
                  {selected.soloParent && (
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                      Solo Parent
                    </span>
                  )}
                  {selected.indigent && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                      Indigent
                    </span>
                  )}
                  {selected.senior && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      Senior Citizen
                    </span>
                  )}
                  {selected.pwd && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                      PWD
                    </span>
                  )}

                  {/* 👇 THIS IS THE FIX */}
                  {!selected.soloParent &&
                    !selected.indigent &&
                    !selected.senior &&
                    !selected.pwd && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                        None
                      </span>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
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
        <p>
          Are you sure you want to delete{" "}
          <b>
            {deleteTarget?.firstName} {deleteTarget?.lastName}
          </b>
          ?
        </p>
      </Modal>
    </div>
  );
}
