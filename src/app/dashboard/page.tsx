'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { bidAPI, orderAPI, notificationAPI } from '@/lib/api';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { Gavel, Heart, Trophy, DollarSign, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ activeBids: 0, wonAuctions: 0, totalSpent: 0 });
  const [recentBids, setRecentBids] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    bidAPI.getMyBids({ limit: 5 }).then(res => {
      const bids = res.data.data || [];
      setRecentBids(bids);
      setStats(prev => ({
        ...prev,
        activeBids: bids.filter((b: any) => ['active', 'winning'].includes(b.status)).length,
        wonAuctions: bids.filter((b: any) => b.status === 'won').length,
      }));
    }).catch(() => {});
    orderAPI.getMyOrders({ limit: 5 }).then(res => {
      const orders = res.data.data || [];
      setStats(prev => ({ ...prev, totalSpent: orders.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0) }));
    }).catch(() => {});
    notificationAPI.getAll({ limit: 5 }).then(res => setNotifications(res.data.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-dark mb-6">Welcome back, {user?.firstName}!</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Bids', value: stats.activeBids, icon: Gavel, color: 'text-blue-600 bg-blue-100' },
          { label: 'Won Auctions', value: stats.wonAuctions, icon: Trophy, color: 'text-green-600 bg-green-100' },
          { label: 'Total Spent', value: formatCurrency(stats.totalSpent), icon: DollarSign, color: 'text-gold bg-gold/10' },
          { label: 'Watching', value: '-', icon: Heart, color: 'text-red-500 bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-500">{stat.label}</p><p className="text-2xl font-bold text-dark mt-1">{stat.value}</p></div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}><stat.icon className="h-6 w-6" /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bids */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-dark">Recent Bids</h3>
            <Link href="/dashboard/bids" className="text-gold text-sm font-medium flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
          </div>
          {recentBids.length > 0 ? (
            <div className="space-y-3">{recentBids.map((bid: any) => (
              <div key={bid._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div><p className="text-sm font-medium">{bid.lot?.title || 'Lot'}</p><p className="text-xs text-gray-500">{bid.auction?.title}</p></div>
                <div className="text-right"><p className="text-sm font-bold">{formatCurrency(bid.amount)}</p><span className={`text-xs px-2 py-0.5 rounded-full ${bid.status === 'winning' ? 'bg-green-100 text-green-700' : bid.status === 'outbid' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{bid.status}</span></div>
              </div>
            ))}</div>
          ) : (<p className="text-gray-400 text-sm">No bids yet</p>)}
        </div>

        {/* Recent Notifications */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-dark">Notifications</h3>
            <Link href="/dashboard/notifications" className="text-gold text-sm font-medium flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
          </div>
          {notifications.length > 0 ? (
            <div className="space-y-3">{notifications.map((n: any) => (
              <div key={n._id} className={`py-2 border-b border-gray-50 last:border-0 ${!n.isRead ? 'bg-gold/5 -mx-2 px-2 rounded' : ''}`}>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.message.substring(0, 80)}...</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
            ))}</div>
          ) : (<p className="text-gray-400 text-sm">No notifications</p>)}
        </div>
      </div>
    </div>
  );
}