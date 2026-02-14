'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { BarChart3, TrendingUp, Users, Gavel, Package, Download } from 'lucide-react';

export default function AdminReportsPage() {
  const [revenueReport, setRevenueReport] = useState<any>(null);
  const [auctionReport, setAuctionReport] = useState<any>(null);
  const [userReport, setUserReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (dateRange.startDate) params.startDate = dateRange.startDate;
        if (dateRange.endDate) params.endDate = dateRange.endDate;
        const [rev, auc, usr] = await Promise.all([
          adminAPI.getRevenueReport(params),
          adminAPI.getAuctionReport(params),
          adminAPI.getUserReport(params),
        ]);
        setRevenueReport(rev.data.data);
        setAuctionReport(auc.data.data);
        setUserReport(usr.data.data);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, []);

  const fetchWithDates = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      const [rev, auc, usr] = await Promise.all([
        adminAPI.getRevenueReport(params),
        adminAPI.getAuctionReport(params),
        adminAPI.getUserReport(params),
      ]);
      setRevenueReport(rev.data.data);
      setAuctionReport(auc.data.data);
      setUserReport(usr.data.data);
    } catch { } finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-dark flex items-center gap-2"><BarChart3 className="h-6 w-6 text-gold" /> Reports & Analytics</h1>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row items-end gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
            <input type="date" value={dateRange.startDate} onChange={e => setDateRange({ ...dateRange, startDate: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">End Date</label>
            <input type="date" value={dateRange.endDate} onChange={e => setDateRange({ ...dateRange, endDate: e.target.value })} className="input-field" />
          </div>
          <button onClick={fetchWithDates} className="btn-primary !py-2.5">Apply Filter</button>
        </div>
      </div>

      {/* Revenue Report */}
      <div className="card p-6">
        <h3 className="font-heading font-semibold text-dark mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-gold" /> Revenue Report</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600">Total Revenue</p>
            <p className="text-xl font-bold text-green-700">{formatCurrency(revenueReport?.totalRevenue || 0)}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600">Total Orders</p>
            <p className="text-xl font-bold text-blue-700">{revenueReport?.totalOrders || 0}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600">Avg Order Value</p>
            <p className="text-xl font-bold text-purple-700">{formatCurrency(revenueReport?.averageOrderValue || 0)}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-orange-600">Commission Earned</p>
            <p className="text-xl font-bold text-orange-700">{formatCurrency(revenueReport?.totalCommission || 0)}</p>
          </div>
        </div>
        {revenueReport?.byMonth && revenueReport.byMonth.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Month</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Revenue</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Orders</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Avg Value</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {revenueReport.byMonth.map((m: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{m._id?.month}/{m._id?.year}</td>
                    <td className="px-4 py-2 font-semibold">{formatCurrency(m.revenue)}</td>
                    <td className="px-4 py-2">{m.count}</td>
                    <td className="px-4 py-2">{formatCurrency(m.revenue / (m.count || 1))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Auction Report */}
      <div className="card p-6">
        <h3 className="font-heading font-semibold text-dark mb-4 flex items-center gap-2"><Gavel className="h-5 w-5 text-gold" /> Auction Report</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600">Total Auctions</p>
            <p className="text-xl font-bold text-green-700">{auctionReport?.totalAuctions || 0}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600">Live</p>
            <p className="text-xl font-bold text-blue-700">{auctionReport?.liveAuctions || 0}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600">Completed</p>
            <p className="text-xl font-bold text-purple-700">{auctionReport?.completedAuctions || 0}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-orange-600">Total Bids</p>
            <p className="text-xl font-bold text-orange-700">{auctionReport?.totalBids || 0}</p>
          </div>
        </div>
        {auctionReport?.topAuctions && auctionReport.topAuctions.length > 0 && (
          <div className="overflow-x-auto">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Top Auctions by Revenue</h4>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Auction</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Revenue</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Lots Sold</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {auctionReport.topAuctions.map((a: any) => (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{a.title}</td>
                    <td className="px-4 py-2 font-semibold">{formatCurrency(a.revenue || 0)}</td>
                    <td className="px-4 py-2">{a.lotsSold || 0}</td>
                    <td className="px-4 py-2"><span className="text-xs px-2 py-1 rounded-full bg-gray-100">{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Report */}
      <div className="card p-6">
        <h3 className="font-heading font-semibold text-dark mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-gold" /> User Report</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600">Total Users</p>
            <p className="text-xl font-bold text-green-700">{userReport?.totalUsers || 0}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600">New (This Month)</p>
            <p className="text-xl font-bold text-blue-700">{userReport?.newThisMonth || 0}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600">Active Bidders</p>
            <p className="text-xl font-bold text-purple-700">{userReport?.activeBidders || 0}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-orange-600">KYC Verified</p>
            <p className="text-xl font-bold text-orange-700">{userReport?.kycVerified || 0}</p>
          </div>
        </div>
        {userReport?.byRole && userReport.byRole.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Users by Role</h4>
            <div className="flex gap-4">
              {userReport.byRole.map((r: any) => (
                <div key={r._id} className="bg-gray-50 rounded-lg px-4 py-3 text-center">
                  <p className="text-lg font-bold">{r.count}</p>
                  <p className="text-xs text-gray-500 capitalize">{r._id}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}