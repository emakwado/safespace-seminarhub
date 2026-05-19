import { z } from 'zod';

export const createFeedbackSchema = z.object({
  body: z.object({
    seminarId: z.string().uuid('Invalid seminar ID'),
    type: z.enum(['seminar_rating', 'speaker_rating', 'general_feedback', 'anonymous_report', 'suggestion']),
    rating: z.number().int().min(1).max(5).optional(),
    content: z.string().min(1, 'Content is required').max(5000),
    isAnonymous: z.boolean().default(true),
    isReport: z.boolean().default(false),
    speakerName: z.string().optional(),
  }),
});

export const feedbackQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(Number).default('1'),
    limit: z.string().optional().transform(Number).default('10'),
    seminarId: z.string().uuid().optional(),
    type: z.string().optional(),
    isResolved: z.string().optional().transform((val) => val === 'true'),
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.string().optional().default('desc'),
  }),
});

export const updateFeedbackSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid feedback ID'),
  }),
  body: z.object({
    isResolved: z.boolean(),
    adminResponse: z.string().max(2000).optional(),
  }),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>['body'];
export type UpdateFeedbackInput = z.infer<typeof updateFeedbackSchema>['body'];
