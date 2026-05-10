import { useState } from 'react';
import { CERTIFICATES, RESIDENTS, BARANGAY_INFO, generateId, formatDate } from '../../data/mockData';
import Modal from '../../components/Modal';
import { FormField } from '../../components/Form';
import { IconPlus, IconPrint, IconEye, IconSearch } from '../../assets/svg/Icons';

const CERT_TYPES = [
  'Barangay Clearance',
  'Business Permit',
  'Solo Parent Certificate',
  'Certificate of Indigency',
  'Complaint Certification',
];

const CERT_FEES = {
  'Barangay Clearance': '50.00',
  'Business Permit': '200.00',
  'Solo Parent Certificate': '0.00',
  'Certificate of Indigency': '0.00',
  'Complaint Certification': '50.00',
};

const EMPTY_FORM = {
  type: 'Barangay Clearance', residentId: '', residentName: '',
  purpose: '', orNumber: '', issuedBy: BARANGAY_INFO.secretary,
  issuedDate: new Date().toISOString().split('T')[0],
  expiryDate: '', fee: '50.00',
};

// ─── Certificate Templates ───────────────────────────────────────────────────

function CertTemplate({ cert }) {
  const today = formatDate(cert.issuedDate || new Date().toISOString().split('T')[0]);
  const expiry = cert.expiryDate ? formatDate(cert.expiryDate) : 'Six (6) months from date of issuance';

  const BaseLayout = ({ title, children }) => (
    <div style={{ fontFamily: 'Georgia, serif', padding: '48px', maxWidth: '680px', margin: '0 auto', border: '2px solid #1e3a8a', minHeight: '900px', position: 'relative', background: 'white' }}>
      {/* Letterhead */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '2px', color: '#475569', margin: 0 }}>REPUBLIC OF THE PHILIPPINES</p>
            <p style={{ fontSize: '11px', letterSpacing: '1px', color: '#475569', margin: 0 }}>PROVINCE OF LAGUNA · CITY OF BIÑAN</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>BARANGAY PLATERO</p>
          </div>
        </div>
        <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>Barangay Hall, Platero, Biñan City, Laguna · Tel: {BARANGAY_INFO.hotline}</p>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', letterSpacing: '3px', borderBottom: '1px solid #1e3a8a', paddingBottom: '8px', display: 'inline-block', margin: 0 }}>
          {title.toUpperCase()}
        </h2>
      </div>

      {/* Cert No */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '12px', color: '#64748b' }}>
        <span>Cert. No.: <strong>{cert.id || 'CERT-XXXX-XXX'}</strong></span>
        <span>Date: <strong>{today}</strong></span>
      </div>

      {children}

      {/* Signature */}
      <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '40px' }}>Issued by:</p>
          <div style={{ borderTop: '1px solid #1e3a8a', paddingTop: '4px', minWidth: '180px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>{cert.issuedBy || BARANGAY_INFO.secretary}</p>
            <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>Barangay Secretary</p>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #1e3a8a', paddingTop: '4px', minWidth: '180px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>{BARANGAY_INFO.captain}</p>
            <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>Punong Barangay</p>
          </div>
        </div>
      </div>

      {/* OR */}
      {cert.orNumber && (
        <div style={{ position: 'absolute', bottom: '48px', left: '48px', right: '48px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>O.R. No.: {cert.orNumber} · Fee Paid: ₱{cert.fee || '0.00'} · Valid Until: {expiry}</p>
        </div>
      )}
    </div>
  );

  const body = (text) => (
    <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#334155', textAlign: 'justify', marginBottom: '16px' }}>
      {text}
    </p>
  );

  const greeting = `To Whom It May Concern:`;
  const name = <strong style={{ color: '#1e3a8a', fontSize: '15px' }}>{cert.residentName || '[NAME]'}</strong>;
  const addr = 'Platero, Biñan City, Laguna';

  if (cert.type === 'Barangay Clearance') return (
    <BaseLayout title="Barangay Clearance">
      {body(greeting)}
      {body(<>This is to certify that {name}, of legal age, Filipino citizen, and a bonafide resident of {addr}, is personally known to this office and has been a law-abiding member of this community.</>)}
      {body(<>This certification is issued upon the request of the above-named individual for the purpose of <strong>{cert.purpose || 'Employment Requirement'}</strong> and to whatever legal purpose it may serve.</>)}
    </BaseLayout>
  );

  if (cert.type === 'Certificate of Indigency') return (
    <BaseLayout title="Certificate of Indigency">
      {body(greeting)}
      {body(<>This is to certify that {name}, a resident of {addr}, belongs to an indigent family whose income is below the poverty threshold as determined by this office.</>)}
      {body(<>This certification is issued in connection with the request of the named individual for <strong>{cert.purpose || 'Medical Assistance'}</strong> and to serve as proof of financial incapacity for whatever legal purpose it may serve.</>)}
    </BaseLayout>
  );

  if (cert.type === 'Solo Parent Certificate') return (
    <BaseLayout title="Solo Parent Certificate">
      {body(greeting)}
      {body(<>This is to certify that {name}, of legal age, Filipino citizen, and a resident of {addr}, is a <strong>Solo Parent</strong> as defined under Republic Act No. 8972, also known as the Solo Parents' Welfare Act of 2000.</>)}
      {body(<>This certification is issued upon request for the purpose of <strong>{cert.purpose || 'School Enrollment Privilege'}</strong> and other benefits accorded to solo parents under R.A. 8972.</>)}
    </BaseLayout>
  );

  if (cert.type === 'Business Permit') return (
    <BaseLayout title="Business Permit">
      {body(greeting)}
      {body(<>This is to certify that the business establishment owned and/or operated by {name}, located at {addr}, has been duly registered and is permitted to operate in Barangay Platero.</>)}
      {body(<>This permit is issued for the purpose of <strong>{cert.purpose || 'Business Operation'}</strong> and is subject to all applicable local ordinances and regulations of Barangay Platero.</>)}
    </BaseLayout>
  );

  return (
    <BaseLayout title="Complaint Certification">
      {body(greeting)}
      {body(<>This is to certify that {name}, a resident of {addr}, has filed a formal complaint/blotter entry with this office and the same has been duly recorded in the Barangay Blotter Book.</>)}
      {body(<>This certification is issued upon request for the purpose of <strong>{cert.purpose || 'Official Record'}</strong> and to serve whatever legal purpose it may serve.</>)}
    </BaseLayout>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Certificates() {
  const [certificates, setCertificates] = useState(CERTIFICATES);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = certificates.filter(c =>
    `${c.residentName} ${c.id} ${c.type} ${c.purpose}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add'); };
  const openView = (c) => { setSelected(c); setModal('view'); };
  const openPrint = (c) => { setSelected(c); setModal('print'); };

  const handleSave = () => {
    const nc = {
      ...form,
      id: generateId('CERT', certificates),
      fee: CERT_FEES[form.type] || '0.00',
      status: 'Issued',
    };
    setCertificates([...certificates, nc]);
    setModal(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const certTypeColor = (t) => ({
    'Barangay Clearance': 'badge-blue',
    'Business Permit': 'badge-green',
    'Solo Parent Certificate': 'badge-yellow',
    'Certificate of Indigency': 'badge-red',
    'Complaint Certification': 'badge-gray',
  }[t] || 'badge-gray');

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title">Certificate Generator</h2>
          <p className="section-subtitle">{certificates.length} certificates issued</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <IconPlus size={18}/> Issue Certificate
        </button>
      </div>

      {/* Cert Types Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        {CERT_TYPES.map(t => {
          const count = certificates.filter(c => c.type === t).length;
          return (
            <div key={t} className="glass-card p-4 text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={openAdd}>
              <p className="text-xl mb-1">{{'Barangay Clearance':'📄','Business Permit':'🏢','Solo Parent Certificate':'👨‍👩‍👧','Certificate of Indigency':'🏥','Complaint Certification':'⚖️'}[t]}</p>
              <p className="text-xs font-semibold text-slate-700 leading-tight mb-1">{t}</p>
              <p className="text-blue-800 font-bold text-lg">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-4 mb-5">
        <div className="relative">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input className="input-field pl-9" placeholder="Search certificates..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="table-wrapper bg-white">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Resident</th><th>Certificate Type</th><th>Purpose</th><th>Date Issued</th><th>Fee</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-400">No certificates found.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td><span className="font-mono text-xs text-slate-500">{c.id}</span></td>
                  <td><span className="font-semibold">{c.residentName}</span></td>
                  <td><span className={`badge ${certTypeColor(c.type)}`}>{c.type}</span></td>
                  <td className="max-w-xs truncate">{c.purpose}</td>
                  <td>{formatDate(c.issuedDate)}</td>
                  <td>₱{c.fee}</td>
                  <td><span className="badge badge-green">{c.status}</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openView(c)} className="btn-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg">
                        <IconEye size={14}/>
                      </button>
                      <button onClick={() => openPrint(c)} className="btn-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg">
                        <IconPrint size={14}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Modal */}
      <Modal isOpen={modal==='add'} onClose={()=>setModal(null)} title="Issue Certificate"
        footer={<><button onClick={()=>setModal(null)} className="btn-secondary">Cancel</button><button onClick={handleSave} className="btn-primary">Issue Certificate</button></>}
      >
        <div className="space-y-4">
          <FormField label="Certificate Type" required>
            <select className="input-field" value={form.type} onChange={e=>setForm({...form, type:e.target.value, fee:CERT_FEES[e.target.value]||'0.00'})}>
              {CERT_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Resident Name" required>
            <select className="input-field" value={form.residentId} onChange={e=>{
              const r = RESIDENTS.find(r=>r.id===e.target.value);
              setForm({...form, residentId:e.target.value, residentName: r ? `${r.firstName} ${r.lastName}` : ''});
            }}>
              <option value="">-- Select Resident --</option>
              {RESIDENTS.map(r=><option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>)}
            </select>
          </FormField>
          <FormField label="Purpose" required>
            <input className="input-field" value={form.purpose} onChange={e=>setForm({...form,purpose:e.target.value})} placeholder="e.g., Employment Requirement"/>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date Issued">
              <input type="date" className="input-field" value={form.issuedDate} onChange={e=>setForm({...form,issuedDate:e.target.value})}/>
            </FormField>
            <FormField label="Expiry Date">
              <input type="date" className="input-field" value={form.expiryDate} onChange={e=>setForm({...form,expiryDate:e.target.value})}/>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="O.R. Number">
              <input className="input-field" value={form.orNumber} onChange={e=>setForm({...form,orNumber:e.target.value})}/>
            </FormField>
            <FormField label="Fee (₱)">
              <input className="input-field" value={form.fee} onChange={e=>setForm({...form,fee:e.target.value})}/>
            </FormField>
          </div>
          <FormField label="Issued By">
            <input className="input-field" value={form.issuedBy} onChange={e=>setForm({...form,issuedBy:e.target.value})}/>
          </FormField>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={modal==='view'} onClose={()=>setModal(null)} title="Certificate Details">
        {selected && (
          <div className="space-y-3">
            {[
              ['Certificate ID', selected.id],
              ['Type', selected.type],
              ['Resident', selected.residentName],
              ['Purpose', selected.purpose],
              ['Date Issued', formatDate(selected.issuedDate)],
              ['Expiry', selected.expiryDate ? formatDate(selected.expiryDate) : '6 months from issuance'],
              ['O.R. Number', selected.orNumber],
              ['Fee', `₱${selected.fee}`],
              ['Issued By', selected.issuedBy],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-slate-500">{k}</span>
                <span className="font-medium text-slate-800">{v}</span>
              </div>
            ))}
            <button onClick={() => openPrint(selected)} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              <IconPrint size={16}/> Print Certificate
            </button>
          </div>
        )}
      </Modal>

      {/* Print Modal */}
      <Modal isOpen={modal==='print'} onClose={()=>setModal(null)} title={`Print: ${selected?.type}`}>
        {selected && (
          <div>
            <div className="mb-4 flex justify-end">
              <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
                <IconPrint size={16}/> Print
              </button>
            </div>
            {/* Preview */}
            <div className="border border-gray-200 rounded-xl overflow-hidden" style={{ transform: 'scale(0.7)', transformOrigin: 'top center', height: '660px' }}>
              <CertTemplate cert={selected}/>
            </div>
            {/* Actual print area */}
            <div className="print-area">
              <CertTemplate cert={selected}/>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
