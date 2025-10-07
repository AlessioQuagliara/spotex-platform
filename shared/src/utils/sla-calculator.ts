/**
 * @fileoverview SLA Calculator - Automatic deadline calculation
 * @principle Business Rules - Centralized SLA logic
 */

export type Priority = 'critical' | 'high' | 'medium' | 'low';

/**
 * SLA Response Time by Priority
 * - Critical: 1 hour
 * - High: 2 hours
 * - Medium: 4 hours
 * - Low: 8 hours
 */
const SLA_RESPONSE_HOURS: Record<Priority, number> = {
  critical: 1,
  high: 2,
  medium: 4,
  low: 8,
};

/**
 * SLA Resolution Time by Priority
 * - Critical: 4 hours
 * - High: 8 hours
 * - Medium: 24 hours
 * - Low: 48 hours
 */
const SLA_RESOLUTION_HOURS: Record<Priority, number> = {
  critical: 4,
  high: 8,
  medium: 24,
  low: 48,
};

/**
 * Calculate SLA response deadline based on priority
 */
export function calculateSLAResponseDeadline(priority: string): Date {
  const now = new Date();
  const hours = SLA_RESPONSE_HOURS[priority as Priority] || SLA_RESPONSE_HOURS.medium;
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

/**
 * Calculate SLA resolution deadline based on priority
 */
export function calculateSLAResolutionDeadline(priority: string): Date {
  const now = new Date();
  const hours = SLA_RESOLUTION_HOURS[priority as Priority] || SLA_RESOLUTION_HOURS.medium;
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

/**
 * Check if SLA response is breached
 */
export function isSLAResponseBreached(ticket: any): boolean {
  if (!ticket.slaResponseDeadline) return false;
  if (ticket.resolvedAt) return false; // Already resolved
  return new Date() > new Date(ticket.slaResponseDeadline);
}

/**
 * Check if SLA resolution is breached
 */
export function isSLAResolutionBreached(ticket: any): boolean {
  if (!ticket.slaResolutionDeadline) return false;
  if (ticket.resolvedAt) return false; // Already resolved
  return new Date() > new Date(ticket.slaResolutionDeadline);
}

/**
 * Calculate remaining time for SLA
 */
export function calculateSLATimeRemaining(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  
  if (diff < 0) return 'OVERDUE';
  
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Get escalation level based on SLA breach
 */
export function getEscalationLevel(ticket: any): 'none' | 'warning' | 'critical' {
  if (isSLAResolutionBreached(ticket)) return 'critical';
  if (isSLAResponseBreached(ticket)) return 'warning';
  return 'none';
}
