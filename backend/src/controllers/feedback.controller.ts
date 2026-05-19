import { Request, Response } from 'express';
import { FeedbackService } from '../services/feedback.service';
import { asyncHandler } from '../middleware/errorHandler';
import {
  createFeedbackSchema,
  feedbackQuerySchema,
  updateFeedbackSchema,
} from '../validators/feedback.validator';
import { validate } from '../middleware/validation';

export const feedbackController = {
  create: [
    validate(createFeedbackSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await FeedbackService.create({
        userId: req.user?.id,
        ...req.body,
      });
      res.status(201).json({ success: true, data: result });
    }),
  ],

  findAll: [
    validate(feedbackQuerySchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await FeedbackService.findAll({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        seminarId: req.query.seminarId as string,
        type: req.query.type as string,
        isResolved: req.query.isResolved !== undefined ? req.query.isResolved === 'true' : undefined,
        sortBy: (req.query.sortBy as string) || 'createdAt',
        sortOrder: (req.query.sortOrder as string) || 'desc',
      });
      res.status(200).json({ success: true, data: result });
    }),
  ],

  findById: [
    asyncHandler(async (req: Request, res: Response) => {
      const result = await FeedbackService.findById(req.params.id);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  update: [
    validate(updateFeedbackSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await FeedbackService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  getSeminarFeedback: [
    asyncHandler(async (req: Request, res: Response) => {
      const result = await FeedbackService.getSeminarFeedback(req.params.seminarId);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  getStats: [
    asyncHandler(async (_req: Request, res: Response) => {
      const result = await FeedbackService.getFeedbackStats();
      res.status(200).json({ success: true, data: result });
    }),
  ],
};
