import { z } from 'zod';

export const checkInSchema = z.object({
  body: z.object({
    ticketNumber: z.string().min(1, 'Ticket number is required'),
    deviceId: z.string().optional(),
    location: z.string().optional(),
  }),
});

export const checkOutSchema = z.object({
  body: z.object({
    ticketNumber: z.string().min(1, 'Ticket number is required'),
  }),
});

export const attendanceStatsSchema = z.object({
  query: z.object({
    seminarId: z.string().uuid('Invalid seminar ID').optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export type CheckInInput = z.infer<typeof checkInSchema>['body'];
export type CheckOutInput = z.infer<typeof checkOutSchema>['body'];
