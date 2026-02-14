'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LotCard from '@/components/auction/LotCard';
import BidPanel from '@/components/bidding/BidPanel';
import CountdownTimer from '@/components/common/CountdownTimer';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { auctionAPI, lotAPI, watchlistAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { joinAuction, leaveAuction } from '@/lib/socket';
import { Auction, Lot, Bid } from '@/types';
import { formatCurrency, formatDate, getAuctionStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Heart, Share2, MapPin, Calendar, Users, Gavel, Eye, Shield, ChevronLeft, ChevronRight, X, Clock, MessageSquare } from 'lucide-react';

export default function AuctionDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [auction, setAuction] = useState<(Auction & { lots?: Lot[] }) | null>(null);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [isWatching, setIsWatching] = useState(false);
  const [watchId, setWatchId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const slug = params.slug as string;
    auctionAPI.getBySlug(slug)
      .then(res => {
        setAuction(res.data.data);
        const lotId = searchParams.get('lot');
        if (lotId && res.data.data.lots) {
          const lot = res.data.data.lots.find((l: Lot) => l._id === lotId);
          if (lot) setSelectedLot(lot);
        }
      })
      .catch(() => toast.error('Auction not found'))
      .finally(() => setIsLoading(false));
  }, [params.slug, searchParams]);

  useEffect(() => {
    if (auction?._id) {
      joinAuction(auction._id);
      if (isAuthenticated) {
        watchlistAPI.check(auction._id).then(res => { setIsWatching(res.data.isWatching); if (res.data.data) setWatchId(res.data.data._id); }).catch(() => {});
      }
      return () => { leaveAuction(auction._id); };
    }
  }, [auction?._id, isAuthenticated]);

  useEffect(() => {
    if (selectedLot) {
      lotAPI.getBidHistory(selectedLot._id).then(res => setBidHistory(res.data.data || [])).catch(() => {});
    }
  }, [selectedLot]);

  const toggleWatchlist = async () => {
    if (!isAuthenticated) { toast.error('Please sign in'); return; }
    try {
      if (isWatching) {
        await watchlistAPI.remove(watchId);
        setIsWatching(false); toast.success('Removed from watchlist');
      } else {
        const res = await watchlistAPI.add({ auctionId: auction!._id });
        setIsWatching(true); setWatchId(res.data.data._id); toast.success('Added to watchlist');
      }
    } catch { toast.error('Failed to update watchlist'); }
  };

  const handleShare = () => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); };

  if (isLoading) return <><Header /><PageLoader /><Footer /></>;
  if (!auction) return <><Header /><div className="min-h-[60vh] flex items-center justify-center"><p className="text-gray-500 text-lg">Auction not found</p></div><Footer /></>;

  const lots = auction.lots || [];
  const client = typeof auction.client === 'object' ? auction.client : null;

  return (
    <><Header />
      {/* Banner */}
      <div className="bg-dark">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`${getAuctionStatusColor(auction.status)} text-white text-xs px-3 py-1 rounded-full uppercase font-semibold`}>
                  {auction.status === 'live' ? 'Live Now' : auction.status}
                </span>
                {auction.isFeatured && <span className="bg-gold text-white text-xs px-3 py-1 rounded-full">Featured</span>}
              </div>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-3">{auction.title}</h1>
              {client && <p className="text-gold font-medium mb-2">{client.companyName || client.fullName}</p>}
              <p className="text-gray-400 text-sm line-clamp-3 mb-4">{auction.shortDescription || auction.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {auction.location?.city && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{auction.location.city}, {auction.location.country}</span>}
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(auction.startTime)} - {formatDate(auction.endTime)}</span>
                <span className="flex items-center gap-1"><Gavel className="h-4 w-4" />{auction.totalLots} Lots</span>
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{auction.viewCount} views</span>
              </div>
            </div>
            <div className="lg:text-right space-y-4">
              {(auction.status === 'live' || auction.status === 'scheduled') && (
                <div>
                  <p className="text-gray-400 text-xs uppercase mb-2">{auction.status === 'live' ? 'Ends In' : 'Starts In'}</p>
                  <CountdownTimer endTime={auction.status === 'live' ? auction.endTime : auction.startTime} variant="large" />
                </div>
              )}
              <div className="flex items-center gap-3 lg:justify-end">
                <button onClick={toggleWatchlist} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isWatching ? 'bg-gold text-white border-gold' : 'border-gray-600 text-gray-300 hover:border-gold hover:text-gold'}`}>
                  <Heart className={`h-4 w-4 ${isWatching ? 'fill-current' : ''}`} />{isWatching ? 'Watching' : 'Watch'}
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-gold hover:text-gold text-sm font-medium">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lots grid / selected lot */}
          <div className="flex-1">
            {selectedLot ? (
              <div>
                <button onClick={() => { setSelectedLot(null); setBidHistory([]); }} className="flex items-center gap-1 text-gold mb-4 hover:text-gold-dark font-medium">
                  <ChevronLeft className="h-4 w-4" /> Back to All Lots
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Images */}
                  <div>
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative mb-3">
                      {selectedLot.images?.[selectedImage]?.url ? (
                        <Image src={selectedLot.images[selectedImage].url.startsWith('http') ? selectedLot.images[selectedImage].url : `http://localhost:5000${selectedLot.images[selectedImage].url}`} alt={selectedLot.title} fill className="object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Gavel className="h-16 w-16 text-gray-300" /></div>
                      )}
                    </div>
                    {selectedLot.images && selectedLot.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {selectedLot.images.map((img, i) => (
                          <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${i === selectedImage ? 'border-gold' : 'border-gray-200'}`}>
                            <Image src={img.url.startsWith('http') ? img.url : `http://localhost:5000${img.url}`} alt="" width={64} height={64} className="object-cover w-full h-full" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Lot details */}
                  <div>
                    <span className="text-sm text-gray-500">Lot {selectedLot.lotNumber}</span>
                    <h2 className="text-2xl font-heading font-bold text-dark mt-1 mb-2">{selectedLot.title}</h2>
                    {selectedLot.artist && <p className="text-gold font-medium mb-3">{selectedLot.artist}</p>}
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{selectedLot.description}</p>

                    <div className="space-y-3 mb-6">
                      {selectedLot.conditionReport && <div><h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1"><Shield className="h-4 w-4 text-gold" /> Condition Report</h4><p className="text-sm text-gray-600 mt-1">{selectedLot.conditionReport}</p></div>}
                      {selectedLot.provenance && <div><h4 className="text-sm font-semibold text-gray-700">Provenance</h4><p className="text-sm text-gray-600 mt-1">{selectedLot.provenance}</p></div>}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {selectedLot.dimensions && <div><span className="text-gray-500">Dimensions:</span> <span className="font-medium">{selectedLot.dimensions}</span></div>}
                        {selectedLot.materials && <div><span className="text-gray-500">Materials:</span> <span className="font-medium">{selectedLot.materials}</span></div>}
                        {selectedLot.origin && <div><span className="text-gray-500">Origin:</span> <span className="font-medium">{selectedLot.origin}</span></div>}
                        {selectedLot.yearCreated && <div><span className="text-gray-500">Year:</span> <span className="font-medium">{selectedLot.yearCreated}</span></div>}
                      </div>
                    </div>

                    {/* Bid history */}
                    {bidHistory.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Bid History ({bidHistory.length})</h4>
                        <div className="max-h-48 overflow-y-auto space-y-1.5">
                          {bidHistory.map((b: any, i: number) => (
                            <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50">
                              <span className="text-gray-600">{b.bidderName}</span>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">{formatCurrency(b.amount)}</span>
                                {b.isWinning && <span className="text-green-600 text-xs font-medium">Leading</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="section-title mb-6">All Lots ({lots.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {lots.map(lot => (
                    <div key={lot._id} onClick={() => { setSelectedLot(lot); setSelectedImage(0); }} className="cursor-pointer">
                      <LotCard lot={lot} auctionSlug={auction.slug} />
                    </div>
                  ))}
                </div>
                {lots.length === 0 && <p className="text-center py-12 text-gray-500">No lots available yet</p>}
              </div>
            )}
          </div>

          {/* Bid Panel (sticky sidebar) */}
          {selectedLot && (
            <div className="lg:w-96 lg:sticky lg:top-24 lg:self-start">
              <BidPanel lot={selectedLot} auctionEndTime={auction.endTime} auctionStatus={auction.status} />
              <div className="mt-4 bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                <p className="font-medium text-dark mb-1">Buyer&apos;s Premium: {auction.buyersPremium}%</p>
                <p>A {auction.buyersPremium}% buyer&apos;s premium will be added to the hammer price.</p>
              </div>
            </div>
          )}
        </div>

        {/* Auction description */}
        {!selectedLot && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-heading font-bold text-dark mb-4">About This Auction</h3>
              <div className="prose prose-sm text-gray-600" dangerouslySetInnerHTML={{ __html: auction.description }} />
              {auction.termsAndConditions && (
                <div className="mt-8"><h4 className="text-lg font-heading font-bold text-dark mb-3">Terms & Conditions</h4><p className="text-sm text-gray-600 whitespace-pre-wrap">{auction.termsAndConditions}</p></div>
              )}
            </div>
            <div>
              <div className="card p-6">
                <h4 className="font-heading font-semibold text-dark mb-4">Auction Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Auction Type</span><span className="font-medium capitalize">{auction.auctionType}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Buyer&apos;s Premium</span><span className="font-medium">{auction.buyersPremium}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Currency</span><span className="font-medium">{auction.currency}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total Lots</span><span className="font-medium">{auction.totalLots}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total Bids</span><span className="font-medium">{auction.totalBids}</span></div>
                </div>
                {client && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <h5 className="font-medium text-dark mb-2">Auction House</h5>
                    <p className="text-sm text-gold font-medium">{client.companyName}</p>
                    {client.companyDescription && <p className="text-xs text-gray-500 mt-1 line-clamp-3">{client.companyDescription}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    <Footer /></>
  );
}