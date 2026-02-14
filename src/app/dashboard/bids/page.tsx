'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { bidAPI } from '@/lib/api';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Gavel } from 'lucide-react';

const tabs = ['all', 'winning', 'outbid', 'won', 'lost'];

export default function BidsPage() {
  const [bids, setBids] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const params: any = { limit: 50 };
    if (activeTab !== 'all') params.status = activeTab;
    bidAPI.getMyBids(params).then(res => setBids(res.data.data || [])).catch(() => {}).finally(() => setIsLoading(false));
  }, [activeTab]);

  const statusColor = (s: string) => {
    switch (s) { case 'winning': return 'bg-green-100 text-green-700'; case 'outbid': return 'bg-red-100 text-red-700'; case 'won': return 'bg-green-200 text-green-800'; case 'lost': return 'bg-gray-100 text-gray-700'; default: return 'bg-blue-100 text-blue-700'; }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-dark mb-6">My Bids</h1>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap ${activeTab === tab ? 'bg-gold text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>{tab}</button>
        ))}
      </div>
      {isLoading ? <PageLoader /> : bids.length === 0 ? (
        <div className="text-center py-16 card"><Gavel className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No bids found</p></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="table-header"><th className="px-4 py-3">Lot</th><th className="px-4 py-3">Auction</th><th className="px-4 py-3">Your Bid</th><th className="px-4 py-3">Current</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Time</th></tr></thead>
              <tbody>
                {bids.map((bid: any) => (
                  <tr key={bid._id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{bid.lot?.title || 'Lot'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {bid.auction?.slug ? <Link href={`/auctions/${bid.auction.slug}`} className="text-gold hover:underline">{bid.auction.title}</Link> : bid.auction?.title}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold">{formatCurrency(bid.amount)}</td>
                    <td className="px-4 py-3 text-sm">{bid.lot?.currentBid ? formatCurrency(bid.lot.currentBid) : '-'}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(bid.status)}`}>{bid.status}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{timeAgo(bid.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}