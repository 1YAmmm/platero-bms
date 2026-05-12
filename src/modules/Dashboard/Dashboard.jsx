import { useEffect, useState } from "react";

import { formatDate } from "../../data/mockData";

import {
  IconUsers,
  IconBusiness,
  IconComplaint,
  IconCertificate,
} from "../../assets/svg/Icons";

import { listenCertificates } from "../../service/certificate.service";
import { listenResidents } from "../../service/resident.service";
import { listenBusinesses } from "../../service/business.service";
import { listenComplaints } from "../../service/complaints.service";

function StatCard({ icon: Icon, label, value, sub, bg, iconColor, trend }) {
  return (
    <div className="glass-card p-5 flex items-start gap-4">
      <div
        className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={22} className={iconColor} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-slate-500 text-sm">{label}</p>

        <p className="text-3xl font-bold text-slate-800 leading-tight">
          {value}
        </p>

        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>

      {trend && <span className="badge badge-green text-xs">{trend}</span>}
    </div>
  );
}

function QuickActivity({ items }) {
  const typeStyle = {
    Certificate: { dot: "bg-emerald-400", badge: "badge-green" },
    Registration: { dot: "bg-blue-400", badge: "badge-blue" },
    Complaint: { dot: "bg-amber-400", badge: "badge-yellow" },
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const style = typeStyle[item.type] || {
          dot: "bg-gray-300",
          badge: "badge-gray",
        };

        return (
          <div
            key={i}
            className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0"
          >
            <div
              className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`}
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 font-medium truncate">
                {item.detail}
              </p>

              <p className="text-xs text-slate-400">{formatDate(item.date)}</p>
            </div>

            <span className={`badge ${style.badge} text-xs flex-shrink-0`}>
              {item.type}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard({ onNavigate }) {
  // STATES
  const [residents, setResidents] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // FIREBASE LISTENERS
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

    const unsubscribeCertificates = listenCertificates((data) => {
      setCertificates(data || []);
    });

    return () => {
      unsubscribeResidents && unsubscribeResidents();
      unsubscribeBusinesses && unsubscribeBusinesses();
      unsubscribeComplaints && unsubscribeComplaints();
      unsubscribeCertificates && unsubscribeCertificates();
    };
  }, []);

  // DYNAMIC COUNTS
  const totalResidents = residents.length;

  const activeBusinesses = businesses.filter(
    (b) => b.permitStatus === "Active",
  ).length;

  const pendingComplaints = complaints.filter(
    (c) => c.status === "Pending",
  ).length;

  const certsIssued = certificates.length;

  const seniorCount = residents.filter((r) => r.senior).length;

  const soloParentCount = residents.filter((r) => r.soloParent).length;

  const indigentCount = residents.filter((r) => r.indigent).length;

  const expiredPermits = businesses.filter(
    (b) => b.permitStatus === "Expired",
  ).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === "Resolved",
  ).length;

  const quickLinks = [
    {
      label: "Register Resident",
      key: "residents",
      emoji: "👤",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      label: "New Business",
      key: "businesses",
      emoji: "🏢",
      color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    },
    {
      label: "File Complaint",
      key: "complaints",
      emoji: "⚠️",
      color: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    },
    {
      label: "Issue Certificate",
      key: "certificates",
      emoji: "📄",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>

          <p className="text-slate-500 text-sm">
            Welcome back ·{" "}
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-xs font-semibold text-blue-700">
            System Online
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={IconUsers}
          label="Total Residents"
          value={totalResidents}
          sub={`${seniorCount} senior · ${soloParentCount} solo parent`}
          bg="bg-blue-100"
          iconColor="text-blue-700"
          trend="+2 this month"
        />

        <StatCard
          icon={IconBusiness}
          label="Active Businesses"
          value={activeBusinesses}
          sub={`${expiredPermits} permit(s) expired`}
          bg="bg-emerald-100"
          iconColor="text-emerald-700"
        />

        <StatCard
          icon={IconComplaint}
          label="Pending Complaints"
          value={pendingComplaints}
          sub={`${resolvedComplaints} resolved total`}
          bg="bg-amber-100"
          iconColor="text-amber-700"
        />

        <StatCard
          icon={IconCertificate}
          label="Certificates Issued"
          value={certsIssued}
          sub="All time"
          bg="bg-purple-100"
          iconColor="text-purple-700"
          trend="↑ Active"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Senior Citizens",
            value: seniorCount,
            color: "text-blue-700",
            bg: "bg-blue-50",
          },
          {
            label: "Solo Parents",
            value: soloParentCount,
            color: "text-amber-700",
            bg: "bg-amber-50",
          },
          {
            label: "Indigent",
            value: indigentCount,
            color: "text-red-700",
            bg: "bg-red-50",
          },
          {
            label: "Total Businesses",
            value: businesses.length,
            color: "text-emerald-700",
            bg: "bg-emerald-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} rounded-2xl p-4 text-center border border-white`}
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>

            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((ql) => (
            <button
              key={ql.key}
              onClick={() => onNavigate(ql.key)}
              className={`${ql.color} border rounded-2xl p-4 text-left transition-all hover:shadow-md active:scale-95`}
            >
              <span className="text-2xl block mb-2">{ql.emoji}</span>

              <span className="text-sm font-semibold text-slate-700">
                {ql.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
