import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendation.service';
import { asyncHandler } from '../middleware/errorHandler';
import {
  createRecommendationSchema,
  referralStatsSchema,
} from '../validators/recommendation.validator';
import { validate } from '../middleware/validation';

export const recommendationController = {
  create: [
    validate(createRecommendationSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await RecommendationService.create({
        referrerId: req.user!.id,
        ...req.body,
      });
      res.status(201).json({ success: true, data: result });
    }),
  ],

  trackClick: [
    asyncHandler(async (req: Request, res: Response) => {
      const result = await RecommendationService.trackClick(req.params.code);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  findAll: [
    asyncHandler(async (req: Request, res: Response) => {
      const result = await RecommendationService.findAll({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        seminarId: req.query.seminarId as string,
      });
      res.status(200).json({ success: true, data: result });
    }),
  ],

  getStats: [
    validate(referralStatsSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await RecommendationService.getStats({
        seminarId: req.query.seminarId as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      });
      res.status(200).json({ success: true, data: result });
    }),
  ],

  getMyRecommendations: [
    asyncHandler(async (req: Request, res: Response) => {
      const result = await RecommendationService.getUserRecommendations(req.user!.id);
      res.status(200).json({ success: true, data: result });
    }),
  ],
};
