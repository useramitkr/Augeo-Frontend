'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNotificationStore } from '@/store/notificationStore';
import { timeAgo } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Bell, Check, CheckCheck, Gavel, DollarSign, Truck, AlertTriangle, Trophy } from 'lucide-react';

const typeIcons: Record<string, any> = { outbid: AlertTriangle, auction_won: Trophy, bid_placed: Gavel, payment_confirmed: DollarSign, shipment_dispatched: Truck };

export default function NotificationsPage() {
  const { notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  if (isLoading) return <PageLoader />;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-dark">Notifications</h1>
        {notifications.some(n => !n.isRead) && <button onClick={markAllAsRead} className="text-sm text-gold flex items-center gap-1 hover:text-gold-dark"><CheckCheck className="h-4 w-4" /> Mark all as read</button>}
      </div>
      {notifications.length === 0 ? (
        <div className="text-center py-16 card"><Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No notifications</p></div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <div key={n._id} className={`card p-4 flex gap-4 items-start transition-all ${!n.isRead ? 'bg-gold/5 border-l-4 border-l-gold' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.priority === 'high' || n.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-gold/10 text-gold'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-sm ${!n.isRead ? 'font-semibold text-dark' : 'font-medium text-gray-700'}`}>{n.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                    </div>
                    {!n.isRead && <button onClick={() => markAsRead(n._id)} className="text-gray-400 hover:text-gold"><Check className="h-4 w-4" /></button>}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">{timeAgo(n.createdAt)}</span>
                    {n.actionUrl && <Link href={n.actionUrl} className="text-xs text-gold hover:underline">View Details</Link>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}