'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { clientAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Building, Wallet, Save } from 'lucide-react';

export default function ClientSettingsPage() {
  const { user, setUser } = useAuthStore();
  const [company, setCompany] = useState({ companyName: user?.companyName || '', companyDescription: user?.companyDescription || '', companyWebsite: user?.companyWebsite || '' });
  const [bank, setBank] = useState({ bankName: '', accountNumber: '', routingNumber: '', accountHolderName: '' });
  const [saving, setSaving] = useState(false);

  const saveCompany = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { const res = await clientAPI.updateProfile(company); setUser(res.data.data); toast.success('Updated'); } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  const saveBank = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await clientAPI.updateBankDetails(bank); toast.success('Bank details updated'); } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-dark">Settings</h1>
      <form onSubmit={saveCompany} className="card p-6 space-y-4">
        <h3 className="font-heading font-semibold flex items-center gap-2"><Building className="h-5 w-5 text-gold" /> Company Profile</h3>
        <div><label className="text-sm font-medium mb-1 block">Company Name</label><input value={company.companyName} onChange={e => setCompany({ ...company, companyName: e.target.value })} className="input-field" /></div>
        <div><label className="text-sm font-medium mb-1 block">Description</label><textarea rows={3} value={company.companyDescription} onChange={e => setCompany({ ...company, companyDescription: e.target.value })} className="input-field" /></div>
        <div><label className="text-sm font-medium mb-1 block">Website</label><input value={company.companyWebsite} onChange={e => setCompany({ ...company, companyWebsite: e.target.value })} className="input-field" /></div>
        <button type="submit" disabled={saving} className="btn-primary text-sm !py-2.5 gap-2"><Save className="h-4 w-4" /> Save</button>
      </form>
      <form onSubmit={saveBank} className="card p-6 space-y-4">
        <h3 className="font-heading font-semibold flex items-center gap-2"><Wallet className="h-5 w-5 text-gold" /> Bank / Payout Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium mb-1 block">Bank Name</label><input value={bank.bankName} onChange={e => setBank({ ...bank, bankName: e.target.value })} className="input-field" /></div>
          <div><label className="text-sm font-medium mb-1 block">Account Holder</label><input value={bank.accountHolderName} onChange={e => setBank({ ...bank, accountHolderName: e.target.value })} className="input-field" /></div>
          <div><label className="text-sm font-medium mb-1 block">Account Number</label><input value={bank.accountNumber} onChange={e => setBank({ ...bank, accountNumber: e.target.value })} className="input-field" /></div>
          <div><label className="text-sm font-medium mb-1 block">Routing Number</label><input value={bank.routingNumber} onChange={e => setBank({ ...bank, routingNumber: e.target.value })} className="input-field" /></div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary text-sm !py-2.5 gap-2"><Save className="h-4 w-4" /> Save</button>
      </form>
    </div>
  );
}