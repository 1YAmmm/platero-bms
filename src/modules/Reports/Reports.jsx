import { useEffect, useMemo, useState } from "react";
import { formatDate } from "../../data/mockData";
import { IconDownload } from "../../assets/svg/Icons";

import { listenCertificates } from "../../service/certificate.service";
import { listenResidents } from "../../service/resident.service";
import { listenBusinesses } from "../../service/business.service";
import { listenComplaints } from "../../service/complaints.service";
import { exportToExcel } from "../../ultils/exportToExcel";
const PERIODS = ["Daily", "Weekly", "Monthly"];

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={`glass-card p-5 border-l-4 ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-sm">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>

      <p className="text-3xl font-bold text-slate-800">{value}</p>

      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Reports() {
  const [period, setPeriod] = useState("Monthly");

  const [residents, setResidents] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // =========================
  // REALTIME LISTENERS
  // =========================
  useEffect(() => {
    const unsubResidents = listenResidents((data) => {
      setResidents(data || []);
    });

    const unsubBusinesses = listenBusinesses((data) => {
      setBusinesses(data || []);
    });

    const unsubComplaints = listenComplaints((data) => {
      setComplaints(data || []);
    });

    const unsubCertificates = listenCertificates((data) => {
      setCertificates(data || []);
    });

    return () => {
      if (unsubResidents) unsubResidents();
      if (unsubBusinesses) unsubBusinesses();
      if (unsubComplaints) unsubComplaints();
      if (unsubCertificates) unsubCertificates();
    };
  }, []);

  // =========================
  // FILTER FUNCTION
  // =========================
  const isWithinPeriod = (dateValue) => {
    if (!dateValue) return false;

    const date = new Date(dateValue);
    const now = new Date();

    // DAILY
    if (period === "Daily") {
      return date.toDateString() === now.toDateString();
    }

    // WEEKLY
    if (period === "Weekly") {
      const firstDay = new Date(now);
      firstDay.setHours(0, 0, 0, 0);
      firstDay.setDate(now.getDate() - now.getDay());

      const lastDay = new Date(firstDay);
      lastDay.setDate(firstDay.getDate() + 6);
      lastDay.setHours(23, 59, 59, 999);

      return date >= firstDay && date <= lastDay;
    }

    // MONTHLY
    if (period === "Monthly") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    return true;
  };

  // =========================
  // FILTERED DATA
  // =========================
  const filteredResidents = useMemo(() => {
    return residents.filter((r) => isWithinPeriod(r.registeredDate));
  }, [residents, period]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) =>
      isWithinPeriod(b.createdAt || b.registeredDate || b.date),
    );
  }, [businesses, period]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => isWithinPeriod(c.dateFiled));
  }, [complaints, period]);

  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => isWithinPeriod(c.issuedDate));
  }, [certificates, period]);

  // =========================
  // COUNTS
  // =========================
  const totalResidents = filteredResidents.length;

  const activeBusinesses = filteredBusinesses.filter(
    (b) => b.permitStatus === "Active",
  ).length;

  const pendingComplaints = filteredComplaints.filter(
    (c) => c.status === "Pending",
  ).length;

  const certsIssued = filteredCertificates.length;

  const seniorCount = filteredResidents.filter((r) => r.senior).length;

  const soloParentCount = filteredResidents.filter((r) => r.soloParent).length;

  const indigentCount = filteredResidents.filter((r) => r.indigent).length;

  const expiredPermits = filteredBusinesses.filter(
    (b) => b.permitStatus === "Expired",
  ).length;

  const resolvedComplaints = filteredComplaints.filter(
    (c) => c.status === "Resolved",
  ).length;

  // =========================
  // CERTIFICATE BREAKDOWN
  // =========================
  const certBreakdown = [
    "Barangay Clearance",
    "Business Permit",
    "Solo Parent Certificate",
    "Certificate of Indigency",
    "Complaint Certification",
  ].map((type) => ({
    type,
    count: filteredCertificates.filter((c) => c.type === type).length,
  }));

  // =========================
  // COMPLAINT BREAKDOWN
  // =========================
  const complaintBreakdown = [
    ...new Set(filteredComplaints.map((c) => c.category)),
  ].map((cat) => ({
    cat,
    count: filteredComplaints.filter((c) => c.category === cat).length,
  }));

  // =========================
  // TRANSACTIONS
  // =========================
  const transactions = [
    ...filteredCertificates.map((c) => ({
      date: c.issuedDate,
      type: "Certificate",
      detail: `${c.type} – ${c.residentName || ""}`,
      amount: c.fee || "0.00",
      module: "Certificates",
    })),

    ...filteredResidents.map((r) => ({
      date: r.registeredDate,
      type: "Registration",
      detail: `Resident: ${r.firstName || ""} ${r.lastName || ""}`,
      amount: "0.00",
      module: "Residents",
    })),

    ...filteredComplaints.map((c) => ({
      date: c.dateFiled,
      type: "Complaint",
      detail: `${c.category || ""} by ${c.complainantName || ""}`,
      amount: "0.00",
      module: "Complaints",
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const moduleColor = {
    Certificate: "badge-green",
    Registration: "badge-blue",
    Complaint: "badge-red",
  };
  const handleExport = () => {
    const data = transactions.map((t) => ({
      Date: formatDate(t.date),
      Type: t.type,
      Details: t.detail,
      Module: t.module,
      Amount: t.amount,
    }));

    exportToExcel({
      data,
      fileName: `reports-${period.toLowerCase()}`,
      sheetName: "Reports",
    });
  };
  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title">Records & Reports</h2>

          <p className="section-subtitle">Overview and transaction history</p>
        </div>

        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                period === p
                  ? "bg-blue-800 text-white shadow"
                  : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon="👥"
          label="Total Residents"
          value={totalResidents}
          sub={`${seniorCount} senior, ${soloParentCount} solo parent`}
          color="border-blue-600"
        />

        <StatCard
          icon="🏢"
          label="Active Businesses"
          value={activeBusinesses}
          sub={`${expiredPermits} expired permit(s)`}
          color="border-emerald-500"
        />

        <StatCard
          icon="⚠️"
          label="Pending Complaints"
          value={pendingComplaints}
          sub={`${resolvedComplaints} resolved`}
          color="border-amber-500"
        />

        <StatCard
          icon="📄"
          label="Certificates Issued"
          value={certsIssued}
          sub={`Total ${period.toLowerCase()}`}
          color="border-purple-500"
        />
      </div>

      {/* BREAKDOWNS */}
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        {/* CERTIFICATES */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-slate-800 mb-4">
            Certificates by Type
          </h3>

          <div className="space-y-3">
            {certBreakdown.map(({ type, count }) => (
              <div key={type} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 flex-1 truncate">
                  {type}
                </span>

                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-800 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        certsIssued ? (count / certsIssued) * 100 : 0
                      }%`,
                    }}
                  />
                </div>

                <span className="font-bold text-slate-800 text-sm w-6 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RESIDENTS */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-slate-800 mb-4">
            Resident Classification
          </h3>

          <div className="space-y-3">
            {[
              {
                label: "Regular Residents",
                count:
                  totalResidents -
                  seniorCount -
                  soloParentCount -
                  indigentCount,
                color: "bg-blue-500",
              },
              {
                label: "Senior Citizens",
                count: seniorCount,
                color: "bg-emerald-500",
              },
              {
                label: "Solo Parents",
                count: soloParentCount,
                color: "bg-amber-500",
              },
              {
                label: "Indigent",
                count: indigentCount,
                color: "bg-red-500",
              },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 flex-1">{label}</span>

                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full transition-all`}
                    style={{
                      width: `${
                        totalResidents ? (count / totalResidents) * 100 : 0
                      }%`,
                    }}
                  />
                </div>

                <span className="font-bold text-slate-800 text-sm w-6 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* COMPLAINTS */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-slate-800 mb-4">
            Complaints by Category
          </h3>

          <div className="space-y-3">
            {complaintBreakdown.map(({ cat, count }) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 flex-1">{cat}</span>

                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${
                        filteredComplaints.length
                          ? (count / filteredComplaints.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <span className="font-bold text-slate-800 text-sm w-6 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BUSINESSES */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-slate-800 mb-4">Business by Type</h3>

          <div className="space-y-3">
            {[...new Set(filteredBusinesses.map((b) => b.businessType))].map(
              (type) => {
                const count = filteredBusinesses.filter(
                  (b) => b.businessType === type,
                ).length;

                return (
                  <div key={type} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 flex-1">
                      {type}
                    </span>

                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{
                          width: `${
                            filteredBusinesses.length
                              ? (count / filteredBusinesses.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    <span className="font-bold text-slate-800 text-sm w-6 text-right">
                      {count}
                    </span>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* TRANSACTION LOG */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Transaction Log</h3>

          <button
            onClick={handleExport}
            className="btn-secondary btn-sm flex items-center gap-2 text-xs"
          >
            <IconDownload size={14} />
            Export
          </button>
        </div>

        <div className="table-wrapper bg-white">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Details</th>
                <th>Module</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t, i) => (
                <tr key={i}>
                  <td className="text-slate-500 text-xs">
                    {formatDate(t.date)}
                  </td>

                  <td>
                    <span
                      className={`badge ${moduleColor[t.type] || "badge-gray"}`}
                    >
                      {t.type}
                    </span>
                  </td>

                  <td className="max-w-xs truncate">{t.detail}</td>

                  <td>
                    <span className="text-xs text-slate-500">{t.module}</span>
                  </td>

                  <td className="font-medium">₱{t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
