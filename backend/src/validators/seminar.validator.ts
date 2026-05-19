import { z } from 'zod';

export const createSeminarSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(255),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    shortDescription: z.string().max(500).optional(),
    venue: z.string().min(1, 'Venue is required').max(255),
    venueAddress: z.string().max(255).optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    capacity: z.number().int().min(1, 'Capacity must be at least 1'),
    category: z.enum(['technology', 'business', 'health', 'education', 'arts', 'science', 'other']),
    tags: z.array(z.string()).optional(),
    speakers: z
      .array(
        z.object({
          name: z.string().min(1),
          bio: z.string(),
          avatar: z.string().optional(),
          title: z.string().optional(),
          company: z.string().optional(),
        })
      )
      .optional(),
    isOnline: z.boolean().default(false),
    onlineLink: z.string().url().optional().or(z.literal('')),
    price: z.number().min(0).default(0),
    requiresApproval: z.boolean().default(false),
  }),
});

export const updateSeminarSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid seminar ID'),
  }),
  body: createSeminarSchema.shape.body.partial(),
});

export const seminarIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid seminar ID'),
  }),
});

export const seminarQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(Number).default('1'),
    limit: z.string().optional().transform(Number).default('10'),
    search: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['draft', 'published', 'cancelled', 'completed']).optional(),
    sortBy: z.enum(['createdAt', 'startDate', 'title', 'registeredCount']).optional().default('startDate'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
    upcoming: z.string().optional().transform((val) => val === 'true'),
  }),
});

export type CreateSeminarInput = z.infer<typeof createSeminarSchema>['body'];
export type UpdateSeminarInput = z.infer<typeof updateSeminarSchema>['body'];
