import { useState } from 'react';
import { RESIDENTS, BUSINESSES, COMPLAINTS, CERTIFICATES, formatDate } from '../../data/mockData';
import { IconFilter, IconDownload } from '../../assets/svg/Icons';

const PERIODS = ['Daily', 'Weekly', 'Monthly'];

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
  const [period, setPeriod] = useState('Monthly');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const totalResidents = RESIDENTS.length;
  const activeBusinesses = BUSINESSES.filter(b => b.permitStatus === 'Active').length;
  const pendingComplaints = COMPLAINTS.filter(c => c.status === 'Pending').length;
  const certsIssued = CERTIFICATES.length;
  const seniorCount = RESIDENTS.filter(r => r.senior).length;
  const soloParentCount = RESIDENTS.filter(r => r.soloParent).length;
  const indigentCount = RESIDENTS.filter(r => r.indigent).length;
  const expiredPermits = BUSINESSES.filter(b => b.permitStatus === 'Expired').length;
  const resolvedComplaints = COMPLAINTS.filter(c => c.status === 'Resolved').length;

  const certBreakdown = [
    'Barangay Clearance', 'Business Permit', 'Solo Parent Certificate', 'Certificate of Indigency', 'Complaint Certification'
  ].map(type => ({
    type, count: CERTIFICATES.filter(c => c.type === type).length
  }));

  const complaintBreakdown = [...new Set(COMPLAINTS.map(c => c.category))].map(cat => ({
    cat, count: COMPLAINTS.filter(c => c.category === cat).length
  }));

  // Simple transaction log (mock)
  const transactions = [
    ...CERTIFICATES.map(c => ({ date: c.issuedDate, type: 'Certificate', detail: `${c.type} – ${c.residentName}`, amount: c.fee, module: 'Certificates' })),
    ...RESIDENTS.map(r => ({ date: r.registeredDate, type: 'Registration', detail: `Resident: ${r.firstName} ${r.lastName}`, amount: '0.00', module: 'Residents' })),
    ...COMPLAINTS.map(c => ({ date: c.dateFiled, type: 'Complaint', detail: `${c.category} by ${c.complainantName}`, amount: '0.00', module: 'Complaints' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const moduleColor = { Certificates: 'badge-green', Registration: 'badge-blue', Complaint: 'badge-red' };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title">Records & Reports</h2>
          <p className="section-subtitle">Overview and transaction history</p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${period === p ? 'bg-blue-800 text-white shadow' : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="👥" label="Total Residents" value={totalResidents} sub={`${seniorCount} senior, ${soloParentCount} solo parent`} color="border-blue-600"/>
        <StatCard icon="🏢" label="Active Businesses" value={activeBusinesses} sub={`${expiredPermits} expired permit(s)`} color="border-emerald-500"/>
        <StatCard icon="⚠️" label="Pending Complaints" value={pendingComplaints} sub={`${resolvedComplaints} resolved`} color="border-amber-500"/>
        <StatCard icon="📄" label="Certificates Issued" value={certsIssued} sub="Total this year" color="border-purple-500"/>
      </div>

      {/* Breakdowns */}
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        {/* Certificate Breakdown */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-slate-800 mb-4">Certificates by Type</h3>
          <div className="space-y-3">
            {certBreakdown.map(({ type, count }) => (
              <div key={type} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 flex-1 truncate">{type}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-800 h-2 rounded-full transition-all" style={{ width: `${certsIssued ? (count / certsIssued) * 100 : 0}%` }}/>
                </div>
                <span className="font-bold text-slate-800 text-sm w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resident Classification */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-slate-800 mb-4">Resident Classification</h3>
          <div className="space-y-3">
            {[
              { label: 'Regular Residents', count: totalResidents - seniorCount - soloParentCount - indigentCount, color: 'bg-blue-500' },
              { label: 'Senior Citizens', count: seniorCount, color: 'bg-emerald-500' },
              { label: 'Solo Parents', count: soloParentCount, color: 'bg-amber-500' },
              { label: 'Indigent', count: indigentCount, color: 'bg-red-500' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 flex-1">{label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${totalResidents ? (count / totalResidents) * 100 : 0}%` }}/>
                </div>
                <span className="font-bold text-slate-800 text-sm w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Complaint Categories */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-slate-800 mb-4">Complaints by Category</h3>
          <div className="space-y-3">
            {complaintBreakdown.map(({ cat, count }) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 flex-1">{cat}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(count / COMPLAINTS.length) * 100}%` }}/>
                </div>
                <span className="font-bold text-slate-800 text-sm w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Business by Type */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-slate-800 mb-4">Business by Type</h3>
          <div className="space-y-3">
            {[...new Set(BUSINESSES.map(b => b.businessType))].map(type => {
              const count = BUSINESSES.filter(b => b.businessType === type).length;
              return (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 flex-1">{type}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(count / BUSINESSES.length) * 100}%` }}/>
                  </div>
                  <span className="font-bold text-slate-800 text-sm w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transaction Log */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Transaction Log</h3>
          <button className="btn-secondary btn-sm flex items-center gap-2 text-xs">
            <IconDownload size={14}/> Export
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
                  <td className="text-slate-500 text-xs">{formatDate(t.date)}</td>
                  <td><span className={`badge ${moduleColor[t.type] || 'badge-gray'}`}>{t.type}</span></td>
                  <td className="max-w-xs truncate">{t.detail}</td>
                  <td><span className="text-xs text-slate-500">{t.module}</span></td>
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
