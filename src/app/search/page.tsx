'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuctionCard from '@/components/auction/AuctionCard';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { searchAPI } from '@/lib/api';
import { Auction } from '@/types';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Auction[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query.length >= 2) {
      setIsLoading(true);
      searchAPI.search({ q: query, limit: 20 }).then(res => { setResults(res.data.data || []); setTotal(res.data.pagination?.total || 0); }).catch(() => {}).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <><Header />
      <div className="bg-dark py-12"><div className="max-w-7xl mx-auto px-4"><h1 className="text-3xl font-heading font-bold text-white">Search Results</h1><p className="text-gray-400 mt-2">{total} results for &quot;{query}&quot;</p></div></div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? <PageLoader /> : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{results.map((r: any) => <AuctionCard key={r._id} auction={r} />)}</div>
        ) : (
          <div className="text-center py-20"><SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 text-lg">{query ? 'No results found' : 'Enter a search term'}</p></div>
        )}
      </div>
    <Footer /></>
  );
}