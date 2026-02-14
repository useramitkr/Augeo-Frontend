'use client';
import { useState, useEffect } from 'react';
import { clientAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { BarChart3, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

export default function ClientReportsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { clientAPI.getReports().then(res => setData(res.data.data)).catch(() => {}).finally(() => setIsLoading(false)); }, []);

  if (isLoading) return <PageLoader />;
  const stats = data?.totalStats || {};
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-dark mb-6">Reports & Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold text-dark mt-1">{formatCurrency(stats.totalRevenue || 0)}</p></div><DollarSign className="h-8 w-8 text-gold" /></div></div>
        <div className="card p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold text-dark mt-1">{stats.totalOrders || 0}</p></div><ShoppingBag className="h-8 w-8 text-blue-500" /></div></div>
        <div className="card p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Avg Order Value</p><p className="text-2xl font-bold text-dark mt-1">{formatCurrency(stats.avgOrderValue || 0)}</p></div><TrendingUp className="h-8 w-8 text-green-500" /></div></div>
      </div>

      {data?.revenueByAuction?.length > 0 && (
        <div className="card p-6 mb-6">
          <h3 className="font-heading font-semibold mb-4">Revenue by Auction</h3>
          <table className="w-full"><thead><tr className="table-header"><th className="px-4 py-2">Auction</th><th className="px-4 py-2">Orders</th><th className="px-4 py-2">Revenue</th></tr></thead><tbody>
            {data.revenueByAuction.map((r: any, i: number) => (
              <tr key={i} className="border-t border-gray-50"><td className="px-4 py-2.5 text-sm">{r.auctionTitle}</td><td className="px-4 py-2.5 text-sm">{r.orders}</td><td className="px-4 py-2.5 text-sm font-bold">{formatCurrency(r.revenue)}</td></tr>
            ))}
          </tbody></table>
        </div>
      )}

      {data?.auctionPerformance?.length > 0 && (
        <div className="card p-6">
          <h3 className="font-heading font-semibold mb-4">Auction Performance</h3>
          <table className="w-full"><thead><tr className="table-header"><th className="px-4 py-2">Auction</th><th className="px-4 py-2">Lots</th><th className="px-4 py-2">Bids</th><th className="px-4 py-2">Revenue</th></tr></thead><tbody>
            {data.auctionPerformance.map((a: any) => (
              <tr key={a._id} className="border-t border-gray-50"><td className="px-4 py-2.5 text-sm">{a.title}</td><td className="px-4 py-2.5 text-sm">{a.totalLots}</td><td className="px-4 py-2.5 text-sm">{a.totalBids}</td><td className="px-4 py-2.5 text-sm font-bold">{formatCurrency(a.totalRevenue)}</td></tr>
            ))}
          </tbody></table>
        </div>
      )}
    </div>
  );
}