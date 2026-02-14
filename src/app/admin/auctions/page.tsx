'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Search, ChevronLeft, ChevronRight, Eye, XCircle, PauseCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminAuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await adminAPI.getAuctions(params);
      setAuctions(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchAuctions(); }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchAuctions(); };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this auction? This cannot be undone.')) return;
    try {
      await adminAPI.cancelAuction(id);
      toast.success('Auction cancelled');
      fetchAuctions();
    } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm('Suspend this auction?')) return;
    try {
      await adminAPI.suspendAuction(id);
      toast.success('Auction suspended');
      fetchAuctions();
    } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    scheduled: 'bg-blue-100 text-blue-700',
    live: 'bg-green-100 text-green-700',
    ended: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-purple-100 text-purple-700',
    cancelled: 'bg-red-100 text-red-700',
    suspended: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-dark">Auction Oversight</h1>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search auctions..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
            </div>
            <button type="submit" className="btn-primary !py-2">Search</button>
          </form>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field w-40">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="ended">Ended</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Auction</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Lots</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Start</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">End</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {auctions.map(auction => (
                  <tr key={auction._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{auction.title}</p>
                      <p className="text-xs text-gray-500">{auction.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{auction.client?.companyName || auction.client?.firstName || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[auction.status] || 'bg-gray-100'}`}>{auction.status}</span>
                    </td>
                    <td className="px-4 py-3">{auction.stats?.totalLots || 0}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(auction.startTime)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(auction.endTime)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/auctions/${auction.slug}`} className="p-1.5 hover:bg-gray-100 rounded" title="View"><ExternalLink className="h-4 w-4" /></Link>
                        {['live', 'scheduled'].includes(auction.status) && (
                          <>
                            <button onClick={() => handleSuspend(auction._id)} className="p-1.5 hover:bg-orange-50 rounded text-orange-500" title="Suspend"><PauseCircle className="h-4 w-4" /></button>
                            <button onClick={() => handleCancel(auction._id)} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Cancel"><XCircle className="h-4 w-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {auctions.length === 0 && <p className="text-center py-8 text-gray-500">No auctions found</p>}
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
    </div>
  );
}