import { useState } from 'react';
import { RESIDENTS, BUSINESSES, COMPLAINTS, CERTIFICATES, ANNOUNCEMENTS, BARANGAY_INFO, formatDate } from '../../data/mockData';
import { IconUsers, IconBusiness, IconComplaint, IconCertificate, IconCalendar, IconBell } from '../../assets/svg/Icons';

function StatCard({ icon: Icon, label, value, sub, bg, iconColor, trend }) {
  return (
    <div className="glass-card p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-500 text-sm">{label}</p>
        <p className="text-3xl font-bold text-slate-800 leading-tight">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {trend && (
        <span className="badge badge-green text-xs">{trend}</span>
      )}
    </div>
  );
}

function QuickActivity({ items }) {
  const typeStyle = {
    Certificate: { dot: 'bg-emerald-400', badge: 'badge-green' },
    Registration: { dot: 'bg-blue-400', badge: 'badge-blue' },
    Complaint: { dot: 'bg-amber-400', badge: 'badge-yellow' },
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const style = typeStyle[item.type] || { dot: 'bg-gray-300', badge: 'badge-gray' };
        return (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 font-medium truncate">{item.detail}</p>
              <p className="text-xs text-slate-400">{formatDate(item.date)}</p>
            </div>
            <span className={`badge ${style.badge} text-xs flex-shrink-0`}>{item.type}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard({ onNavigate }) {
  const totalResidents = RESIDENTS.length;
  const activeBusinesses = BUSINESSES.filter(b => b.permitStatus === 'Active').length;
  const pendingComplaints = COMPLAINTS.filter(c => c.status === 'Pending').length;
  const certsIssued = CERTIFICATES.length;
  const seniorCount = RESIDENTS.filter(r => r.senior).length;
  const soloParentCount = RESIDENTS.filter(r => r.soloParent).length;
  const indigentCount = RESIDENTS.filter(r => r.indigent).length;
  const expiredPermits = BUSINESSES.filter(b => b.permitStatus === 'Expired').length;
  const resolvedComplaints = COMPLAINTS.filter(c => c.status === 'Resolved').length;

  // Recent activity feed
  const recentActivity = [
    ...CERTIFICATES.map(c => ({ date: c.issuedDate, type: 'Certificate', detail: `${c.type} issued to ${c.residentName}` })),
    ...RESIDENTS.map(r => ({ date: r.registeredDate, type: 'Registration', detail: `${r.firstName} ${r.lastName} registered as resident` })),
    ...COMPLAINTS.map(c => ({ date: c.dateFiled, type: 'Complaint', detail: `${c.category} complaint by ${c.complainantName}` })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  const quickLinks = [
    { label: 'Register Resident', key: 'residents', emoji: '👤', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
    { label: 'New Business', key: 'businesses', emoji: '🏢', color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
    { label: 'File Complaint', key: 'complaints', emoji: '⚠️', color: 'bg-amber-50 border-amber-200 hover:bg-amber-100' },
    { label: 'Issue Certificate', key: 'certificates', emoji: '📄', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500 text-sm">
            Welcome back · {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-blue-700">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={IconUsers} label="Total Residents" value={totalResidents}
          sub={`${seniorCount} senior · ${soloParentCount} solo parent`}
          bg="bg-blue-100" iconColor="text-blue-700" trend="+2 this month"/>
        <StatCard icon={IconBusiness} label="Active Businesses" value={activeBusinesses}
          sub={`${expiredPermits} permit(s) expired`}
          bg="bg-emerald-100" iconColor="text-emerald-700"/>
        <StatCard icon={IconComplaint} label="Pending Complaints" value={pendingComplaints}
          sub={`${resolvedComplaints} resolved total`}
          bg="bg-amber-100" iconColor="text-amber-700"/>
        <StatCard icon={IconCertificate} label="Certificates Issued" value={certsIssued}
          sub="All time" bg="bg-purple-100" iconColor="text-purple-700" trend="↑ Active"/>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Senior Citizens', value: seniorCount, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Solo Parents', value: soloParentCount, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Indigent', value: indigentCount, color: 'text-red-700', bg: 'bg-red-50' },
          { label: 'Total Businesses', value: BUSINESSES.length, color: 'text-emerald-700', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center border border-white`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map(ql => (
            <button key={ql.key} onClick={() => onNavigate(ql.key)}
              className={`${ql.color} border rounded-2xl p-4 text-left transition-all hover:shadow-md active:scale-95`}>
              <span className="text-2xl block mb-2">{ql.emoji}</span>
              <span className="text-sm font-semibold text-slate-700">{ql.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Activity */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Recent Activity</h3>
            <button onClick={() => onNavigate('reports')} className="text-xs text-blue-700 font-semibold hover:underline">
              View All
            </button>
          </div>
          <QuickActivity items={recentActivity} />
        </div>

        {/* Announcements Preview */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <IconBell size={16} className="text-blue-700" /> Announcements
            </h3>
            <span className="badge badge-blue">{ANNOUNCEMENTS.length} active</span>
          </div>
          <div className="space-y-3">
            {ANNOUNCEMENTS.slice(0, 4).map(a => (
              <div key={a.id} className={`p-3 rounded-xl border ${a.pinned ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-800">{a.title}</span>
                  {a.pinned && <span className="text-xs">📌</span>}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{a.content}</p>
                <p className="text-xs text-slate-400 mt-1">{formatDate(a.date)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barangay Info Footer */}
      <div className="glass-card p-5 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">{BARANGAY_INFO.name}</h3>
            <p className="text-blue-200 text-sm">{BARANGAY_INFO.municipality}, {BARANGAY_INFO.province} · {BARANGAY_INFO.region}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-blue-300 text-xs">Punong Barangay</p>
              <p className="font-semibold">{BARANGAY_INFO.captain}</p>
            </div>
            <div>
              <p className="text-blue-300 text-xs">Secretary</p>
              <p className="font-semibold">{BARANGAY_INFO.secretary}</p>
            </div>
            <div>
              <p className="text-blue-300 text-xs">Hotline</p>
              <p className="font-semibold">{BARANGAY_INFO.hotline}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
