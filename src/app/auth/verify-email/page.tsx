'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (token) {
      authAPI.verifyEmail(token)
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <>
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          {status === 'loading' && <><Loader2 className="h-16 w-16 text-gold animate-spin mx-auto mb-4" /><p className="text-gray-600">Verifying your email...</p></>}
          {status === 'success' && <><CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" /><h2 className="text-2xl font-heading font-bold text-dark mb-2">Email Verified!</h2><p className="text-gray-500 mb-6">Your account is now fully activated.</p><Link href="/dashboard" className="btn-primary">Go to Dashboard</Link></>}
          {status === 'error' && <><XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" /><h2 className="text-2xl font-heading font-bold text-dark mb-2">Verification Failed</h2><p className="text-gray-500 mb-6">The link is invalid or expired.</p><Link href="/auth/login" className="btn-primary">Back to Login</Link></>}
        </div>
      </div>
    </>
  );
}