import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { BookingStatus } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Determines if a provider should see the full address for a booking.
 * 
 * Address is only shown after payment is confirmed (PAID status or later).
 * This prevents providers from seeing customer addresses before the booking is paid.
 * 
 * @param status - The booking status from Prisma
 * @returns true if full address should be visible, false if masked
 * 
 * @example
 * // Returns false - address is masked
 * shouldShowFullAddressToProvider("REQUESTED")
 * shouldShowFullAddressToProvider("NEEDS_PAYMENT")
 * 
 * // Returns true - address is visible
 * shouldShowFullAddressToProvider("PAID")
 * shouldShowFullAddressToProvider("IN_PROGRESS")
 */
export function shouldShowFullAddressToProvider(status: BookingStatus | string): boolean {
  const paidStatuses: BookingStatus[] = [
    'PAID',
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
  ]
  
  return paidStatuses.includes(status as BookingStatus)
}
