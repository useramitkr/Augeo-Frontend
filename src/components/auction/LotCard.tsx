'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Lot, Auction } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Gavel, Eye } from 'lucide-react';

interface LotCardProps {
  lot: Lot;
  auctionSlug: string;
}

export default function LotCard({ lot, auctionSlug }: LotCardProps) {
  const mainImage = lot.images?.[0]?.url;

  return (
    <Link href={`/auctions/${auctionSlug}?lot=${lot._id}`}>
      <div className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {mainImage ? (
            <Image
              src={mainImage.startsWith('http') ? mainImage : `http://localhost:5000${mainImage}`}
              alt={lot.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Gavel className="h-8 w-8 text-gray-400" />
            </div>
          )}

          <div className="absolute top-2 left-2 bg-dark/80 text-white text-xs px-2 py-1 rounded">
            Lot {lot.lotNumber}
          </div>

          {lot.status === 'sold' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded -rotate-12">SOLD</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h4 className="font-medium text-sm text-dark group-hover:text-gold transition-colors line-clamp-2 mb-1">
            {lot.title}
          </h4>

          {lot.artist && (
            <p className="text-xs text-gray-500 mb-2">{lot.artist}</p>
          )}

          {lot.estimateLow && lot.estimateHigh && (
            <p className="text-xs text-gray-500 mb-1">
              Est. {formatCurrency(lot.estimateLow)} - {formatCurrency(lot.estimateHigh)}
            </p>
          )}

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div>
              <p className="text-[10px] text-gray-500 uppercase">
                {lot.currentBid > 0 ? 'Current Bid' : 'Starting Bid'}
              </p>
              <p className="text-sm font-bold text-dark">
                {formatCurrency(lot.currentBid > 0 ? lot.currentBid : lot.startingBid)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Gavel className="h-3 w-3" />
              <span>{lot.totalBids} bids</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
