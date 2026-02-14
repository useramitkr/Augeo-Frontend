'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuctionCard from '@/components/auction/AuctionCard';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { auctionAPI } from '@/lib/api';
import { Auction } from '@/types';

export default function CategoryAuctionsPage() {
  const params = useParams();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    auctionAPI.getByCategory(params.slug as string).then(res => { setAuctions(res.data.data || []); setCategoryName(res.data.category?.name || ''); }).catch(() => {}).finally(() => setIsLoading(false));
  }, [params.slug]);

  if (isLoading) return <><Header /><PageLoader /><Footer /></>;
  return (
    <><Header />
      <div className="bg-dark py-12"><div className="max-w-7xl mx-auto px-4"><h1 className="text-4xl font-heading font-bold text-white">{categoryName || 'Category'}</h1><p className="text-gray-400 mt-2">{auctions.length} auctions in this category</p></div></div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {auctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{auctions.map(a => <AuctionCard key={a._id} auction={a} />)}</div>
        ) : (
          <div className="text-center py-20"><p className="text-gray-500 text-lg">No auctions in this category yet</p></div>
        )}
      </div>
    <Footer /></>
  );
}