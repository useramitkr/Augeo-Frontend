'use client';
import { useState } from 'react';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Lock, Bell, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try {
      await userAPI.updateProfile({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password updated');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) { toast.error(error.response?.data?.error || 'Failed'); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-dark">Settings</h1>

      <div className="card p-6">
        <h3 className="font-heading font-semibold flex items-center gap-2 mb-4"><Lock className="h-5 w-5 text-gold" /> Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Current Password</label><input type="password" required value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} className="input-field" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label><input type="password" required minLength={8} value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} className="input-field" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Confirm New Password</label><input type="password" required value={passwords.confirmPassword} onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="input-field" /></div>
          <button type="submit" disabled={saving} className="btn-primary !py-2.5 disabled:opacity-50">{saving ? 'Updating...' : 'Update Password'}</button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="font-heading font-semibold flex items-center gap-2 mb-4"><Bell className="h-5 w-5 text-gold" /> Notification Preferences</h3>
        <div className="space-y-3">
          {['Outbid alerts', 'Auction starting', 'Auction ending soon', 'Auction won', 'Payment reminders', 'Shipping updates'].map(pref => (
            <label key={pref} className="flex items-center justify-between py-2">
              <span className="text-sm">{pref}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-gold rounded border-gray-300" />
            </label>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-heading font-semibold flex items-center gap-2 mb-4"><CreditCard className="h-5 w-5 text-gold" /> Payment Methods</h3>
        <p className="text-sm text-gray-500">Payment methods are managed during checkout. Your card information is securely stored by Stripe.</p>
      </div>
    </div>
  );
}