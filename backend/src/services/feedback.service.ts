import { AppDataSource } from '../config/database';
import { Feedback, FeedbackType } from '../entities/Feedback';
import { Seminar } from '../entities/Seminar';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../config/logger';

const feedbackRepository = () => AppDataSource.getRepository(Feedback);
const seminarRepository = () => AppDataSource.getRepository(Seminar);

export class FeedbackService {
  static async create(data: {
    userId?: string;
    seminarId: string;
    type: FeedbackType;
    rating?: number;
    content: string;
    isAnonymous?: boolean;
    isReport?: boolean;
    speakerName?: string;
  }) {
    const seminar = await seminarRepository().findOne({
      where: { id: data.seminarId },
    });

    if (!seminar) {
      throw new AppError('Seminar not found', 404);
    }

    const feedback = feedbackRepository().create({
      userId: data.isAnonymous ? null : data.userId,
      seminarId: data.seminarId,
      type: data.type,
      rating: data.rating,
      content: data.content,
      isAnonymous: data.isAnonymous ?? true,
      isReport: data.isReport ?? false,
      speakerName: data.speakerName,
    });

    await feedbackRepository().save(feedback);
    logger.info(`Feedback created for seminar ${data.seminarId}`);

    return feedback;
  }

  static async findAll(query: {
    page: number;
    limit: number;
    seminarId?: string;
    type?: string;
    isResolved?: boolean;
    sortBy: string;
    sortOrder: string;
  }) {
    const { page, limit, seminarId, type, isResolved, sortBy, sortOrder } = query;

    const qb = feedbackRepository()
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.user', 'user')
      .leftJoinAndSelect('feedback.seminar', 'seminar')
      .skip((page - 1) * limit)
      .take(limit);

    if (seminarId) {
      qb.andWhere('feedback.seminarId = :seminarId', { seminarId });
    }

    if (type) {
      qb.andWhere('feedback.type = :type', { type });
    }

    if (isResolved !== undefined) {
      qb.andWhere('feedback.isResolved = :isResolved', { isResolved });
    }

    qb.orderBy(`feedback.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    const [feedbacks, total] = await qb.getManyAndCount();

    return {
      data: feedbacks,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id: string) {
    const feedback = await feedbackRepository().findOne({
      where: { id },
      relations: ['user', 'seminar'],
    });

    if (!feedback) {
      throw new AppError('Feedback not found', 404);
    }

    return feedback;
  }

  static async update(id: string, data: { isResolved: boolean; adminResponse?: string }) {
    const feedback = await feedbackRepository().findOne({ where: { id } });

    if (!feedback) {
      throw new AppError('Feedback not found', 404);
    }

    feedback.isResolved = data.isResolved;
    if (data.adminResponse) feedback.adminResponse = data.adminResponse;
    if (data.isResolved) feedback.resolvedAt = new Date();

    await feedbackRepository().save(feedback);
    logger.info(`Feedback ${id} updated`);

    return feedback;
  }

  static async getSeminarFeedback(seminarId: string) {
    const feedbacks = await feedbackRepository().find({
      where: { seminarId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    const ratings = feedbacks
      .filter((f) => f.rating !== null)
      .map((f) => f.rating as number);

    const averageRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    const ratingDistribution = [1, 2, 3, 4, 5].map((star) => ({
      star,
      count: ratings.filter((r) => r === star).length,
      percentage: ratings.length > 0
        ? Math.round((ratings.filter((r) => r === star).length / ratings.length) * 100)
        : 0,
    }));

    return {
      feedbacks,
      summary: {
        total: feedbacks.length,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
      },
    };
  }

  static async getFeedbackStats() {
    const totalFeedback = await feedbackRepository().count();
    const totalReports = await feedbackRepository().count({
      where: { isReport: true },
    });
    const unresolvedReports = await feedbackRepository().count({
      where: { isReport: true, isResolved: false },
    });

    const typeStats = await feedbackRepository()
      .createQueryBuilder('feedback')
      .select('feedback.type', 'type')
      .addSelect('COUNT(feedback.id)', 'count')
      .groupBy('feedback.type')
      .getRawMany();

    return {
      totalFeedback,
      totalReports,
      unresolvedReports,
      typeStats,
    };
  }
}
