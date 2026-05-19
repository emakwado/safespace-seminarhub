import { z } from 'zod';

export const createRegistrationSchema = z.object({
  body: z.object({
    seminarId: z.string().uuid('Invalid seminar ID'),
    notes: z.string().max(1000).optional(),
  }),
});

export const updateRegistrationSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid registration ID'),
  }),
  body: z.object({
    status: z.enum(['pending', 'approved', 'rejected', 'cancelled', 'waitlist']),
  }),
});

export const registrationIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid registration ID'),
  }),
});

export const registrationQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(Number).default('1'),
    limit: z.string().optional().transform(Number).default('10'),
    seminarId: z.string().uuid().optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'cancelled', 'waitlist']).optional(),
    userId: z.string().uuid().optional(),
  }),
});

export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>['body'];
export type UpdateRegistrationInput = z.infer<typeof updateRegistrationSchema>['body'];
