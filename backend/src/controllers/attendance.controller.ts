import { Request, Response } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { asyncHandler } from '../middleware/errorHandler';
import {
  checkInSchema,
  checkOutSchema,
  attendanceStatsSchema,
} from '../validators/attendance.validator';
import { validate } from '../middleware/validation';

export const attendanceController = {
  checkIn: [
    validate(checkInSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await AttendanceService.checkIn({
        ticketNumber: req.body.ticketNumber,
        deviceId: req.body.deviceId,
        location: req.body.location,
        scannedBy: req.user?.id,
      });
      res.status(200).json({ success: true, data: result });
    }),
  ],

  checkOut: [
    validate(checkOutSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await AttendanceService.checkOut(req.body.ticketNumber);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  getStats: [
    validate(attendanceStatsSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const result = await AttendanceService.getStats({
        seminarId: req.query.seminarId as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      });
      res.status(200).json({ success: true, data: result });
    }),
  ],

  getSeminarAttendance: [
    asyncHandler(async (req: Request, res: Response) => {
      const result = await AttendanceService.getSeminarAttendance(req.params.seminarId);
      res.status(200).json({ success: true, data: result });
    }),
  ],

  getMyAttendance: [
    asyncHandler(async (req: Request, res: Response) => {
      const result = await AttendanceService.getAttendanceHistory(req.user!.id);
      res.status(200).json({ success: true, data: result });
    }),
  ],
};
