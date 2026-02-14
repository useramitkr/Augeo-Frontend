'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { watchlistAPI } from '@/lib/api';
import { PageLoader } from '@/components/common/LoadingSpinner';
import CountdownTimer from '@/components/common/CountdownTimer';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Heart, Trash2 } from 'lucide-react';

export default function WatchlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    watchlistAPI.getAll().then(res => setItems(res.data.data || [])).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const removeItem = async (id: string) => {
    try { await watchlistAPI.remove(id); setItems(items.filter(i => i._id !== id)); toast.success('Removed'); } catch { toast.error('Failed'); }
  };

  if (isLoading) return <PageLoader />;
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-dark mb-6">Watchlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-16 card"><Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Your watchlist is empty</p><Link href="/auctions" className="btn-primary mt-4 inline-flex">Browse Auctions</Link></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item: any) => {
            const auction = item.auction;
            if (!auction) return null;
            return (
              <div key={item._id} className="card p-4 flex gap-4">
                <div className="w-20 h-20 bg-dark rounded-lg flex items-center justify-center flex-shrink-0">
                  {auction.coverImage ? <img src={auction.coverImage} alt="" className="w-full h-full object-cover rounded-lg" /> : <span className="text-gold font-bold text-xl">A</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/auctions/${auction.slug}`} className="font-medium text-dark hover:text-gold line-clamp-1">{auction.title}</Link>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(auction.startTime)} - {formatDate(auction.endTime)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${auction.status === 'live' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{auction.status}</span>
                    {(auction.status === 'live' || auction.status === 'scheduled') && <CountdownTimer endTime={auction.status === 'live' ? auction.endTime : auction.startTime} variant="compact" />}
                  </div>
                </div>
                <button onClick={() => removeItem(item._id)} className="text-gray-400 hover:text-red-500 self-start"><Trash2 className="h-4 w-4" /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}