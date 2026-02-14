'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endTime: string;
  variant?: 'default' | 'compact' | 'large';
  showLabel?: boolean;
}

export default function CountdownTimer({ endTime, variant = 'default', showLabel = true }: CountdownTimerProps) {
  const countdown = useCountdown(endTime);

  if (!countdown) {
    return (
      <div className="text-red-600 font-semibold text-sm flex items-center gap-1">
        <Clock className="h-4 w-4" /> Ended
      </div>
    );
  }

  const isUrgent = countdown.days === 0 && countdown.hours < 1;

  if (variant === 'compact') {
    return (
      <div className={cn('text-sm font-mono font-semibold', isUrgent ? 'text-red-600 countdown-urgent' : 'text-gray-700')}>
        {countdown.days > 0 && `${countdown.days}d `}
        {String(countdown.hours).padStart(2, '0')}:
        {String(countdown.minutes).padStart(2, '0')}:
        {String(countdown.seconds).padStart(2, '0')}
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className={cn('flex items-center gap-3', isUrgent && 'countdown-urgent')}>
        {countdown.days > 0 && (
          <div className="text-center">
            <div className="bg-dark text-white text-2xl font-bold rounded-lg w-16 h-16 flex items-center justify-center">{countdown.days}</div>
            <div className="text-xs text-gray-500 mt-1">Days</div>
          </div>
        )}
        <div className="text-center">
          <div className={cn('text-2xl font-bold rounded-lg w-16 h-16 flex items-center justify-center', isUrgent ? 'bg-red-600 text-white' : 'bg-dark text-white')}>
            {String(countdown.hours).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 mt-1">Hours</div>
        </div>
        <span className="text-2xl font-bold text-dark self-start mt-3">:</span>
        <div className="text-center">
          <div className={cn('text-2xl font-bold rounded-lg w-16 h-16 flex items-center justify-center', isUrgent ? 'bg-red-600 text-white' : 'bg-dark text-white')}>
            {String(countdown.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 mt-1">Mins</div>
        </div>
        <span className="text-2xl font-bold text-dark self-start mt-3">:</span>
        <div className="text-center">
          <div className={cn('text-2xl font-bold rounded-lg w-16 h-16 flex items-center justify-center', isUrgent ? 'bg-red-600 text-white' : 'bg-dark text-white')}>
            {String(countdown.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 mt-1">Secs</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1.5', isUrgent && 'countdown-urgent')}>
      <Clock className={cn('h-4 w-4', isUrgent ? 'text-red-600' : 'text-gold')} />
      {showLabel && <span className="text-xs text-gray-500">Ends in:</span>}
      <span className={cn('text-sm font-semibold font-mono', isUrgent ? 'text-red-600' : 'text-dark')}>
        {countdown.days > 0 && `${countdown.days}d `}
        {String(countdown.hours).padStart(2, '0')}h{' '}
        {String(countdown.minutes).padStart(2, '0')}m{' '}
        {String(countdown.seconds).padStart(2, '0')}s
      </span>
    </div>
  );
}
