import { AppDataSource } from '../config/database';
import { Registration, RegistrationStatus } from '../entities/Registration';
import { Seminar, SeminarStatus } from '../entities/Seminar';
import { User } from '../entities/User';
import { AppError } from '../middleware/errorHandler';
import { generateQRCode, generateTicketQRData } from '../utils/qrCode';
import { sendMail } from '../config/mail';
import { getRegistrationConfirmationTemplate } from '../utils/emailTemplates';
import { logger } from '../config/logger';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const registrationRepository = () => AppDataSource.getRepository(Registration);
const seminarRepository = () => AppDataSource.getRepository(Seminar);

export class RegistrationService {
  static async create(userId: string, data: { seminarId: string; notes?: string }) {
    const seminar = await seminarRepository().findOne({
      where: { id: data.seminarId },
    });

    if (!seminar) {
      throw new AppError('Seminar not found', 404);
    }

    if (seminar.status !== SeminarStatus.PUBLISHED) {
      throw new AppError('Seminar is not available for registration', 400);
    }

    if (seminar.isFull) {
      throw new AppError('Seminar is fully booked', 400);
    }

    if (!seminar.isUpcoming) {
      throw new AppError('Registration is closed for this seminar', 400);
    }

    // Check if already registered
    const existingRegistration = await registrationRepository().findOne({
      where: { userId, seminarId: data.seminarId },
    });

    if (existingRegistration) {
      throw new AppError('You are already registered for this seminar', 409);
    }

    const ticketNumber = `TKT-${uuidv4().slice(0, 8).toUpperCase()}`;
    const qrData = generateTicketQRData(ticketNumber, data.seminarId, userId);
    const qrCode = await generateQRCode(qrData);

    const status = seminar.requiresApproval
      ? RegistrationStatus.PENDING
      : RegistrationStatus.APPROVED;

    const registration = registrationRepository().create({
      userId,
      seminarId: data.seminarId,
      status,
      ticketNumber,
      qrCode,
      notes: data.notes,
    });

    await registrationRepository().save(registration);

    // Update seminar registered count
    seminar.registeredCount += 1;
    await seminarRepository().save(seminar);

    // Send confirmation email if approved
    if (status === RegistrationStatus.APPROVED) {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });

      if (user) {
        const { subject, html } = getRegistrationConfirmationTemplate(
          user.firstName,
          seminar.title,
          ticketNumber,
          format(new Date(seminar.startDate), 'MMMM dd, yyyy HH:mm'),
          seminar.venue
        );
        await sendMail({ to: user.email, subject, html });
        registration.emailSent = true;
        registration.emailSentAt = new Date();
        await registrationRepository().save(registration);
      }
    }

    logger.info(`Registration created: ${ticketNumber} for seminar ${seminar.title}`);

    return {
      ...registration,
      seminar,
    };
  }

  static async findAll(query: {
    page: number;
    limit: number;
    seminarId?: string;
    status?: RegistrationStatus;
    userId?: string;
  }) {
    const { page, limit, seminarId, status, userId } = query;

    const qb = registrationRepository()
      .createQueryBuilder('registration')
      .leftJoinAndSelect('registration.user', 'user')
      .leftJoinAndSelect('registration.seminar', 'seminar')
      .skip((page - 1) * limit)
      .take(limit);

    if (seminarId) {
      qb.andWhere('registration.seminarId = :seminarId', { seminarId });
    }

    if (status) {
      qb.andWhere('registration.status = :status', { status });
    }

    if (userId) {
      qb.andWhere('registration.userId = :userId', { userId });
    }

    qb.orderBy('registration.createdAt', 'DESC');

    const [registrations, total] = await qb.getManyAndCount();

    return {
      data: registrations,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id: string) {
    const registration = await registrationRepository().findOne({
      where: { id },
      relations: ['user', 'seminar', 'attendance'],
    });

    if (!registration) {
      throw new AppError('Registration not found', 404);
    }

    return registration;
  }

  static async findByTicketNumber(ticketNumber: string) {
    const registration = await registrationRepository().findOne({
      where: { ticketNumber },
      relations: ['user', 'seminar'],
    });

    if (!registration) {
      throw new AppError('Registration not found', 404);
    }

    return registration;
  }

  static async updateStatus(
    id: string,
    status: RegistrationStatus,
    adminId: string
  ) {
    const registration = await registrationRepository().findOne({
      where: { id },
      relations: ['user', 'seminar'],
    });

    if (!registration) {
      throw new AppError('Registration not found', 404);
    }

    const oldStatus = registration.status;
    registration.status = status;
    await registrationRepository().save(registration);

    // If cancelled, decrement count
    if (status === RegistrationStatus.CANCELLED && oldStatus === RegistrationStatus.APPROVED) {
      const seminar = await seminarRepository().findOne({
        where: { id: registration.seminarId },
      });
      if (seminar) {
        seminar.registeredCount = Math.max(0, seminar.registeredCount - 1);
        await seminarRepository().save(seminar);
      }
    }

    // Send email on approval
    if (status === RegistrationStatus.APPROVED && oldStatus !== RegistrationStatus.APPROVED) {
      const { subject, html } = getRegistrationConfirmationTemplate(
        registration.user.firstName,
        registration.seminar.title,
        registration.ticketNumber,
        format(new Date(registration.seminar.startDate), 'MMMM dd, yyyy HH:mm'),
        registration.seminar.venue
      );
      await sendMail({ to: registration.user.email, subject, html });
    }

    logger.info(`Registration ${id} status updated to ${status} by ${adminId}`);

    return registration;
  }

  static async cancel(userId: string, registrationId: string) {
    const registration = await registrationRepository().findOne({
      where: { id: registrationId, userId },
      relations: ['seminar'],
    });

    if (!registration) {
      throw new AppError('Registration not found', 404);
    }

    if (registration.status === RegistrationStatus.CANCELLED) {
      throw new AppError('Registration already cancelled', 400);
    }

    registration.status = RegistrationStatus.CANCELLED;
    await registrationRepository().save(registration);

    // Decrement seminar count
    const seminar = await seminarRepository().findOne({
      where: { id: registration.seminarId },
    });
    if (seminar) {
      seminar.registeredCount = Math.max(0, seminar.registeredCount - 1);
      await seminarRepository().save(seminar);
    }

    logger.info(`Registration ${registrationId} cancelled by user ${userId}`);

    return { message: 'Registration cancelled successfully' };
  }

  static async getUserRegistrations(userId: string) {
    const registrations = await registrationRepository().find({
      where: { userId },
      relations: ['seminar', 'seminar.organizer'],
      order: { createdAt: 'DESC' },
    });

    return registrations;
  }

  static async exportAttendees(seminarId: string) {
    const registrations = await registrationRepository().find({
      where: { seminarId, status: RegistrationStatus.APPROVED },
      relations: ['user'],
    });

    return registrations.map((reg) => ({
      ticketNumber: reg.ticketNumber,
      name: reg.user.fullName,
      email: reg.user.email,
      checkedIn: !!reg.checkedInAt,
      checkedInAt: reg.checkedInAt,
    }));
  }
}
