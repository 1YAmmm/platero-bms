import { useEffect, useMemo, useState } from 'react';
import { formatDate } from '../../data/mockData';
import { IconDownload } from '../../assets/svg/Icons';

import { listenCertificates } from '../../service/certificate.service';
import { listenResidents } from '../../service/resident.service';
import { listenBusinesses } from '../../service/business.service';
import { listenComplaints } from '../../service/complaints.service';
import { exportToExcel } from '../../ultils/exportToExcel';

const FILTER_TYPES = ['Year', 'Month', 'Week', 'Day'];
const ALL_YEARS = 'All';
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// "YYYY-MM-DD" <-> local Date helpers (avoid timezone shifts)
const toInputDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const parseInputDate = (value) => {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// Week = Sunday to Saturday
const getWeekRange = (baseDate) => {
  const firstDay = new Date(baseDate);
  firstDay.setHours(0, 0, 0, 0);
  firstDay.setDate(baseDate.getDate() - baseDate.getDay());

  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 6);
  lastDay.setHours(23, 59, 59, 999);

  return { firstDay, lastDay };
};

// All weeks (Sun–Sat) that touch the given year
const getWeeksOfYear = (y) => {
  const weeks = [];
  const cur = new Date(y, 0, 1);
  cur.setDate(1 - cur.getDay());

  const yearEnd = new Date(y, 11, 31);

  while (cur <= yearEnd) {
    const start = new Date(cur);
    const end = new Date(cur);
    end.setDate(cur.getDate() + 6);

    weeks.push({ key: toInputDate(start), start, end });

    cur.setDate(cur.getDate() + 7);
  }

  return weeks;
};

const formatShort = (d) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// e.g. "Nov 8 – Nov 14, 2026" or "Dec 28, 2025 – Jan 3, 2026"
const formatRange = (start, end) => {
  if (start.getFullYear() === end.getFullYear()) {
    return `${formatShort(start)} – ${formatShort(end)}, ${end.getFullYear()}`;
  }
  return `${formatShort(start)}, ${start.getFullYear()} – ${formatShort(end)}, ${end.getFullYear()}`;
};

