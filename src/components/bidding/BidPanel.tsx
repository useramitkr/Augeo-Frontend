'use client';

import { useState, useEffect } from 'react';
import { Lot, Bid } from '@/types';
import { formatCurrency, getMinimumBid } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { bidAPI } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import CountdownTimer from '@/components/common/CountdownTimer';
import toast from 'react-hot-toast';
import { Gavel, TrendingUp, AlertTriangle, Shield, Clock } from 'lucide-react';

interface BidPanelProps {
  lot: Lot;
  auctionEndTime: string;
  auctionStatus: string;
  onBidPlaced?: (bid: Bid) => void;
}

export default function BidPanel({ lot, auctionEndTime, auctionStatus, onBidPlaced }: BidPanelProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [bidAmount, setBidAmount] = useState('');
  const [maxAutoBid, setMaxAutoBid] = useState('');
  const [showAutoBid, setShowAutoBid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentBid, setCurrentBid] = useState(lot.currentBid);
  const [totalBids, setTotalBids] = useState(lot.totalBids);
  const [recentBids, setRecentBids] = useState<any[]>([]);

  const minimumBid = getMinimumBid(currentBid, lot.startingBid, lot.bidIncrement);
  const isLive = auctionStatus === 'live';
  const isUserHighestBidder = lot.currentBidder && user && (typeof lot.currentBidder === 'string' ? lot.currentBidder === user._id : lot.currentBidder._id === user._id);

  useEffect(() => {
    setBidAmount(minimumBid.toString());
  }, [minimumBid]);

  // Listen for real-time bid updates
  useEffect(() => {
    const socket = getSocket();

    socket.on('bid:new', (data: any) => {
      if (data.lotId === lot._id) {
        setCurrentBid(data.amount);
        setTotalBids(data.totalBids);
        setRecentBids(prev => [data, ...prev].slice(0, 5));
      }
    });

    return () => {
      socket.off('bid:new');
    };
  }, [lot._id]);

  const handleBidSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to place a bid');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minimumBid) {
      toast.error(`Minimum bid is ${formatCurrency(minimumBid)}`);
      return;
    }

    setShowConfirmation(true);
  };

  const confirmBid = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    try {
      const data: any = {
        lotId: lot._id,
        amount: parseFloat(bidAmount),
      };

      if (showAutoBid && maxAutoBid) {
        data.maxAutoBid = parseFloat(maxAutoBid);
      }

      const res = await bidAPI.placeBid(data);
      toast.success(`Bid of ${formatCurrency(parseFloat(bidAmount))} placed successfully!`);
      setBidAmount('');
      setMaxAutoBid('');
      if (onBidPlaced) onBidPlaced(res.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to place bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  const incrementBid = () => {
    const current = parseFloat(bidAmount) || minimumBid;
    setBidAmount((current + lot.bidIncrement).toString());
  };

  const decrementBid = () => {
    const current = parseFloat(bidAmount) || minimumBid;
    const newAmount = current - lot.bidIncrement;
    if (newAmount >= minimumBid) {
      setBidAmount(newAmount.toString());
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-dark p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            {currentBid > 0 ? 'Current Bid' : 'Starting Bid'}
          </span>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Gavel className="h-3 w-3" />
            <span>{totalBids} bids</span>
          </div>
        </div>
        <div className="text-3xl font-bold text-white">
          {formatCurrency(currentBid > 0 ? currentBid : lot.startingBid)}
        </div>
        {lot.estimateLow && lot.estimateHigh && (
          <p className="text-gray-400 text-xs mt-1">
            Estimate: {formatCurrency(lot.estimateLow)} - {formatCurrency(lot.estimateHigh)}
          </p>
        )}
      </div>

      {/* Countdown */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Time Remaining</span>
          <CountdownTimer endTime={auctionEndTime} variant="compact" />
        </div>
      </div>

      {/* Bid form */}
      <div className="p-4">
        {isLive && lot.status === 'active' ? (
          <>
            {isUserHighestBidder && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">You are the highest bidder!</span>
              </div>
            )}

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Your Bid</label>
              <div className="flex items-center gap-2">
                <button onClick={decrementBid} className="h-11 w-11 rounded-lg border border-gray-300 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-50">-</button>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={minimumBid}
                    step={lot.bidIncrement}
                    className="input-field pl-7 text-center text-lg font-semibold"
                  />
                </div>
                <button onClick={incrementBid} className="h-11 w-11 rounded-lg border border-gray-300 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-50">+</button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum bid: {formatCurrency(minimumBid)} (increment: {formatCurrency(lot.bidIncrement)})</p>
            </div>

            {/* Auto-bid toggle */}
            {lot.autoBidEnabled && (
              <div className="mb-4">
                <button
                  onClick={() => setShowAutoBid(!showAutoBid)}
                  className="text-sm text-gold hover:text-gold-dark font-medium flex items-center gap-1"
                >
                  <TrendingUp className="h-4 w-4" />
                  {showAutoBid ? 'Hide' : 'Set'} Auto-Bid
                </button>
                {showAutoBid && (
                  <div className="mt-2">
                    <label className="text-xs text-gray-600 mb-1 block">Maximum auto-bid amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={maxAutoBid}
                        onChange={(e) => setMaxAutoBid(e.target.value)}
                        min={minimumBid}
                        className="input-field pl-7 text-sm"
                        placeholder="Enter max amount"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">We&apos;ll automatically bid on your behalf up to this amount.</p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleBidSubmit}
              disabled={isSubmitting}
              className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Placing Bid...' : `Place Bid ${bidAmount ? formatCurrency(parseFloat(bidAmount)) : ''}`}
            </button>

            <p className="text-[10px] text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              By bidding, you agree to a legally binding contract to purchase this item if you win.
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            {auctionStatus === 'scheduled' ? (
              <div>
                <Clock className="h-8 w-8 text-gold mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Auction hasn&apos;t started yet</p>
                <p className="text-sm text-gray-500 mt-1">Bidding will open when the auction goes live</p>
              </div>
            ) : (
              <div>
                <Gavel className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">
                  {lot.status === 'sold' ? `Sold for ${formatCurrency(lot.winningBid || lot.currentBid)}` : 'Auction has ended'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent bids */}
      {recentBids.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Activity</h4>
          <div className="space-y-1.5">
            {recentBids.map((bid, i) => (
              <div key={i} className="flex items-center justify-between text-sm animate-slide-up">
                <span className="text-gray-600">Bidder ***{bid.bidderName?.slice(-3) || '***'}</span>
                <span className="font-semibold">{formatCurrency(bid.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-slide-up">
            <h3 className="text-xl font-heading font-bold text-dark mb-2">Confirm Your Bid</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Bid Amount</span>
                <span className="font-bold text-lg">{formatCurrency(parseFloat(bidAmount))}</span>
              </div>
              {showAutoBid && maxAutoBid && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Max Auto-Bid</span>
                  <span className="font-medium">{formatCurrency(parseFloat(maxAutoBid))}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Lot</span>
                <span>{lot.title}</span>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                This bid is a legally binding commitment. A buyer&apos;s premium will be added to the hammer price.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmation(false)} className="btn-outline flex-1 !py-2.5">Cancel</button>
              <button onClick={confirmBid} disabled={isSubmitting} className="btn-primary flex-1 !py-2.5">
                {isSubmitting ? 'Placing...' : 'Confirm Bid'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
