import { Request, Response } from 'express';
import { RegistrationService } from '../services/registration.service';
import { asyncHandler } from '../middleware/errorHandler';
import {
  createRegistrationSchema,
  updateRegistrationSchema,
  registrationIdSchema,
  registrationQuerySchema,
} from '../validators/registration.validator';
import { validate } from '../middleware/validation';
import { UserRole } from '../entities/User';

export const registrationController = {
  create: [
    validate(createRegistrationSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await RegistrationService.create(req.user!.id, req.body);
      res.status(201).json({ success: true, data: result });
    }),
  ],

  findAll: [
    validate(registrationQuerySchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await RegistrationService.findAll({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        seminarId: req.query.seminarId as string,
        status: req.query.status as any,
        userId: req.user!.role === UserRole.ATTENDEE ? req.user!.id : (req.query.userId as string),
      });
      res.status(200).json({ success: true, data: result });
    }),
  ],

  findById: [
    validate(registrationIdSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await RegistrationService.findById(req.params.id);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  updateStatus: [
    validate(updateRegistrationSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await RegistrationService.updateStatus(
        req.params.id,
        req.body.status,
        req.user!.id
      );
      res.status(200).json({ success: true, data: result });
    }),
  ],

  cancel: [
    validate(registrationIdSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await RegistrationService.cancel(req.user!.id, req.params.id);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  getMyRegistrations: [
    asyncHandler(async (req: Request, res: Response) => {
      const result = await RegistrationService.getUserRegistrations(req.user!.id);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  exportAttendees: [
    asyncHandler(async (req: Request, res: Response) => {
      const seminarId = req.params.seminarId;
      const result = await RegistrationService.exportAttendees(seminarId);
      res.status(200).json({ success: true, data: result });
    }),
  ],
};
