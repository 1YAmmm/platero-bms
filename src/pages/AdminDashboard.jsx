import { useState } from "react";

import Sidebar from "../components/Sidebar";

import Dashboard from "../modules/Dashboard/Dashboard";
import Residents from "../modules/Residents/Residents";
import Businesses from "../modules/Businesses/Businesses";
import Complaints from "../modules/Complaints/Complaints";
import Certificates from "../modules/Certificates/Certificates";
import Reports from "../modules/Reports/Reports";
import AdminAccounts from "../modules/AdminAccounts/AdminAccounts";

import { IconBell, IconUser } from "../assets/svg/Icons";

const MODULE_COMPONENTS = {
  dashboard: Dashboard,
  residents: Residents,
  businesses: Businesses,
  complaints: Complaints,
  certificates: Certificates,
  reports: Reports,
  admins: AdminAccounts,
};

const MODULE_TITLES = {
  dashboard: "Dashboard",
  residents: "Resident Management",
  businesses: "Business Registry",
  complaints: "Complaint Records",
  certificates: "Certificate Generator",
  reports: "Records & Reports",
  admins: "Admin Accounts",
};

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState("dashboard");

  const ActiveComponent = MODULE_COMPONENTS[activeModule] || Dashboard;

  return (
    <div className="min-h-screen flex bg-slate-100 overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar activeModule={activeModule} onNavigate={setActiveModule} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* TOP BAR */}
        <header className="h-[72px] bg-white border-b px-6 flex items-center justify-between shrink-0 shadow-sm z-30">
          <div>
            <h1 className="font-bold text-slate-800 text-lg hidden sm:block">
              {MODULE_TITLES[activeModule]}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Barangay Platero Management System
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 rounded-2xl px-3 py-1.5 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white">
                <IconUser size={16} />
              </div>

              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-700">
                  Admin User
                </p>
                <p className="text-xs text-slate-400">System Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-4 md:p-6">
            <ActiveComponent onNavigate={setActiveModule} />
          </div>
        </main>
      </div>
    </div>
  );
}
