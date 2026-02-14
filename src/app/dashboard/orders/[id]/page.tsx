'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { orderAPI } from '@/lib/api';
import { formatCurrency, formatDate, getOrderStatusColor } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Package, Truck, CreditCard, FileText, MapPin, CheckCircle } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(params.id as string).then(res => setOrder(res.data.data)).catch(() => {}).finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) return <PageLoader />;
  if (!order) return <div className="text-center py-16"><p className="text-gray-500">Order not found</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-dark">Order {order.orderNumber}</h1>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${getOrderStatusColor(order.status)}`}>{order.status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice */}
          <div className="card p-6">
            <h3 className="font-heading font-semibold flex items-center gap-2 mb-4"><FileText className="h-5 w-5 text-gold" /> Invoice</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2"><span className="text-gray-500">Hammer Price</span><span className="font-medium">{formatCurrency(order.hammerPrice)}</span></div>
              <div className="flex justify-between py-2"><span className="text-gray-500">Buyer&apos;s Premium ({order.buyersPremiumRate}%)</span><span className="font-medium">{formatCurrency(order.buyersPremium)}</span></div>
              {order.tax > 0 && <div className="flex justify-between py-2"><span className="text-gray-500">Tax</span><span>{formatCurrency(order.tax)}</span></div>}
              {order.shippingCost > 0 && <div className="flex justify-between py-2"><span className="text-gray-500">Shipping</span><span>{formatCurrency(order.shippingCost)}</span></div>}
              <div className="flex justify-between py-3 border-t-2 text-base font-bold"><span>Total</span><span className="text-gold">{formatCurrency(order.totalAmount)}</span></div>
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-6">
            <h3 className="font-heading font-semibold flex items-center gap-2 mb-4"><Truck className="h-5 w-5 text-gold" /> Shipping</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getOrderStatusColor(order.shippingStatus)}`}>{order.shippingStatus}</span>
            </div>
            {order.trackingNumber && <p className="text-sm"><span className="text-gray-500">Tracking:</span> <span className="font-medium">{order.trackingNumber}</span></p>}
            {order.shippingAddress && (
              <div className="mt-3 flex items-start gap-2"><MapPin className="h-4 w-4 text-gray-400 mt-0.5" /><p className="text-sm text-gray-600">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p></div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-heading font-semibold flex items-center gap-2 mb-4"><CreditCard className="h-5 w-5 text-gold" /> Payment</h3>
            <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${getOrderStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
            {order.paymentStatus === 'paid' && order.paidAt && <p className="text-xs text-gray-500 mt-2">Paid on {formatDate(order.paidAt)}</p>}
            {order.paymentStatus === 'pending' && <Link href={`/checkout/${order._id}`} className="btn-primary w-full mt-4 text-sm">Complete Payment</Link>}
          </div>

          <div className="card p-6">
            <h3 className="font-heading font-semibold mb-3">Item</h3>
            <p className="text-sm font-medium">{order.lot?.title || 'Lot Item'}</p>
            {order.auction && <p className="text-xs text-gray-500 mt-1">{order.auction.title}</p>}
          </div>

          <div className="card p-6">
            <h3 className="font-heading font-semibold mb-3">Need Help?</h3>
            <Link href="/dashboard/settings" className="text-gold text-sm hover:underline">Submit a Support Ticket</Link>
          </div>
        </div>
      </div>
    </div>
  );
}