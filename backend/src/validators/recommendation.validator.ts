import { z } from 'zod';

export const createRecommendationSchema = z.object({
  body: z.object({
    seminarId: z.string().uuid('Invalid seminar ID'),
    referredEmail: z.string().email('Invalid email address').optional(),
  }),
});

export const referralStatsSchema = z.object({
  query: z.object({
    seminarId: z.string().uuid().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export type CreateRecommendationInput = z.infer<typeof createRecommendationSchema>['body'];
