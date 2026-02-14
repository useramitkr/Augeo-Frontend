'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Search, ChevronLeft, ChevronRight, Eye, RefreshCw, DollarSign } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (paymentFilter) params.paymentStatus = paymentFilter;
      const res = await adminAPI.getOrders(params);
      setOrders(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter, paymentFilter]);

  const handleRefund = async (id: string) => {
    const reason = prompt('Enter refund reason:');
    if (!reason) return;
    try {
      await adminAPI.refundOrder(id, { reason });
      toast.success('Refund processed');
      fetchOrders();
      setSelectedOrder(null);
    } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handlePayout = async (id: string) => {
    if (!confirm('Process payout to client?')) return;
    try {
      await adminAPI.payoutOrder(id);
      toast.success('Payout processed');
      fetchOrders();
      setSelectedOrder(null);
    } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-dark">Order Management</h1>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field w-40">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="disputed">Disputed</option>
          </select>
          <select value={paymentFilter} onChange={e => { setPaymentFilter(e.target.value); setPage(1); }} className="input-field w-40">
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Order #</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Buyer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Item</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Payment</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Shipping</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{order.buyer?.firstName} {order.buyer?.lastName}</td>
                    <td className="px-4 py-3">
                      <p className="truncate max-w-[200px]">{order.lot?.title || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        order.paymentStatus === 'refunded' ? 'bg-red-100 text-red-700' :
                        order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{order.paymentStatus}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.shippingStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.shippingStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{order.shippingStatus || 'pending'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedOrder(order)} className="p-1.5 hover:bg-gray-100 rounded" title="Details"><Eye className="h-4 w-4" /></button>
                        {order.paymentStatus === 'paid' && !order.commission?.payoutStatus && (
                          <button onClick={() => handlePayout(order._id)} className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Payout"><DollarSign className="h-4 w-4" /></button>
                        )}
                        {order.paymentStatus === 'paid' && (
                          <button onClick={() => handleRefund(order._id)} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Refund"><RefreshCw className="h-4 w-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p className="text-center py-8 text-gray-500">No orders found</p>}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
          <span className="px-4 py-2 text-sm">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-heading font-bold mb-4">Order {selectedOrder.orderNumber}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Buyer:</span><p className="font-medium">{selectedOrder.buyer?.firstName} {selectedOrder.buyer?.lastName}</p></div>
              <div><span className="text-gray-500">Item:</span><p className="font-medium">{selectedOrder.lot?.title || 'N/A'}</p></div>
              <div><span className="text-gray-500">Hammer Price:</span><p className="font-medium">{formatCurrency(selectedOrder.hammerPrice)}</p></div>
              <div><span className="text-gray-500">Buyer&apos;s Premium:</span><p className="font-medium">{formatCurrency(selectedOrder.buyersPremium)}</p></div>
              <div><span className="text-gray-500">Tax:</span><p className="font-medium">{formatCurrency(selectedOrder.tax)}</p></div>
              <div><span className="text-gray-500">Total:</span><p className="font-bold text-lg">{formatCurrency(selectedOrder.totalAmount)}</p></div>
              <div><span className="text-gray-500">Payment Status:</span><p className="font-medium">{selectedOrder.paymentStatus}</p></div>
              <div><span className="text-gray-500">Shipping Status:</span><p className="font-medium">{selectedOrder.shippingStatus || 'pending'}</p></div>
              {selectedOrder.commission && (
                <>
                  <div><span className="text-gray-500">Commission:</span><p className="font-medium">{formatCurrency(selectedOrder.commission.amount)}</p></div>
                  <div><span className="text-gray-500">Payout:</span><p className="font-medium">{selectedOrder.commission.payoutStatus || 'pending'}</p></div>
                </>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              {selectedOrder.paymentStatus === 'paid' && !selectedOrder.commission?.payoutStatus && (
                <button onClick={() => handlePayout(selectedOrder._id)} className="btn-primary !bg-green-600 !py-2 text-sm">Process Payout</button>
              )}
              {selectedOrder.paymentStatus === 'paid' && (
                <button onClick={() => handleRefund(selectedOrder._id)} className="btn-primary !bg-red-500 !py-2 text-sm">Issue Refund</button>
              )}
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}