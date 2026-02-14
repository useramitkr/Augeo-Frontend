'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { orderAPI } from '@/lib/api';
import { formatCurrency, formatDate, getOrderStatusColor } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders({ limit: 50 }).then(res => setOrders(res.data.data || [])).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <PageLoader />;
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-dark mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 card"><Package className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No orders yet</p></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="table-header"><th className="px-4 py-3">Order</th><th className="px-4 py-3">Item</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Shipping</th><th className="px-4 py-3">Date</th><th className="px-4 py-3"></th></tr></thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order._id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-sm">{order.lot?.title || 'Item'}</td>
                    <td className="px-4 py-3 text-sm font-bold">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getOrderStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getOrderStatusColor(order.shippingStatus)}`}>{order.shippingStatus}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/orders/${order._id}`} className="text-gold text-sm hover:underline">View</Link>
                      {order.paymentStatus === 'pending' && <Link href={`/checkout/${order._id}`} className="text-gold text-sm hover:underline ml-3">Pay</Link>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}