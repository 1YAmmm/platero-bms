import { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { FormField } from "../../components/Form";
import Toast from "../../components/Toast";

import { registerAdmin, resetAdminPassword } from "../../lib/auth/admin.auth";
import {
  listenAdmins,
  deleteAdmin,
  updateAdmin,
} from "../../service/admin.service";

import {
  IconPlus,
  IconEdit,
  IconDelete,
  IconEye,
  IconEyeOff,
} from "../../assets/svg/Icons";

const EMPTY_FORM = {
  id: "",
  password: "",
  fullName: "",
  email: "",
  status: "Active",
};

/* ===================== FORM ===================== */
function AdminForm({
  form,
  setForm,
  modal,
  showPass,
  setShowPass,
  onResetPassword,
  resetLoading,
  resetSuccess,
}) {
  return (
    <div className="space-y-4">
      {/* FULL NAME */}
      <FormField label="Full Name" required>
        <input
          className="input-field"
          value={form.fullName}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, fullName: e.target.value }))
          }
        />
      </FormField>

      {/* EMAIL */}
      <FormField label="Email">
        <input
          type="email"
          className="input-field"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </FormField>

      {/* PASSWORD (ADD ONLY) */}
      {modal === "add" && (
        <FormField label="Password" required>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="input-field pr-10"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
            />

            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPass ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            </button>
          </div>
        </FormField>
      )}

      {/* RESET PASSWORD (EDIT ONLY) */}
      {modal === "edit" && (
        <div className="pt-2 space-y-1">
          <button
            type="button"
            disabled={resetLoading}
            onClick={() => onResetPassword(form)}
            className="text-sm text-blue-600 hover:underline font-medium disabled:opacity-50"
          >
            {resetLoading ? "Sending..." : "Reset Password"}
          </button>

          {resetSuccess && (
            <p className="text-xs text-green-600">
              Reset email sent successfully
            </p>
          )}
        </div>
      )}

      {/* STATUS */}
      <FormField label="Status">
        <select
          className="input-field"
          value={form.status}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </FormField>
    </div>
  );
}

/* ===================== MAIN ===================== */
export default function AdminAccounts() {
  const [admins, setAdmins] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPass, setShowPass] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // TOAST STATE
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  /* ===================== LOAD ADMINS ===================== */
  useEffect(() => {
    const unsubscribe = listenAdmins(setAdmins);
    return () => unsubscribe();
  }, []);

  /* ===================== TOAST ===================== */
  const showMessage = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 3000);
  };

  /* ===================== OPEN MODALS ===================== */
  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setModal("add");
  };

  const openEdit = (a) => {
    setForm({ ...EMPTY_FORM, ...a });
    setModal("edit");
    setResetSuccess(false);
  };

  /* ===================== SAVE ===================== */
  const handleSave = async () => {
    try {
      if (modal === "add") {
        await registerAdmin(form.email, form.password, form.fullName);
        showMessage("Success: Admin added successfully", "success");
      }

      if (modal === "edit") {
        await updateAdmin(form.id, {
          fullName: form.fullName,
          email: form.email,
          status: form.status,
        });

        showMessage("Success: Admin updated successfully", "success");
      }

      setModal(null);
      setForm({ ...EMPTY_FORM });
    } catch (err) {
      console.error(err);
      showMessage("Error: Failed to save admin", "error");
    }
  };

  /* ===================== DELETE ===================== */
  const handleDelete = async () => {
    try {
      await deleteAdmin(deleteTarget.id);
      setDeleteTarget(null);

      showMessage("Success: Admin deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showMessage("Error: Failed to delete admin", "error");
    }
  };

  /* ===================== RESET PASSWORD ===================== */
  const handleResetPassword = async (admin) => {
    try {
      setResetLoading(true);
      setResetSuccess(false);

      await resetAdminPassword(admin.email);

      setResetSuccess(true);
      showMessage("Success: Reset email sent", "success");
    } catch (err) {
      console.error(err);
      showMessage("Error: Failed to send reset email", "error");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* TOAST */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title">Admin Accounts</h2>
          <p className="section-subtitle">{admins.length} admin user(s)</p>
        </div>

        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2"
        >
          <IconPlus size={18} /> Create Account
        </button>
      </div>

      {/* LIST */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {admins.map((a) => (
          <div key={a.id} className="glass-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-800">
                  {a.fullName?.[0] || "A"}
                </div>

                <div>
                  <p className="font-bold text-slate-800">{a.fullName}</p>
                  <p className="text-xs text-slate-500">{a.email}</p>
                </div>
              </div>

              <span
                className={`badge ${
                  a.status === "Active" ? "badge-green" : "badge-gray"
                }`}
              >
                {a.status}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(a)}
                className="flex-1 btn-secondary btn-sm"
              >
                <IconEdit size={14} /> Edit
              </button>

              <button
                onClick={() => setDeleteTarget(a)}
                className="btn-sm bg-red-50 text-red-600 px-3 rounded-lg"
              >
                <IconDelete size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={modal === "add" || modal === "edit"}
        onClose={() => setModal(null)}
        title={modal === "add" ? "Create Admin" : "Edit Admin"}
        footer={
          <>
            <button onClick={() => setModal(null)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary">
              {modal === "add" ? "Create" : "Save"}
            </button>
          </>
        }
      >
        <AdminForm
          form={form}
          setForm={setForm}
          modal={modal}
          showPass={showPass}
          setShowPass={setShowPass}
          onResetPassword={handleResetPassword}
          resetLoading={resetLoading}
          resetSuccess={resetSuccess}
        />
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Admin"
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
        Are you sure you want to delete{" "}
        <strong>{deleteTarget?.fullName}</strong>?
      </Modal>
    </div>
  );
}
