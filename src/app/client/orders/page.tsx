'use client';
import { useState, useEffect } from 'react';
import { clientAPI } from '@/lib/api';
import { formatCurrency, formatDate, getOrderStatusColor } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Package, Truck } from 'lucide-react';

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingForm, setTrackingForm] = useState<{ id: string; tracking: string } | null>(null);

  useEffect(() => { clientAPI.getOrders().then(res => setOrders(res.data.data || [])).catch(() => {}).finally(() => setIsLoading(false)); }, []);

  const updateShipping = async (orderId: string, status: string, trackingNumber?: string) => {
    try {
      await clientAPI.updateOrderStatus(orderId, { shippingStatus: status, trackingNumber });
      toast.success('Updated');
      setTrackingForm(null);
      const res = await clientAPI.getOrders();
      setOrders(res.data.data || []);
    } catch { toast.error('Failed'); }
  };

  if (isLoading) return <PageLoader />;
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-dark mb-6">Order Management</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 card"><Package className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No orders yet</p></div>
      ) : (
        <div className="card overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="table-header"><th className="px-4 py-3">Order</th><th className="px-4 py-3">Buyer</th><th className="px-4 py-3">Lot</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Shipping</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>
          {orders.map(o => (
            <tr key={o._id} className="border-t border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium">{o.orderNumber}</td>
              <td className="px-4 py-3 text-sm">{o.buyer?.firstName} {o.buyer?.lastName?.charAt(0)}.</td>
              <td className="px-4 py-3 text-sm">{o.lot?.title}</td>
              <td className="px-4 py-3 text-sm font-bold">{formatCurrency(o.totalAmount)}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getOrderStatusColor(o.paymentStatus)}`}>{o.paymentStatus}</span></td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getOrderStatusColor(o.shippingStatus)}`}>{o.shippingStatus}</span></td>
              <td className="px-4 py-3">
                {o.paymentStatus === 'paid' && o.shippingStatus === 'pending' && (
                  trackingForm?.id === o._id ? (
                    <div className="flex gap-1"><input placeholder="Tracking #" value={trackingForm.tracking} onChange={e => setTrackingForm({ ...trackingForm, tracking: e.target.value })} className="input-field !py-1 text-xs w-28" /><button onClick={() => updateShipping(o._id, 'shipped', trackingForm.tracking)} className="text-green-600 text-xs font-medium">Ship</button></div>
                  ) : <button onClick={() => setTrackingForm({ id: o._id, tracking: '' })} className="text-gold text-sm flex items-center gap-1"><Truck className="h-3 w-3" /> Ship</button>
                )}
                {o.shippingStatus === 'shipped' && <button onClick={() => updateShipping(o._id, 'delivered')} className="text-green-600 text-xs font-medium">Mark Delivered</button>}
              </td>
            </tr>
          ))}
        </tbody></table></div></div>
      )}
    </div>
  );
}