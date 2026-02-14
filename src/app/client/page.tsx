'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clientAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Gavel, Layers, DollarSign, Package, Plus, ArrowRight } from 'lucide-react';

export default function ClientDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { clientAPI.getDashboard().then(res => setData(res.data.data)).catch(() => {}).finally(() => setIsLoading(false)); }, []);

  if (isLoading) return <PageLoader />;
  const stats = data?.stats || {};
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-dark">Client Dashboard</h1>
        <Link href="/client/auctions/new" className="btn-primary text-sm !py-2.5 gap-2"><Plus className="h-4 w-4" /> New Auction</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Auctions', value: stats.totalAuctions || 0, icon: Gavel, color: 'text-blue-600 bg-blue-100' },
          { label: 'Active Lots', value: stats.activeLots || 0, icon: Layers, color: 'text-green-600 bg-green-100' },
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue || 0), icon: DollarSign, color: 'text-gold bg-gold/10' },
          { label: 'Pending Orders', value: stats.pendingOrders || 0, icon: Package, color: 'text-purple-600 bg-purple-100' },
        ].map((s, i) => (
          <div key={i} className="card p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">{s.label}</p><p className="text-2xl font-bold text-dark mt-1">{s.value}</p></div><div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="h-6 w-6" /></div></div></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4"><h3 className="font-heading font-semibold">Recent Auctions</h3><Link href="/client/auctions" className="text-gold text-sm flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link></div>
          {data?.recentAuctions?.length > 0 ? data.recentAuctions.map((a: any) => (
            <div key={a._id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div><p className="text-sm font-medium">{a.title}</p><span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'live' ? 'bg-green-100 text-green-700' : a.status === 'ended' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>{a.status}</span></div>
              <span className="text-sm font-medium">{a.totalLots} lots</span>
            </div>
          )) : <p className="text-sm text-gray-400">No auctions yet</p>}
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4"><h3 className="font-heading font-semibold">Recent Orders</h3><Link href="/client/orders" className="text-gold text-sm flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link></div>
          {data?.recentOrders?.length > 0 ? data.recentOrders.map((o: any) => (
            <div key={o._id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div><p className="text-sm font-medium">{o.lot?.title || o.orderNumber}</p><p className="text-xs text-gray-500">{o.buyer?.firstName} {o.buyer?.lastName}</p></div>
              <span className="text-sm font-bold">{formatCurrency(o.totalAmount)}</span>
            </div>
          )) : <p className="text-sm text-gray-400">No orders yet</p>}
        </div>
      </div>
    </div>
  );
}