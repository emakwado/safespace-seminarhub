import { Request, Response } from 'express';
import { SeminarService } from '../services/seminar.service';
import { asyncHandler } from '../middleware/errorHandler';
import {
  createSeminarSchema,
  updateSeminarSchema,
  seminarIdSchema,
  seminarQuerySchema,
} from '../validators/seminar.validator';
import { validate } from '../middleware/validation';
import { UserRole } from '../entities/User';

export const seminarController = {
  create: [
    validate(createSeminarSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await SeminarService.create({
        ...req.body,
        organizerId: req.user!.id,
      });
      res.status(201).json({ success: true, data: result });
    }),
  ],

  findAll: [
    validate(seminarQuerySchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await SeminarService.findAll({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search as string,
        category: req.query.category as string,
        status: req.query.status as any,
        sortBy: (req.query.sortBy as string) || 'startDate',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
        upcoming: req.query.upcoming === 'true',
      });
      res.status(200).json({ success: true, data: result });
    }),
  ],

  findById: [
    validate(seminarIdSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await SeminarService.findById(req.params.id);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  findBySlug: [
    asyncHandler(async (req: Request, res: Response) => {
      const result = await SeminarService.findBySlug(req.params.slug);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  update: [
    validate(updateSeminarSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await SeminarService.update(
        req.params.id,
        req.body,
        req.user!.id,
        req.user!.role as UserRole
      );
      res.status(200).json({ success: true, data: result });
    }),
  ],

  delete: [
    validate(seminarIdSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await SeminarService.delete(
        req.params.id,
        req.user!.id,
        req.user!.role as UserRole
      );
      res.status(200).json({ success: true, data: result });
    }),
  ],

  publish: [
    validate(seminarIdSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await SeminarService.publish(
        req.params.id,
        req.user!.id,
        req.user!.role as UserRole
      );
      res.status(200).json({ success: true, data: result });
    }),
  ],

  unpublish: [
    validate(seminarIdSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await SeminarService.unpublish(
        req.params.id,
        req.user!.id,
        req.user!.role as UserRole
      );
      res.status(200).json({ success: true, data: result });
    }),
  ],

  getStats: [
    asyncHandler(async (_req: Request, res: Response) => {
      const result = await SeminarService.getStats();
      res.status(200).json({ success: true, data: result });
    }),
  ],
};
