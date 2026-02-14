'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clientAPI } from '@/lib/api';
import { formatDate, getAuctionStatusColor } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Plus, Edit, Eye, Globe, GlobeIcon } from 'lucide-react';

export default function ClientAuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAuctions = () => {
    setIsLoading(true);
    clientAPI.getAuctions(filter ? { status: filter } : {}).then(res => setAuctions(res.data.data || [])).catch(() => {}).finally(() => setIsLoading(false));
  };

  useEffect(fetchAuctions, [filter]);

  const togglePublish = async (id: string, isPublished: boolean) => {
    try {
      if (isPublished) { await clientAPI.unpublishAuction(id); toast.success('Unpublished'); }
      else { await clientAPI.publishAuction(id); toast.success('Published'); }
      fetchAuctions();
    } catch (error: any) { toast.error(error.response?.data?.error || 'Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-dark">My Auctions</h1>
        <Link href="/client/auctions/new" className="btn-primary text-sm !py-2.5 gap-2"><Plus className="h-4 w-4" /> Create Auction</Link>
      </div>
      <div className="flex gap-2 mb-6">
        {['', 'draft', 'scheduled', 'live', 'ended'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${filter === s ? 'bg-gold text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>{s || 'All'}</button>
        ))}
      </div>
      {isLoading ? <PageLoader /> : auctions.length === 0 ? (
        <div className="text-center py-16 card"><p className="text-gray-500 mb-4">No auctions found</p><Link href="/client/auctions/new" className="btn-primary text-sm">Create Your First Auction</Link></div>
      ) : (
        <div className="card overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="table-header"><th className="px-4 py-3">Auction</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Lots</th><th className="px-4 py-3">Bids</th><th className="px-4 py-3">Dates</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>
          {auctions.map((a: any) => (
            <tr key={a._id} className="border-t border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3"><p className="text-sm font-medium">{a.title}</p></td>
              <td className="px-4 py-3"><span className={`${getAuctionStatusColor(a.status)} text-white text-xs px-2.5 py-1 rounded-full`}>{a.status}</span></td>
              <td className="px-4 py-3 text-sm">{a.totalLots}</td>
              <td className="px-4 py-3 text-sm">{a.totalBids}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{formatDate(a.startTime)} - {formatDate(a.endTime)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link href={`/client/auctions/${a._id}/lots`} className="text-gold hover:text-gold-dark text-sm">Lots</Link>
                  <Link href={`/client/auctions/${a._id}/edit`} className="text-gray-500 hover:text-gray-700"><Edit className="h-4 w-4" /></Link>
                  <button onClick={() => togglePublish(a._id, a.isPublished)} className={`text-sm ${a.isPublished ? 'text-red-500' : 'text-green-600'}`}>{a.isPublished ? 'Unpublish' : 'Publish'}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody></table></div></div>
      )}
    </div>
  );
}