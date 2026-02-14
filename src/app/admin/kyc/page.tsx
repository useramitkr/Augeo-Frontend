'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Eye, Shield, FileText, Download } from 'lucide-react';

export default function AdminKYCPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchKYC = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const res = await adminAPI.getKYCRequests(params);
      setRequests(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchKYC(); }, [page, statusFilter]);

  const handleApprove = async (userId: string) => {
    try {
      await adminAPI.approveKYC(userId);
      toast.success('KYC approved');
      fetchKYC();
      setSelectedUser(null);
    } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleReject = async (userId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await adminAPI.rejectKYC(userId, { reason });
      toast.success('KYC rejected');
      fetchKYC();
      setSelectedUser(null);
    } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-dark flex items-center gap-2"><Shield className="h-6 w-6 text-gold" /> KYC Verification</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {['pending', 'verified', 'rejected', ''].map(status => (
          <button key={status || 'all'} onClick={() => { setStatusFilter(status); setPage(1); }}
            className={`card p-4 text-center transition-all ${statusFilter === status ? 'ring-2 ring-gold' : ''}`}>
            <p className="text-2xl font-bold">{status === '' ? 'All' : ''}</p>
            <p className="text-sm text-gray-500 capitalize">{status || 'All Requests'}</p>
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Document Type</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Submitted</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {requests.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{user.firstName} {user.lastName}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>{user.kyc?.documents?.length || 0} document(s)</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        user.kyc?.status === 'verified' ? 'bg-green-100 text-green-700' :
                        user.kyc?.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{user.kyc?.status || 'pending'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(user.kyc?.submittedAt || user.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedUser(user)} className="p-1.5 hover:bg-gray-100 rounded" title="Review"><Eye className="h-4 w-4" /></button>
                        {user.kyc?.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(user._id)} className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Approve"><CheckCircle className="h-4 w-4" /></button>
                            <button onClick={() => handleReject(user._id)} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Reject"><XCircle className="h-4 w-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && <p className="text-center py-8 text-gray-500">No KYC requests found</p>}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
          <span className="px-4 py-2 text-sm">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-heading font-bold mb-4">KYC Review - {selectedUser.firstName} {selectedUser.lastName}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Email:</span><p className="font-medium">{selectedUser.email}</p></div>
                <div><span className="text-gray-500">Phone:</span><p className="font-medium">{selectedUser.phone || 'N/A'}</p></div>
                <div><span className="text-gray-500">Status:</span><p className="font-medium capitalize">{selectedUser.kyc?.status}</p></div>
                <div><span className="text-gray-500">Role:</span><p className="font-medium">{selectedUser.role}</p></div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Submitted Documents</h4>
                <div className="space-y-2">
                  {(selectedUser.kyc?.documents || []).map((doc: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{doc.type || `Document ${idx + 1}`}</p>
                          <p className="text-xs text-gray-500">{doc.filename || doc.url}</p>
                        </div>
                      </div>
                      {doc.url && (
                        <a href={`${process.env.NEXT_PUBLIC_API_URL}/${doc.url}`} target="_blank" className="p-2 hover:bg-gray-200 rounded"><Download className="h-4 w-4" /></a>
                      )}
                    </div>
                  ))}
                  {(!selectedUser.kyc?.documents || selectedUser.kyc.documents.length === 0) && (
                    <p className="text-sm text-gray-500">No documents uploaded</p>
                  )}
                </div>
              </div>

              {selectedUser.kyc?.rejectionReason && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 text-red-600">Rejection Reason</h4>
                  <p className="text-sm text-gray-700 bg-red-50 p-3 rounded">{selectedUser.kyc.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              {selectedUser.kyc?.status === 'pending' && (
                <>
                  <button onClick={() => handleApprove(selectedUser._id)} className="btn-primary !bg-green-600 !py-2 text-sm flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Approve</button>
                  <button onClick={() => handleReject(selectedUser._id)} className="btn-primary !bg-red-500 !py-2 text-sm flex items-center gap-1"><XCircle className="h-4 w-4" /> Reject</button>
                </>
              )}
              <button onClick={() => setSelectedUser(null)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}