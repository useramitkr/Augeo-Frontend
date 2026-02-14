'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight, Wallet, PieChart } from 'lucide-react';

export default function AdminFinancialPage() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [dashRes, ordersRes] = await Promise.all([
          adminAPI.getDashboard(),
          adminAPI.getOrders({ limit: 50, paymentStatus: 'paid' }),
        ]);
        setStats(dashRes.data.data);
        setOrders(ordersRes.data.data);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, [period]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
  const totalCommission = orders.reduce((sum: number, o: any) => sum + (o.commission?.amount || 0), 0);
  const totalPayouts = orders.filter((o: any) => o.commission?.payoutStatus === 'paid').reduce((sum: number, o: any) => sum + (o.commission?.payoutAmount || 0), 0);
  const pendingPayouts = orders.filter((o: any) => o.commission?.payoutStatus !== 'paid').reduce((sum: number, o: any) => sum + (o.commission?.payoutAmount || 0), 0);

  const financialCards = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'bg-green-500', change: '+12.5%', up: true },
    { label: 'Platform Commission', value: formatCurrency(totalCommission), icon: PieChart, color: 'bg-blue-500', change: '+8.3%', up: true },
    { label: 'Completed Payouts', value: formatCurrency(totalPayouts), icon: CreditCard, color: 'bg-purple-500', change: '+15.2%', up: true },
    { label: 'Pending Payouts', value: formatCurrency(pendingPayouts), icon: Wallet, color: 'bg-orange-500', change: '-3.1%', up: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-dark">Financial Overview</h1>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="input-field w-40">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialCards.map(card => (
          <div key={card.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`${card.color} p-2.5 rounded-lg`}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${card.up ? 'text-green-600' : 'text-red-500'}`}>
                {card.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-dark">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-dark mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-gold" /> Revenue Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hammer Price Total</span>
              <span className="font-semibold">{formatCurrency(orders.reduce((s: number, o: any) => s + (o.hammerPrice || 0), 0))}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Buyer&apos;s Premium</span>
              <span className="font-semibold">{formatCurrency(orders.reduce((s: number, o: any) => s + (o.buyersPremium || 0), 0))}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tax Collected</span>
              <span className="font-semibold">{formatCurrency(orders.reduce((s: number, o: any) => s + (o.tax || 0), 0))}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Shipping Fees</span>
              <span className="font-semibold">{formatCurrency(orders.reduce((s: number, o: any) => s + (o.shippingCost || 0), 0))}</span>
            </div>
            <div className="border-t pt-3 flex items-center justify-between">
              <span className="font-medium">Total Revenue</span>
              <span className="font-bold text-lg text-gold">{formatCurrency(totalRevenue)}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-heading font-semibold text-dark mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5 text-gold" /> Payout Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Payable to Clients</span>
              <span className="font-semibold">{formatCurrency(totalPayouts + pendingPayouts)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Paid Out</span>
              <span className="font-semibold text-green-600">{formatCurrency(totalPayouts)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="font-semibold text-orange-500">{formatCurrency(pendingPayouts)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Platform Earnings</span>
                <span className="font-bold text-lg text-gold">{formatCurrency(totalCommission)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">After all payouts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-heading font-semibold text-dark mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Buyer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Commission</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Payout</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.slice(0, 15).map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{order.buyer?.firstName} {order.buyer?.lastName}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-4 py-3 text-blue-600">{formatCurrency(order.commission?.amount || 0)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.commission?.payoutStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{order.commission?.payoutStatus || 'pending'}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center py-8 text-gray-500">No transactions found</p>}
        </div>
      </div>
    </div>
  );
}