// amount (string or number) -> number, safe for "1,200.00", "", undefined
const toNumber = (value) => {
  const n = parseFloat(String(value ?? '').replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
};

// number -> "1,250.00"
const formatMoney = (value) =>
  Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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

// escape text before placing it into the print window's HTML
const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export default function Reports() {
  const today = new Date();

  const [filterBy, setFilterBy] = useState('Month');
  const [year, setYear] = useState(String(today.getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  // anchor date: used by "Day" (exact day) and "Week" (week containing it)
  const [selectedDate, setSelectedDate] = useState(toInputDate(today));

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
  // AVAILABLE YEARS
  // =========================
  const availableYears = useMemo(() => {
    const years = new Set([String(new Date().getFullYear())]);

    if (year !== ALL_YEARS) years.add(year);

    const addYear = (value) => {
      if (!value) return;
      const d = new Date(value);
      if (!isNaN(d.getTime())) years.add(String(d.getFullYear()));
    };

    residents.forEach((r) => addYear(r.registeredDate));
    businesses.forEach((b) =>
      addYear(b.createdAt || b.registeredDate || b.date)
    );
    complaints.forEach((c) => addYear(c.dateFiled));
    certificates.forEach((c) => addYear(c.issuedDate));

    return [...years].sort((a, b) => Number(b) - Number(a));
  }, [residents, businesses, complaints, certificates, year]);

  // =========================
  // WEEK OPTIONS (range of a week)
  // =========================
  const weekYear = year === ALL_YEARS ? new Date().getFullYear() : Number(year);

  const weekOptions = useMemo(() => getWeeksOfYear(weekYear), [weekYear]);

  const selectedWeekKey = toInputDate(
    getWeekRange(parseInputDate(selectedDate)).firstDay
  );

  // =========================
  // FILTER CONTROL HANDLERS
  // =========================
  // Changing the year also moves the selected day/week into that year
  const handleYearChange = (value) => {
    setYear(value);

    if (value !== ALL_YEARS) {
      const current = parseInputDate(selectedDate);
      const lastDayOfMonth = new Date(
        Number(value),
        current.getMonth() + 1,
        0
      ).getDate();

      setSelectedDate(
        toInputDate(
          new Date(
            Number(value),
            current.getMonth(),
            Math.min(current.getDate(), lastDayOfMonth)
          )
        )
      );
    }
  };

  // Picking a specific day also syncs the year
  const handleDateChange = (value) => {
    if (!value) return;
    setSelectedDate(value);
    setYear(String(parseInputDate(value).getFullYear()));
  };

  // Picking a week range (value = the Sunday that starts the week)
  const handleWeekChange = (value) => {
    if (!value) return;
    setSelectedDate(value);
  };

  const handleFilterByChange = (value) => {
    setFilterBy(value);

    // "Week" and "Day" need a specific year
    if ((value === 'Week' || value === 'Day') && year === ALL_YEARS) {
      handleYearChange(String(new Date().getFullYear()));
    }
  };

  // =========================
  // FILTER FUNCTION
  // =========================
  const isWithinPeriod = (dateValue) => {
    if (!dateValue) return false;

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return false;

    const picked = parseInputDate(selectedDate);

    // YEAR
    if (filterBy === 'Year') {
      return year === ALL_YEARS || date.getFullYear() === Number(year);
    }

    // MONTH (specific month of the selected year)
    if (filterBy === 'Month') {
      return (
        date.getMonth() === selectedMonth &&
        (year === ALL_YEARS || date.getFullYear() === Number(year))
      );
    }

    // WEEK (range of the selected week, Sun–Sat)
    if (filterBy === 'Week') {
      const { firstDay, lastDay } = getWeekRange(picked);

      return date >= firstDay && date <= lastDay;
    }

    // DAY (specific day)
    if (filterBy === 'Day') {
      return date.toDateString() === picked.toDateString();
    }

    return true;
  };

  // =========================
  // FILTER LABEL (used for display, print, export)
  // =========================
  const filterLabel = useMemo(() => {
    const picked = parseInputDate(selectedDate);

    if (filterBy === 'Year') {
      return year === ALL_YEARS ? 'All Years' : year;
    }

    if (filterBy === 'Month') {
      return year === ALL_YEARS
        ? `${MONTHS[selectedMonth]} (All Years)`
        : `${MONTHS[selectedMonth]} ${year}`;
    }

    if (filterBy === 'Week') {
      const { firstDay, lastDay } = getWeekRange(picked);
      return formatRange(firstDay, lastDay);
    }

    return picked.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, [filterBy, selectedDate, selectedMonth, year]);

  // =========================
  // FILTERED DATA
  // =========================
  const filteredResidents = useMemo(() => {
    return residents.filter((r) => isWithinPeriod(r.registeredDate));
  }, [residents, filterBy, year, selectedMonth, selectedDate]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) =>
      isWithinPeriod(b.createdAt || b.registeredDate || b.date)
    );
  }, [businesses, filterBy, year, selectedMonth, selectedDate]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => isWithinPeriod(c.dateFiled));
  }, [complaints, filterBy, year, selectedMonth, selectedDate]);

  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => isWithinPeriod(c.issuedDate));
  }, [certificates, filterBy, year, selectedMonth, selectedDate]);

  // =========================
  // COUNTS
  // =========================
  const totalResidents = filteredResidents.length;

  const activeBusinesses = filteredBusinesses.filter(
    (b) => b.permitStatus === 'Active'
  ).length;

  const pendingComplaints = filteredComplaints.filter(
    (c) => c.status === 'Pending'
  ).length;

  const certsIssued = filteredCertificates.length;

  const seniorCount = filteredResidents.filter((r) => r.senior).length;

  const soloParentCount = filteredResidents.filter((r) => r.soloParent).length;

  const indigentCount = filteredResidents.filter((r) => r.indigent).length;

  const expiredPermits = filteredBusinesses.filter(
    (b) => b.permitStatus === 'Expired'
  ).length;

  const resolvedComplaints = filteredComplaints.filter(
    (c) => c.status === 'Resolved'
  ).length;

  // =========================
  // CERTIFICATE BREAKDOWN
  // =========================
  const certBreakdown = [
    'Barangay Clearance',
    'Business Permit',
    'Solo Parent Certificate',
    'Certificate of Indigency',
    'Complaint Certification',
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
      type: 'Certificate',
      detail: `${c.type} – ${c.residentName || ''}`,
      amount: c.fee || '0.00',
      module: 'Certificates',
    })),

    ...filteredResidents.map((r) => ({
      date: r.registeredDate,
      type: 'Registration',
      detail: `Resident: ${r.firstName || ''} ${r.lastName || ''}`,
      amount: '0.00',
      module: 'Residents',
    })),

    ...filteredComplaints.map((c) => ({
      date: c.dateFiled,
      type: 'Complaint',
      detail: `${c.category || ''} by ${c.complainantName || ''}`,
      amount: '0.00',
      module: 'Complaints',
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // =========================
  // TRANSACTION TOTALS
  // =========================
  const totalTransactions = transactions.length;

  const totalAmount = transactions.reduce(
    (sum, t) => sum + toNumber(t.amount),
    0
  );

  const moduleColor = {
    Certificate: 'badge-green',
    Registration: 'badge-blue',
    Complaint: 'badge-red',
  };
  const handleExport = () => {
    const data = transactions.map((t) => ({
      Date: formatDate(t.date),
      Type: t.type,
      Details: t.detail,
      Module: t.module,
      Amount: t.amount,
    }));

    // total row at the bottom of the exported sheet
    if (data.length > 0) {
      data.push({
        Date: '',
        Type: '',
        Details: `Total (${totalTransactions} transaction${
          totalTransactions === 1 ? '' : 's'
        })`,
        Module: '',
        Amount: formatMoney(totalAmount),
      });
    }

    exportToExcel({
      data,
      fileName: `reports-${filterBy.toLowerCase()}-${filterLabel
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}`,
      sheetName: 'Reports',
    });
  };

  // =========================
  // PRINT (current filtered data)
  // =========================
  const handlePrint = () => {
    const summaryRows = [
      ['Total Residents', totalResidents],
      ['Senior Citizens', seniorCount],
      ['Solo Parents', soloParentCount],
      ['Indigent', indigentCount],
      ['Active Businesses', activeBusinesses],
      ['Expired Permits', expiredPermits],
      ['Pending Complaints', pendingComplaints],
      ['Resolved Complaints', resolvedComplaints],
      ['Certificates Issued', certsIssued],
    ]
      .map(
        ([label, value]) =>
          `<tr><td>${escapeHtml(label)}</td><td class="num">${escapeHtml(value)}</td></tr>`
      )
      .join('');

    const certRows = certBreakdown
      .map(
        ({ type, count }) =>
          `<tr><td>${escapeHtml(type)}</td><td class="num">${count}</td></tr>`
      )
      .join('');

    const complaintRows = complaintBreakdown.length
      ? complaintBreakdown
          .map(
            ({ cat, count }) =>
              `<tr><td>${escapeHtml(cat)}</td><td class="num">${count}</td></tr>`
          )
          .join('')
      : `<tr><td colspan="2">No complaints</td></tr>`;

    const transactionRows = transactions.length
      ? transactions
          .map(
            (t) => `<tr>
              <td>${escapeHtml(formatDate(t.date))}</td>
              <td>${escapeHtml(t.type)}</td>
              <td>${escapeHtml(t.detail)}</td>
              <td>${escapeHtml(t.module)}</td>
              <td class="num">&#8369;${escapeHtml(t.amount)}</td>
            </tr>`
          )
          .join('')
      : `<tr><td colspan="5">No transactions for this filter</td></tr>`;

    const transactionTotalRow = transactions.length
      ? `<tfoot>
          <tr class="total">
            <td colspan="4">Total (${totalTransactions} transaction${
              totalTransactions === 1 ? '' : 's'
            })</td>
            <td class="num">&#8369;${escapeHtml(formatMoney(totalAmount))}</td>
          </tr>
        </tfoot>`
      : '';

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Records & Reports - ${escapeHtml(filterBy)} (${escapeHtml(filterLabel)})</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: Arial, Helvetica, sans-serif; color: #1e293b; margin: 24px; font-size: 12px; }
      h1 { font-size: 20px; margin: 0 0 4px; }
      h2 { font-size: 14px; margin: 20px 0 8px; }
      .meta { color: #64748b; margin-bottom: 16px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
      th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; vertical-align: top; }
      th { background: #f1f5f9; }
      td.num, th.num { text-align: right; white-space: nowrap; }
      tr.total td { font-weight: bold; background: #f1f5f9; }
      .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
      tr { page-break-inside: avoid; }
      thead { display: table-header-group; }
      tfoot { display: table-row-group; }
      @media print { body { margin: 0; } }
    </style>
  </head>
  <body>
    <h1>Records &amp; Reports</h1>
    <div class="meta">
      Filter by: <strong>${escapeHtml(filterBy)}</strong> &nbsp;|&nbsp;
      Range: <strong>${escapeHtml(filterLabel)}</strong> &nbsp;|&nbsp;
      Printed: ${escapeHtml(new Date().toLocaleString())}
    </div>

    <div class="grid">
      <div>
        <h2>Summary</h2>
        <table><tbody>${summaryRows}</tbody></table>
      </div>
      <div>
        <h2>Certificates by Type</h2>
        <table><tbody>${certRows}</tbody></table>
      </div>
      <div>
        <h2>Complaints by Category</h2>
        <table><tbody>${complaintRows}</tbody></table>
      </div>
    </div>

    <h2>Transaction Log</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Details</th>
          <th>Module</th>
          <th class="num">Amount</th>
        </tr>
      </thead>
      <tbody>${transactionRows}</tbody>
      ${transactionTotalRow}
    </table>
  </body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert('Please allow pop-ups to print the report.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    // wait for the content to render before opening the print dialog
    printWindow.onload = () => {
      printWindow.print();
    };
    setTimeout(() => {
      if (!printWindow.closed) printWindow.print();
    }, 500);
  };

  const controlClass =
    'px-4 py-2 rounded-xl text-sm font-medium bg-white text-slate-600 border border-gray-200 hover:bg-gray-50';

  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title">Records & Reports</h2>

          <p className="section-subtitle">Overview and transaction history</p>

          <p className="text-xs text-slate-400 mt-1">Showing: {filterLabel}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* FILTER TYPE */}
          <select
            value={filterBy}
            onChange={(e) => handleFilterByChange(e.target.value)}
            className={controlClass}
          >
            {FILTER_TYPES.map((t) => (
              <option key={t} value={t}>
                Filter by {t}
              </option>
            ))}
          </select>

          {/* YEAR (Year, Month, Week) */}
          {(filterBy === 'Year' ||
            filterBy === 'Month' ||
            filterBy === 'Week') && (
            <select
              value={year}
              onChange={(e) => handleYearChange(e.target.value)}
              className={controlClass}
            >
              {(filterBy === 'Year' || filterBy === 'Month') && (
                <option value={ALL_YEARS}>All Years</option>
              )}
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}

          {/* MONTH */}
          {filterBy === 'Month' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className={controlClass}
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
          )}

          {/* WEEK (range of a week) */}
          {filterBy === 'Week' && (
            <select
              value={selectedWeekKey}
              onChange={(e) => handleWeekChange(e.target.value)}
              className={controlClass}
            >
              {weekOptions.map((w, i) => (
                <option key={w.key} value={w.key}>
                  {`Week ${i + 1}: ${formatRange(w.start, w.end)}`}
                </option>
              ))}
            </select>
          )}

          {/* DAY */}
          {filterBy === 'Day' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className={controlClass}
            />
          )}
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
          sub={`Total for ${filterLabel}`}
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
                label: 'Regular Residents',
                count:
                  totalResidents -
                  seniorCount -
                  soloParentCount -
                  indigentCount,
                color: 'bg-blue-500',
              },
              {
                label: 'Senior Citizens',
                count: seniorCount,
                color: 'bg-emerald-500',
              },
              {
                label: 'Solo Parents',
                count: soloParentCount,
                color: 'bg-amber-500',
              },
              {
                label: 'Indigent',
                count: indigentCount,
                color: 'bg-red-500',
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
                  (b) => b.businessType === type
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
              }
            )}
          </div>
        </div>
      </div>

      {/* TRANSACTION LOG */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Transaction Log</h3>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-secondary btn-sm flex items-center gap-2 text-xs"
            >
              <span aria-hidden="true">🖨️</span>
              Print
            </button>

            <button
              onClick={handleExport}
              className="btn-secondary btn-sm flex items-center gap-2 text-xs"
            >
              <IconDownload size={14} />
              Export
            </button>
          </div>
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
                      className={`badge ${moduleColor[t.type] || 'badge-gray'}`}
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

            {/* TOTAL */}
            {transactions.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 font-bold text-slate-800">
                  <td colSpan={4}>
                    Total ({totalTransactions} transaction
                    {totalTransactions === 1 ? '' : 's'})
                  </td>

                  <td>₱{formatMoney(totalAmount)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
