'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch {
      toast.error('Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-heading font-bold text-dark mb-2">Check Your Email</h2>
              <p className="text-gray-500 mb-6">If an account exists for {email}, we&apos;ve sent a password reset link.</p>
              <Link href="/auth/login" className="btn-primary">Back to Login</Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-heading font-bold text-dark mb-2">Forgot Password?</h1>
              <p className="text-gray-500 mb-6">Enter your email and we&apos;ll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10" placeholder="your@email.com" />
                </div>
                <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-50">
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <Link href="/auth/login" className="flex items-center gap-1 text-sm text-gold mt-4 hover:text-gold-dark">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}