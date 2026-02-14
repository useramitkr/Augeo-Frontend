'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { User, MapPin, Plus, Trash2, Upload, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
  const [addressForm, setAddressForm] = useState({ label: 'Home', street: '', city: '', state: '', zipCode: '', country: '', isDefault: false });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { const res = await userAPI.updateProfile(form); setUser(res.data.data); toast.success('Profile updated'); } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try { const res = await userAPI.addAddress(addressForm); setUser({ ...user!, addresses: res.data.data }); setShowAddAddress(false); setAddressForm({ label: 'Home', street: '', city: '', state: '', zipCode: '', country: '', isDefault: false }); toast.success('Address added'); } catch { toast.error('Failed'); }
  };

  const handleDeleteAddress = async (id: string) => {
    try { const res = await userAPI.deleteAddress(id); setUser({ ...user!, addresses: res.data.data }); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  const handleKYC = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const formData = new FormData();
    for (const file of e.target.files) formData.append('kycDocuments', file);
    try { await userAPI.uploadKYC(formData); toast.success('KYC documents uploaded for review'); } catch { toast.error('Upload failed'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-dark">Profile</h1>

      {/* Profile form */}
      <div className="card p-6">
        <h3 className="font-heading font-semibold flex items-center gap-2 mb-4"><User className="h-5 w-5 text-gold" /> Personal Information</h3>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">First Name</label><input type="text" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="input-field" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Last Name</label><input type="text" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="input-field" /></div>
          </div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Email</label><input type="email" value={user?.email} disabled className="input-field bg-gray-50" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label><input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" /></div>
          <button type="submit" disabled={saving} className="btn-primary !py-2.5 disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>

      {/* Addresses */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold flex items-center gap-2"><MapPin className="h-5 w-5 text-gold" /> Addresses</h3>
          <button onClick={() => setShowAddAddress(!showAddAddress)} className="text-sm text-gold flex items-center gap-1"><Plus className="h-4 w-4" /> Add</button>
        </div>
        {showAddAddress && (
          <form onSubmit={handleAddAddress} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Label (e.g. Home)" value={addressForm.label} onChange={e => setAddressForm({ ...addressForm, label: e.target.value })} className="input-field text-sm" />
              <input placeholder="Country" required value={addressForm.country} onChange={e => setAddressForm({ ...addressForm, country: e.target.value })} className="input-field text-sm" />
            </div>
            <input placeholder="Street" required value={addressForm.street} onChange={e => setAddressForm({ ...addressForm, street: e.target.value })} className="input-field text-sm" />
            <div className="grid grid-cols-3 gap-3">
              <input placeholder="City" required value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} className="input-field text-sm" />
              <input placeholder="State" required value={addressForm.state} onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} className="input-field text-sm" />
              <input placeholder="Zip Code" required value={addressForm.zipCode} onChange={e => setAddressForm({ ...addressForm, zipCode: e.target.value })} className="input-field text-sm" />
            </div>
            <button type="submit" className="btn-primary text-sm !py-2">Save Address</button>
          </form>
        )}
        <div className="space-y-2">
          {user?.addresses?.map((addr, i) => (
            <div key={i} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
              <div><p className="text-sm font-medium">{addr.label} {addr.isDefault && <span className="text-xs text-gold">(Default)</span>}</p><p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}</p></div>
              <button onClick={() => addr._id && handleDeleteAddress(addr._id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {(!user?.addresses || user.addresses.length === 0) && <p className="text-sm text-gray-400">No addresses saved</p>}
        </div>
      </div>

      {/* KYC */}
      <div className="card p-6">
        <h3 className="font-heading font-semibold flex items-center gap-2 mb-4"><Shield className="h-5 w-5 text-gold" /> Identity Verification (KYC)</h3>
        <p className="text-sm text-gray-500 mb-3">Status: <span className={`font-medium ${user?.kycStatus === 'approved' ? 'text-green-600' : user?.kycStatus === 'pending' ? 'text-yellow-600' : 'text-gray-600'}`}>{user?.kycStatus || 'none'}</span></p>
        {user?.kycStatus !== 'approved' && (
          <div>
            <label className="flex items-center gap-2 btn-outline text-sm cursor-pointer !py-2">
              <Upload className="h-4 w-4" /> Upload Documents
              <input type="file" multiple accept="image/*,.pdf" onChange={handleKYC} className="hidden" />
            </label>
            <p className="text-xs text-gray-400 mt-2">Upload a government-issued ID (JPG, PNG, or PDF)</p>
          </div>
        )}
      </div>
    </div>
  );
}