import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  
  // Add previous month's days
  for (let i = 0; i < firstDay.getDay(); i++) {
    const date = new Date(year, month, -i);
    days.unshift({ date, isCurrentMonth: false });
  }
  
  // Add current month's days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({ date, isCurrentMonth: true });
  }
  
  // Add next month's days
  const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({ date, isCurrentMonth: false });
  }
  
  return days;
}