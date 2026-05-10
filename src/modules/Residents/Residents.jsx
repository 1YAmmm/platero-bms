import { useState } from 'react';
import { RESIDENTS, generateId, formatDate } from '../../data/mockData';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { FormField, Input, Select } from '../../components/Form';
import { IconPlus, IconEdit, IconDelete, IconSearch, IconUser } from '../../assets/svg/Icons';

const EMPTY_FORM = {
  firstName: '', lastName: '', middleName: '', birthdate: '', gender: 'Male',
  civilStatus: 'Single', address: '', purok: 'Purok 1', contactNumber: '',
  email: '', occupation: '', voterStatus: 'Registered Voter',
  soloParent: false, indigent: false, senior: false, pwd: false,
};

export default function Residents() {
  const [residents, setResidents] = useState(RESIDENTS);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'view'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = residents.filter(r =>
    `${r.firstName} ${r.lastName} ${r.id} ${r.address}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add'); };
  const openEdit = (r) => { setForm({ ...r }); setSelected(r); setModal('edit'); };
  const openView = (r) => { setSelected(r); setModal('view'); };

  const handleSave = () => {
    if (modal === 'add') {
      const newRes = {
        ...form,
        id: generateId('RES', residents),
        registeredDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        age: form.birthdate ? Math.floor((Date.now() - new Date(form.birthdate)) / 31557600000) : 0,
      };
      setResidents([...residents, newRes]);
      RESIDENTS.push(newRes);
    } else {
      const updated = residents.map(r => r.id === selected.id ? { ...form, id: selected.id } : r);
      setResidents(updated);
    }
    setModal(null);
  };

  const handleDelete = () => {
    const updated = residents.filter(r => r.id !== deleteTarget.id);
    setResidents(updated);
    setDeleteTarget(null);
  };

  const F = (field) => (
    <input className="input-field" value={form[field] || ''}
      onChange={e => setForm({ ...form, [field]: e.target.value })} />
  );

  const columns = [
    { key: 'id', label: 'ID', render: v => <span className="badge badge-blue font-mono text-xs">{v}</span> },
    { key: 'lastName', label: 'Name', render: (v, r) => (
      <div>
        <p className="font-semibold text-slate-800">{r.firstName} {r.lastName}</p>
        <p className="text-xs text-slate-400">{r.purok}</p>
      </div>
    )},
    { key: 'gender', label: 'Gender' },
    { key: 'age', label: 'Age' },
    { key: 'civilStatus', label: 'Civil Status' },
    { key: 'contactNumber', label: 'Contact' },
    { key: 'status', label: 'Status', render: v => (
      <span className={`badge ${v === 'Active' ? 'badge-green' : 'badge-gray'}`}>{v}</span>
    )},
    { key: 'id', label: 'Actions', render: (_, r) => (
      <div className="flex gap-1">
        <button onClick={() => openView(r)} className="btn-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors">
          <IconUser size={14}/>
        </button>
        <button onClick={() => openEdit(r)} className="btn-sm bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-colors">
          <IconEdit size={14}/>
        </button>
        <button onClick={() => setDeleteTarget(r)} className="btn-sm bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors">
          <IconDelete size={14}/>
        </button>
      </div>
    )},
  ];

  const ResidentForm = () => (
    <div className="grid grid-cols-2 gap-4">
      <FormField label="First Name" required><input className="input-field" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})}/></FormField>
      <FormField label="Last Name" required><input className="input-field" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})}/></FormField>
      <FormField label="Middle Name"><input className="input-field" value={form.middleName} onChange={e=>setForm({...form,middleName:e.target.value})}/></FormField>
      <FormField label="Birthdate"><input type="date" className="input-field" value={form.birthdate} onChange={e=>setForm({...form,birthdate:e.target.value})}/></FormField>
      <FormField label="Gender">
        <select className="input-field" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
          <option>Male</option><option>Female</option>
        </select>
      </FormField>
      <FormField label="Civil Status">
        <select className="input-field" value={form.civilStatus} onChange={e=>setForm({...form,civilStatus:e.target.value})}>
          <option>Single</option><option>Married</option><option>Widower</option><option>Separated</option>
        </select>
      </FormField>
      <FormField label="Purok">
        <select className="input-field" value={form.purok} onChange={e=>setForm({...form,purok:e.target.value})}>
          {['Purok 1','Purok 2','Purok 3','Purok 4','Purok 5'].map(p=><option key={p}>{p}</option>)}
        </select>
      </FormField>
      <FormField label="Occupation"><input className="input-field" value={form.occupation} onChange={e=>setForm({...form,occupation:e.target.value})}/></FormField>
      <div className="col-span-2">
        <FormField label="Address" required><input className="input-field" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></FormField>
      </div>
      <FormField label="Contact Number"><input className="input-field" value={form.contactNumber} onChange={e=>setForm({...form,contactNumber:e.target.value})}/></FormField>
      <FormField label="Email"><input type="email" className="input-field" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></FormField>
      <div className="col-span-2">
        <label className="label mb-2">Special Classification</label>
        <div className="flex flex-wrap gap-4">
          {[['soloParent','Solo Parent'],['indigent','Indigent'],['senior','Senior Citizen'],['pwd','PWD']].map(([k,l])=>(
            <label key={k} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form[k]} onChange={e=>setForm({...form,[k]:e.target.checked})} className="w-4 h-4 accent-blue-700"/>
              <span className="text-sm text-slate-600">{l}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title">Resident Management</h2>
          <p className="section-subtitle">{residents.length} registered residents</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <IconPlus size={18}/> Add Resident
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4 mb-5 flex gap-3">
        <div className="relative flex-1">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input className="input-field pl-9" placeholder="Search by name, ID, or address..."
            value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <Table columns={columns} data={filtered} emptyMessage="No residents found."/>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modal === 'add' || modal === 'edit'}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Register New Resident' : 'Edit Resident'}
        footer={
          <>
            <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary">{modal === 'add' ? 'Register' : 'Save Changes'}</button>
          </>
        }
      >
        <ResidentForm/>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Resident Details">
        {selected && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-800">
                {selected.firstName[0]}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{selected.firstName} {selected.middleName} {selected.lastName}</p>
                <p className="text-slate-500 text-sm">{selected.id} · {selected.purok}</p>
                <span className={`badge mt-1 ${selected.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>{selected.status}</span>
              </div>
            </div>
            {[
              ['Birthdate', formatDate(selected.birthdate)],
              ['Age', selected.age],
              ['Gender', selected.gender],
              ['Civil Status', selected.civilStatus],
              ['Occupation', selected.occupation],
              ['Address', selected.address],
              ['Contact', selected.contactNumber],
              ['Email', selected.email || '—'],
              ['Voter Status', selected.voterStatus],
              ['Registered', formatDate(selected.registeredDate)],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-slate-500">{k}</span>
                <span className="font-medium text-slate-800">{v}</span>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              {selected.soloParent && <span className="badge badge-yellow">Solo Parent</span>}
              {selected.indigent && <span className="badge badge-red">Indigent</span>}
              {selected.senior && <span className="badge badge-blue">Senior Citizen</span>}
              {selected.pwd && <span className="badge badge-gray">PWD</span>}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Deletion"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleDelete} className="btn-danger">Delete</button>
          </>
        }
      >
        <p className="text-slate-600">Are you sure you want to delete <strong>{deleteTarget?.firstName} {deleteTarget?.lastName}</strong>? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
