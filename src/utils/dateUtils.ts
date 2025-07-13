import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, addDays, addHours, isBefore, isAfter } from 'date-fns';
import { de } from 'date-fns/locale';

export const formatEventDate = (date: Date): string => {
  if (isToday(date)) {
    return `Heute, ${format(date, 'HH:mm')}`;
  }
  if (isTomorrow(date)) {
    return `Morgen, ${format(date, 'HH:mm')}`;
  }
  if (isYesterday(date)) {
    return `Gestern, ${format(date, 'HH:mm')}`;
  }
  return format(date, 'dd.MM.yyyy, HH:mm', { locale: de });
};

export const formatCountdown = (targetDate: Date): string => {
  const now = new Date();
  const distance = targetDate.getTime() - now.getTime();
  
  if (distance < 0) {
    return 'Event beendet';
  }
  
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const getEventStatus = (event: { startDate: Date; endDate: Date }): 'upcoming' | 'active' | 'ended' => {
  const now = new Date();
  
  if (isBefore(now, event.startDate)) {
    return 'upcoming';
  } else if (isAfter(now, event.endDate)) {
    return 'ended';
  } else {
    return 'active';
  }
};

export const getReminderDate = (eventDate: Date, reminderType: string): Date => {
  switch (reminderType) {
    case '1_day_before':
      return addDays(eventDate, -1);
    case '1_hour_before':
      return addHours(eventDate, -1);
    case 'at_start':
      return eventDate;
    case 'at_end':
      return eventDate; // This will be the end date
    default:
      return addHours(eventDate, -1);
  }
};

export const isEventInDateRange = (event: { startDate: Date; endDate: Date }, start: Date, end: Date): boolean => {
  return (
    (event.startDate >= start && event.startDate <= end) ||
    (event.endDate >= start && event.endDate <= end) ||
    (event.startDate <= start && event.endDate >= end)
  );
};

export const getMonthDays = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];
  
  // Add days from previous month to fill first week
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }
  
  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add days from next month to fill last week
  const lastDayOfWeek = lastDay.getDay();
  for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
};