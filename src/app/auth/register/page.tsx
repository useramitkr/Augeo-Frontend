'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, Gavel } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }

    setIsLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, phone: form.phone });
      toast.success('Account created! Please check your email to verify.');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <>
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Gavel className="h-12 w-12 text-gold mx-auto mb-4" />
            <h1 className="text-3xl font-heading font-bold text-dark">Create Account</h1>
            <p className="text-gray-500 mt-2">Join Augeo to start bidding on extraordinary items</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" required value={form.firstName} onChange={e => update('firstName', e.target.value)} className="input-field pl-9 text-sm" placeholder="John" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" required value={form.lastName} onChange={e => update('lastName', e.target.value)} className="input-field text-sm" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} className="input-field pl-9 text-sm" placeholder="your@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-field pl-9 text-sm" placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="password" required value={form.password} onChange={e => update('password', e.target.value)} className="input-field pl-9 text-sm" placeholder="Min 8 characters" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="password" required value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className="input-field pl-9 text-sm" placeholder="Re-enter password" />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full !py-3.5 disabled:opacity-50">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By registering, you agree to our <Link href="/pages/terms" className="text-gold">Terms</Link> and <Link href="/pages/privacy" className="text-gold">Privacy Policy</Link>
              </p>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Already have an account? <Link href="/auth/login" className="text-gold font-semibold hover:text-gold-dark">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}