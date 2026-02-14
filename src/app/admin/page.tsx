'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Users, Gavel, Package, DollarSign, TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminAPI.getDashboard();
        setStats(res.data.data);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Auctions', value: stats?.activeAuctions || 0, icon: Gavel, color: 'bg-green-500' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: Package, color: 'bg-purple-500' },
    { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'bg-gold' },
    { label: 'Pending KYC', value: stats?.pendingKyc || 0, icon: AlertTriangle, color: 'bg-orange-500' },
    { label: 'Pending Clients', value: stats?.pendingClients || 0, icon: Clock, color: 'bg-red-500' },
    { label: 'Completed Auctions', value: stats?.completedAuctions || 0, icon: CheckCircle, color: 'bg-teal-500' },
    { label: 'Monthly Revenue', value: formatCurrency(stats?.monthlyRevenue || 0), icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-dark">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-dark mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-dark mb-4">Recent Users</h3>
          <div className="space-y-3">
            {(stats?.recentUsers || []).map((u: any) => (
              <div key={u._id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'client' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
              </div>
            ))}
            {(!stats?.recentUsers || stats.recentUsers.length === 0) && <p className="text-sm text-gray-500">No recent users</p>}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-heading font-semibold text-dark mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {(stats?.recentOrders || []).map((o: any) => (
              <div key={o._id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{o.orderNumber}</p>
                  <p className="text-xs text-gray-500">{o.lot?.title || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatCurrency(o.totalAmount)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.paymentStatus}</span>
                </div>
              </div>
            ))}
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && <p className="text-sm text-gray-500">No recent orders</p>}
          </div>
        </div>
      </div>
    </div>
  );
}