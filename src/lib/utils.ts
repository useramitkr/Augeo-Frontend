import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns';

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getCountdown(endTime: string | Date): { days: number; hours: number; minutes: number; seconds: number } | null {
  const diff = differenceInSeconds(new Date(endTime), new Date());
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
  };
}

export function getAuctionStatusColor(status: string): string {
  switch (status) {
    case 'live': return 'bg-green-500';
    case 'scheduled': return 'bg-blue-500';
    case 'ended': return 'bg-gray-500';
    case 'cancelled': return 'bg-red-500';
    case 'paused': return 'bg-yellow-500';
    case 'draft': return 'bg-gray-400';
    default: return 'bg-gray-500';
  }
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'confirmed': return 'text-blue-600 bg-blue-100';
    case 'processing': return 'text-indigo-600 bg-indigo-100';
    case 'shipped': return 'text-purple-600 bg-purple-100';
    case 'delivered': return 'text-green-600 bg-green-100';
    case 'completed': return 'text-green-700 bg-green-200';
    case 'cancelled': return 'text-red-600 bg-red-100';
    case 'disputed': return 'text-orange-600 bg-orange-100';
    case 'refunded': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getMinimumBid(currentBid: number, startingBid: number, bidIncrement: number): number {
  if (currentBid === 0) return startingBid;
  return currentBid + bidIncrement;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
