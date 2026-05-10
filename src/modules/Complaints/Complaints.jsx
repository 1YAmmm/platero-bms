import { useState } from 'react';
import { COMPLAINTS, generateId, formatDate } from '../../data/mockData';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { FormField } from '../../components/Form';
import { IconPlus, IconEdit, IconSearch, IconEye } from '../../assets/svg/Icons';

const CATEGORIES = ['Noise Disturbance', 'Waste Management', 'Property Damage', 'Domestic Dispute', 'Theft', 'Illegal Construction', 'Water/Flooding', 'Other'];
const STATUSES = ['Pending', 'Under Investigation', 'Resolved', 'Dismissed'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const EMPTY_FORM = {
  complainantName: '', complainantAddress: '', complainantContact: '',
  respondentName: '', category: 'Noise Disturbance', description: '',
  status: 'Pending', priority: 'Medium', assignedTo: '', notes: '',
  dateFiled: new Date().toISOString().split('T')[0], dateResolved: '',
};

export default function Complaints() {
  const [complaints, setComplaints] = useState(COMPLAINTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = complaints.filter(c => {
    const match = `${c.complainantName} ${c.id} ${c.category} ${c.respondentName}`.toLowerCase().includes(search.toLowerCase());
    const sf = statusFilter === 'All' || c.status === statusFilter;
    return match && sf;
  });

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add'); };
  const openEdit = (c) => { setForm({...c}); setSelected(c); setModal('edit'); };
  const openView = (c) => { setSelected(c); setModal('view'); };

  const handleSave = () => {
    if (modal === 'add') {
      const nc = { ...form, id: generateId('CMP', complaints) };
      setComplaints([...complaints, nc]);
    } else {
      setComplaints(complaints.map(c => c.id === selected.id ? { ...form, id: selected.id } : c));
    }
    setModal(null);
  };

  const statusColor = (s) => ({ 'Pending': 'badge-yellow', 'Under Investigation': 'badge-blue', 'Resolved': 'badge-green', 'Dismissed': 'badge-gray' }[s] || 'badge-gray');
  const priorityColor = (p) => ({ 'Low': 'badge-gray', 'Medium': 'badge-blue', 'High': 'badge-yellow', 'Urgent': 'badge-red' }[p] || 'badge-gray');

  const columns = [
    { key: 'id', label: 'ID', render: v => <span className="font-mono text-xs text-slate-500">{v}</span> },
    { key: 'complainantName', label: 'Complainant', render: (v, r) => (
      <div><p className="font-semibold text-slate-800">{v}</p><p className="text-xs text-slate-400">{r.category}</p></div>
    )},
    { key: 'respondentName', label: 'Respondent' },
    { key: 'priority', label: 'Priority', render: v => <span className={`badge ${priorityColor(v)}`}>{v}</span> },
    { key: 'status', label: 'Status', render: v => <span className={`badge ${statusColor(v)}`}>{v}</span> },
    { key: 'dateFiled', label: 'Filed', render: v => formatDate(v) },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'id', label: 'Actions', render: (_, r) => (
      <div className="flex gap-1">
        <button onClick={() => openView(r)} className="btn-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg">
          <IconEye size={14}/>
        </button>
        <button onClick={() => openEdit(r)} className="btn-sm bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg">
          <IconEdit size={14}/>
        </button>
      </div>
    )},
  ];

  const ComplaintForm = () => (
    <div className="grid grid-cols-2 gap-4">
      <FormField label="Complainant Name" required>
        <input className="input-field" value={form.complainantName} onChange={e=>setForm({...form,complainantName:e.target.value})}/>
      </FormField>
      <FormField label="Contact Number">
        <input className="input-field" value={form.complainantContact} onChange={e=>setForm({...form,complainantContact:e.target.value})}/>
      </FormField>
      <div className="col-span-2">
        <FormField label="Complainant Address">
          <input className="input-field" value={form.complainantAddress} onChange={e=>setForm({...form,complainantAddress:e.target.value})}/>
        </FormField>
      </div>
      <FormField label="Respondent/Subject">
        <input className="input-field" value={form.respondentName} onChange={e=>setForm({...form,respondentName:e.target.value})}/>
      </FormField>
      <FormField label="Category">
        <select className="input-field" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
      </FormField>
      <FormField label="Priority">
        <select className="input-field" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
          {PRIORITIES.map(p=><option key={p}>{p}</option>)}
        </select>
      </FormField>
      <FormField label="Assigned To">
        <input className="input-field" placeholder="Kagawad name" value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:e.target.value})}/>
      </FormField>
      <FormField label="Status">
        <select className="input-field" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
          {STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
      </FormField>
      <FormField label="Date Filed">
        <input type="date" className="input-field" value={form.dateFiled} onChange={e=>setForm({...form,dateFiled:e.target.value})}/>
      </FormField>
      <div className="col-span-2">
        <FormField label="Description" required>
          <textarea className="input-field resize-none" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        </FormField>
      </div>
      <div className="col-span-2">
        <FormField label="Notes / Resolution">
          <textarea className="input-field resize-none" rows={2} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
        </FormField>
      </div>
    </div>
  );

  const counts = {
    Pending: complaints.filter(c=>c.status==='Pending').length,
    'Under Investigation': complaints.filter(c=>c.status==='Under Investigation').length,
    Resolved: complaints.filter(c=>c.status==='Resolved').length,
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title">Complaint Records</h2>
          <p className="section-subtitle">{complaints.length} total complaints</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <IconPlus size={18}/> File Complaint
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[['Pending','⏳','badge-yellow'],['Under Investigation','🔍','badge-blue'],['Resolved','✅','badge-green']].map(([s,e,c])=>(
          <div key={s} className="glass-card p-4 text-center">
            <p className="text-2xl mb-1">{e}</p>
            <p className="text-2xl font-bold text-slate-800">{counts[s] || 0}</p>
            <p className="text-xs text-slate-500 mt-1">{s}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input className="input-field pl-9" placeholder="Search complaints..."
            value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All',...STATUSES].map(s=>(
            <button key={s} onClick={()=>setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${statusFilter===s?'bg-blue-800 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <Table columns={columns} data={filtered} emptyMessage="No complaints found."/>
      </div>

      <Modal isOpen={modal==='add'||modal==='edit'} onClose={()=>setModal(null)}
        title={modal==='add'?'File New Complaint':'Update Complaint'}
        footer={<><button onClick={()=>setModal(null)} className="btn-secondary">Cancel</button><button onClick={handleSave} className="btn-primary">{modal==='add'?'Submit':'Save'}</button></>}
      >
        <ComplaintForm/>
      </Modal>

      <Modal isOpen={modal==='view'} onClose={()=>setModal(null)} title="Complaint Details">
        {selected && (
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap pb-3 border-b">
              <span className={`badge ${statusColor(selected.status)}`}>{selected.status}</span>
              <span className={`badge ${priorityColor(selected.priority)}`}>{selected.priority} Priority</span>
              <span className="badge badge-gray">{selected.category}</span>
            </div>
            {[
              ['Complaint ID', selected.id],
              ['Complainant', selected.complainantName],
              ['Complainant Address', selected.complainantAddress],
              ['Contact', selected.complainantContact],
              ['Respondent', selected.respondentName],
              ['Date Filed', formatDate(selected.dateFiled)],
              ['Assigned To', selected.assignedTo],
              ['Date Resolved', selected.dateResolved ? formatDate(selected.dateResolved) : 'Pending'],
            ].map(([k,v])=>(
              <div key={k} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-slate-500">{k}</span>
                <span className="font-medium text-slate-800 text-right max-w-xs">{v}</span>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Description</p>
              <p className="text-sm text-slate-700 bg-gray-50 rounded-xl p-3">{selected.description}</p>
            </div>
            {selected.notes && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Notes / Resolution</p>
                <p className="text-sm text-slate-700 bg-emerald-50 rounded-xl p-3">{selected.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
