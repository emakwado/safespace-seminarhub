import { AppDataSource } from '../config/database';
import { Attendance, AttendanceStatus } from '../entities/Attendance';
import { Registration, RegistrationStatus } from '../entities/Registration';
import { Seminar } from '../entities/Seminar';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../config/logger';

const attendanceRepository = () => AppDataSource.getRepository(Attendance);
const registrationRepository = () => AppDataSource.getRepository(Registration);
const seminarRepository = () => AppDataSource.getRepository(Seminar);

export class AttendanceService {
  static async checkIn(data: {
    ticketNumber: string;
    deviceId?: string;
    location?: string;
    scannedBy?: string;
  }) {
    const registration = await registrationRepository().findOne({
      where: { ticketNumber: data.ticketNumber },
      relations: ['user', 'seminar'],
    });

    if (!registration) {
      throw new AppError('Invalid ticket number', 404);
    }

    if (registration.status !== RegistrationStatus.APPROVED) {
      throw new AppError('Registration not approved', 400);
    }

    if (registration.checkedInAt) {
      throw new AppError('Already checked in', 400);
    }

    // Check if seminar is ongoing or about to start
    const now = new Date();
    const seminarStart = new Date(registration.seminar.startDate);
    const seminarEnd = new Date(registration.seminar.endDate);

    // Allow check-in 30 minutes before start
    const checkInWindow = new Date(seminarStart.getTime() - 30 * 60000);

    if (now < checkInWindow) {
      throw new AppError('Check-in not yet available', 400);
    }

    if (now > seminarEnd) {
      throw new AppError('Seminar has ended', 400);
    }

    const attendance = attendanceRepository().create({
      registrationId: registration.id,
      seminarId: registration.seminarId,
      userId: registration.userId,
      status: now > seminarStart ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
      checkInTime: now,
      scannedBy: data.scannedBy,
      deviceId: data.deviceId,
      location: data.location,
    });

    await attendanceRepository().save(attendance);

    // Update registration
    registration.checkedInAt = now;
    await registrationRepository().save(registration);

    // Update seminar attended count
    const seminar = await seminarRepository().findOne({
      where: { id: registration.seminarId },
    });
    if (seminar) {
      seminar.attendedCount += 1;
      await seminarRepository().save(seminar);
    }

    logger.info(`Check-in: ${data.ticketNumber} at ${now.toISOString()}`);

    return {
      attendance,
      registration,
      message: 'Check-in successful',
    };
  }

  static async checkOut(ticketNumber: string) {
    const registration = await registrationRepository().findOne({
      where: { ticketNumber },
      relations: ['seminar'],
    });

    if (!registration) {
      throw new AppError('Invalid ticket number', 404);
    }

    if (!registration.checkedInAt) {
      throw new AppError('Not checked in yet', 400);
    }

    if (registration.checkedOutAt) {
      throw new AppError('Already checked out', 400);
    }

    const attendance = await attendanceRepository().findOne({
      where: { registrationId: registration.id },
    });

    if (!attendance) {
      throw new AppError('Attendance record not found', 404);
    }

    const now = new Date();
    attendance.checkOutTime = now;
    await attendanceRepository().save(attendance);

    registration.checkedOutAt = now;
    await registrationRepository().save(registration);

    logger.info(`Check-out: ${ticketNumber} at ${now.toISOString()}`);

    return {
      attendance,
      registration,
      message: 'Check-out successful',
    };
  }

  static async getStats(query: { seminarId?: string; startDate?: string; endDate?: string }) {
    const qb = attendanceRepository()
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.seminar', 'seminar')
      .leftJoinAndSelect('attendance.user', 'user');

    if (query.seminarId) {
      qb.andWhere('attendance.seminarId = :seminarId', { seminarId: query.seminarId });
    }

    if (query.startDate) {
      qb.andWhere('attendance.checkInTime >= :startDate', { startDate: query.startDate });
    }

    if (query.endDate) {
      qb.andWhere('attendance.checkInTime <= :endDate', { endDate: query.endDate });
    }

    const [attendances, total] = await qb.getManyAndCount();

    const present = attendances.filter((a) => a.status === AttendanceStatus.PRESENT).length;
    const late = attendances.filter((a) => a.status === AttendanceStatus.LATE).length;
    const absent = attendances.filter((a) => a.status === AttendanceStatus.ABSENT).length;

    // Get daily stats
    const dailyStats = await attendanceRepository()
      .createQueryBuilder('attendance')
      .select('DATE(attendance.checkInTime)', 'date')
      .addSelect('COUNT(attendance.id)', 'count')
      .groupBy('DATE(attendance.checkInTime)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      total,
      present,
      late,
      absent,
      dailyStats,
      attendanceRate: total > 0 ? Math.round(((present + late) / total) * 100) : 0,
    };
  }

  static async getSeminarAttendance(seminarId: string) {
    const seminar = await seminarRepository().findOne({
      where: { id: seminarId },
    });

    if (!seminar) {
      throw new AppError('Seminar not found', 404);
    }

    const attendances = await attendanceRepository().find({
      where: { seminarId },
      relations: ['user', 'registration'],
      order: { checkInTime: 'DESC' },
    });

    const registrations = await registrationRepository().find({
      where: { seminarId, status: RegistrationStatus.APPROVED },
      relations: ['user'],
    });

    const checkedIn = attendances.length;
    const notCheckedIn = registrations.length - checkedIn;

    return {
      seminar: {
        id: seminar.id,
        title: seminar.title,
        capacity: seminar.capacity,
        registeredCount: seminar.registeredCount,
        attendedCount: seminar.attendedCount,
      },
      attendances,
      summary: {
        totalRegistered: registrations.length,
        checkedIn,
        notCheckedIn: Math.max(0, notCheckedIn),
        attendanceRate:
          registrations.length > 0
            ? Math.round((checkedIn / registrations.length) * 100)
            : 0,
      },
    };
  }

  static async getAttendanceHistory(userId: string) {
    const attendances = await attendanceRepository().find({
      where: { userId },
      relations: ['seminar'],
      order: { checkInTime: 'DESC' },
    });

    return attendances;
  }
}
