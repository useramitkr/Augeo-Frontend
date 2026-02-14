'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Auction } from '@/types';
import { formatCurrency, formatDate, getAuctionStatusColor } from '@/lib/utils';
import CountdownTimer from '@/components/common/CountdownTimer';
import { Calendar, MapPin, Layers, Eye } from 'lucide-react';

interface AuctionCardProps {
  auction: Auction;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const isLive = auction.status === 'live';
  const isScheduled = auction.status === 'scheduled';

  return (
    <Link href={`/auctions/${auction.slug}`}>
      <div className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {auction.coverImage ? (
            <Image
              src={auction.coverImage.startsWith('http') ? auction.coverImage : `http://localhost:5000${auction.coverImage}`}
              alt={auction.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-dark to-dark-lighter flex items-center justify-center">
              <span className="text-gold text-4xl font-heading font-bold">A</span>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <span className={`${getAuctionStatusColor(auction.status)} text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide`}>
              {isLive ? 'Live Now' : auction.status}
            </span>
          </div>

          {auction.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full">Featured</span>
            </div>
          )}

          {/* Countdown overlay for live auctions */}
          {isLive && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <CountdownTimer endTime={auction.endTime} variant="compact" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-heading font-semibold text-lg text-dark group-hover:text-gold transition-colors line-clamp-2 mb-2">
            {auction.title}
          </h3>

          {auction.shortDescription && (
            <p className="text-gray-500 text-sm line-clamp-2 mb-3">{auction.shortDescription}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{isScheduled ? `Starts ${formatDate(auction.startTime)}` : formatDate(auction.startTime)}</span>
            </div>
            {auction.location?.city && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{auction.location.city}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1 text-sm">
              <Layers className="h-4 w-4 text-gold" />
              <span className="font-medium">{auction.totalLots} Lots</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              <span>{auction.viewCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
