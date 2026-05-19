import { AppDataSource } from '../config/database';
import { Seminar, SeminarStatus, SeminarCategory } from '../entities/Seminar';
import { Registration, RegistrationStatus } from '../entities/Registration';
import { User, UserRole } from '../entities/User';
import { AppError } from '../middleware/errorHandler';
import { generateUniqueSlug } from '../utils/slug';
import { logger } from '../config/logger';

const seminarRepository = () => AppDataSource.getRepository(Seminar);
const registrationRepository = () => AppDataSource.getRepository(Registration);

export class SeminarService {
  static async create(data: {
    title: string;
    description: string;
    shortDescription?: string;
    venue: string;
    venueAddress?: string;
    startDate: string;
    endDate: string;
    capacity: number;
    category: SeminarCategory;
    tags?: string[];
    speakers?: Array<any>;
    isOnline?: boolean;
    onlineLink?: string;
    price?: number;
    requiresApproval?: boolean;
    organizerId: string;
    image?: string;
  }) {
    const slug = await generateUniqueSlug(data.title, async (slug) => {
      const existing = await seminarRepository().findOne({ where: { slug } });
      return !!existing;
    });

    const seminar = seminarRepository().create({
      ...data,
      slug,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: SeminarStatus.DRAFT,
    });

    await seminarRepository().save(seminar);
    logger.info(`Seminar created: ${seminar.title} by ${data.organizerId}`);

    return seminar;
  }

  static async findAll(query: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    status?: SeminarStatus;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    upcoming?: boolean;
  }) {
    const { page, limit, search, category, status, sortBy, sortOrder, upcoming } = query;

    const qb = seminarRepository()
      .createQueryBuilder('seminar')
      .leftJoinAndSelect('seminar.organizer', 'organizer')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(seminar.title ILIKE :search OR seminar.description ILIKE :search OR seminar.venue ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (category) {
      qb.andWhere('seminar.category = :category', { category });
    }

    if (status) {
      qb.andWhere('seminar.status = :status', { status });
    }

    if (upcoming) {
      qb.andWhere('seminar.startDate > NOW()');
    }

    // Default to published for public queries
    if (!status) {
      qb.andWhere('seminar.status = :status', { status: SeminarStatus.PUBLISHED });
    }

    qb.orderBy(`seminar.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    const [seminars, total] = await qb.getManyAndCount();

    return {
      data: seminars,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id: string) {
    const seminar = await seminarRepository().findOne({
      where: { id },
      relations: ['organizer', 'registrations', 'feedbacks'],
    });

    if (!seminar) {
      throw new AppError('Seminar not found', 404);
    }

    return seminar;
  }

  static async findBySlug(slug: string) {
    const seminar = await seminarRepository().findOne({
      where: { slug },
      relations: ['organizer'],
    });

    if (!seminar) {
      throw new AppError('Seminar not found', 404);
    }

    return seminar;
  }

  static async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      shortDescription: string;
      venue: string;
      venueAddress: string;
      startDate: string;
      endDate: string;
      capacity: number;
      category: SeminarCategory;
      tags: string[];
      speakers: Array<any>;
      isOnline: boolean;
      onlineLink: string;
      price: number;
      requiresApproval: boolean;
      status: SeminarStatus;
      image: string;
    }>,
    userId: string,
    userRole: UserRole
  ) {
    const seminar = await seminarRepository().findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!seminar) {
      throw new AppError('Seminar not found', 404);
    }

    // Only organizer or super admin can update
    if (seminar.organizerId !== userId && userRole !== UserRole.SUPER_ADMIN) {
      throw new AppError('Unauthorized to update this seminar', 403);
    }

    // Update slug if title changed
    if (data.title && data.title !== seminar.title) {
      data.slug = await generateUniqueSlug(data.title, async (slug) => {
        const existing = await seminarRepository().findOne({ where: { slug } });
        return !!existing;
      });
    }

    Object.assign(seminar, {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : seminar.startDate,
      endDate: data.endDate ? new Date(data.endDate) : seminar.endDate,
    });

    await seminarRepository().save(seminar);
    logger.info(`Seminar updated: ${seminar.title}`);

    return seminar;
  }

  static async delete(id: string, userId: string, userRole: UserRole) {
    const seminar = await seminarRepository().findOne({ where: { id } });

    if (!seminar) {
      throw new AppError('Seminar not found', 404);
    }

    if (seminar.organizerId !== userId && userRole !== UserRole.SUPER_ADMIN) {
      throw new AppError('Unauthorized to delete this seminar', 403);
    }

    await seminarRepository().remove(seminar);
    logger.info(`Seminar deleted: ${seminar.title}`);

    return { message: 'Seminar deleted successfully' };
  }

  static async publish(id: string, userId: string, userRole: UserRole) {
    return this.update(id, { status: SeminarStatus.PUBLISHED }, userId, userRole);
  }

  static async unpublish(id: string, userId: string, userRole: UserRole) {
    return this.update(id, { status: SeminarStatus.DRAFT }, userId, userRole);
  }

  static async getStats() {
    const totalSeminars = await seminarRepository().count();
    const upcomingSeminars = await seminarRepository()
      .createQueryBuilder('seminar')
      .where('seminar.startDate > NOW()')
      .andWhere('seminar.status = :status', { status: SeminarStatus.PUBLISHED })
      .getCount();

    const totalRegistrations = await registrationRepository().count();
    const totalAttendees = await seminarRepository()
      .createQueryBuilder('seminar')
      .select('SUM(seminar.attendedCount)', 'total')
      .getRawOne();

    const categoryStats = await seminarRepository()
      .createQueryBuilder('seminar')
      .select('seminar.category', 'category')
      .addSelect('COUNT(seminar.id)', 'count')
      .groupBy('seminar.category')
      .getRawMany();

    return {
      totalSeminars,
      upcomingSeminars,
      totalRegistrations,
      totalAttendees: parseInt(totalAttendees?.total || '0', 10),
      categoryStats,
    };
  }
}
