import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { asyncHandler } from '../middleware/errorHandler';

export const analyticsController = {
  getDashboardStats: [
    asyncHandler(async (_req: Request, res: Response) => {
      const result = await AnalyticsService.getDashboardStats();
      res.status(200).json({ success: true, data: result });
    }),
  ],

  getUserAnalytics: [
    asyncHandler(async (_req: Request, res: Response) => {
      const result = await AnalyticsService.getUserAnalytics();
      res.status(200).json({ success: true, data: result });
    }),
  ],

  getSeminarAnalytics: [
    asyncHandler(async (_req: Request, res: Response) => {
      const result = await AnalyticsService.getSeminarAnalytics();
      res.status(200).json({ success: true, data: result });
    }),
  ],

  getAttendanceAnalytics: [
    asyncHandler(async (_req: Request, res: Response) => {
      const result = await AnalyticsService.getAttendanceAnalytics();
      res.status(200).json({ success: true, data: result });
    }),
  ],
};
