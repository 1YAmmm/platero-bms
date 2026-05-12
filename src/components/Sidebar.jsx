import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../lib/auth/admin.auth";
import platerologo from "../assets/image/platerologo.webp";
import Modal from "./Modal";
import {
  IconDashboard,
  IconUsers,
  IconBusiness,
  IconComplaint,
  IconCertificate,
  IconReports,
  IconAdmin,
  IconLogout,
  IconMenu,
  IconClose,
} from "../assets/svg/Icons";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: IconDashboard },
  { key: "residents", label: "Residents", icon: IconUsers },
  { key: "businesses", label: "Businesses", icon: IconBusiness },
  { key: "complaints", label: "Complaints", icon: IconComplaint },
  { key: "certificates", label: "Certificates", icon: IconCertificate },
  { key: "reports", label: "Records", icon: IconReports },
  { key: "admins", label: "Admin Accounts", icon: IconAdmin },
];

export default function Sidebar({ activeModule, onNavigate }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  //  NEW: modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = async () => {
    try {
      await logoutAdmin();
      setShowLogoutModal(false);
      setMobileOpen(false);
      // localStorage.removeItem("user");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-blue-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-400 flex items-center justify-center flex-shrink-0">
            <img
              src={platerologo}
              alt="Barangay Platero logo"
              loading="lazy"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div>
            <p className="text-white font-bold text-sm">Brgy. Platero</p>
            <p className="text-blue-300 text-xs">Management System</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              onNavigate(key);
              setMobileOpen(false);
            }}
            className={`sidebar-link w-full text-left ${
              activeModule === key ? "active" : ""
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-blue-900">
        <button
          onClick={() => setShowLogoutModal(true)} // 🔥 OPEN MODAL
          className="sidebar-link w-full text-left text-red-300 hover:bg-red-900/30 hover:text-red-200"
        >
          <IconLogout size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded-xl shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-40 w-64 bg-blue-950 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-950 min-h-screen">
        <SidebarContent />
      </aside>
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        subtitle="Are you sure you want to logout?"
        footer={
          <>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              No
            </button>

            <button
              onClick={confirmLogout}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              Yes
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          You will be signed out of your admin session.
        </p>
      </Modal>
    </>
  );
}
