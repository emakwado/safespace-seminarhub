import { AppDataSource } from '../config/database';
import { Recommendation } from '../entities/Recommendation';
import { Seminar } from '../entities/Seminar';
import { User } from '../entities/User';
import { AppError } from '../middleware/errorHandler';
import { sendMail } from '../config/mail';
import { getReferralInvitationTemplate } from '../utils/emailTemplates';
import { logger } from '../config/logger';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';

const recommendationRepository = () => AppDataSource.getRepository(Recommendation);
const seminarRepository = () => AppDataSource.getRepository(Seminar);
const userRepository = () => AppDataSource.getRepository(User);

export class RecommendationService {
  static async create(data: {
    referrerId: string;
    seminarId: string;
    referredEmail?: string;
  }) {
    const seminar = await seminarRepository().findOne({
      where: { id: data.seminarId },
    });

    if (!seminar) {
      throw new AppError('Seminar not found', 404);
    }

    const referrer = await userRepository().findOne({
      where: { id: data.referrerId },
    });

    if (!referrer) {
      throw new AppError('Referrer not found', 404);
    }

    const referralCode = `REF-${uuidv4().slice(0, 8).toUpperCase()}`;
    const referralLink = `${config.client.url}/seminars/${seminar.slug}?ref=${referralCode}`;

    const recommendation = recommendationRepository().create({
      referrerId: data.referrerId,
      seminarId: data.seminarId,
      referredEmail: data.referredEmail,
      referralCode,
      referralLink,
    });

    await recommendationRepository().save(recommendation);

    // Send email if referred email provided
    if (data.referredEmail) {
      const { subject, html } = getReferralInvitationTemplate(
        referrer.fullName,
        seminar.title,
        referralLink
      );
      await sendMail({ to: data.referredEmail, subject, html });
      recommendation.emailSent = true;
      await recommendationRepository().save(recommendation);
    }

    logger.info(`Recommendation created: ${referralCode}`);

    return {
      ...recommendation,
      referralLink,
    };
  }

  static async trackClick(referralCode: string) {
    const recommendation = await recommendationRepository().findOne({
      where: { referralCode },
    });

    if (!recommendation) {
      throw new AppError('Invalid referral code', 404);
    }

    recommendation.clickCount += 1;
    await recommendationRepository().save(recommendation);

    return recommendation;
  }

  static async trackSuccessfulReferral(referralCode: string) {
    const recommendation = await recommendationRepository().findOne({
      where: { referralCode },
    });

    if (!recommendation) {
      throw new AppError('Invalid referral code', 404);
    }

    recommendation.successfulReferrals += 1;
    await recommendationRepository().save(recommendation);

    return recommendation;
  }

  static async findAll(query: {
    page: number;
    limit: number;
    seminarId?: string;
  }) {
    const { page, limit, seminarId } = query;

    const qb = recommendationRepository()
      .createQueryBuilder('recommendation')
      .leftJoinAndSelect('recommendation.referrer', 'referrer')
      .leftJoinAndSelect('recommendation.seminar', 'seminar')
      .skip((page - 1) * limit)
      .take(limit);

    if (seminarId) {
      qb.andWhere('recommendation.seminarId = :seminarId', { seminarId });
    }

    qb.orderBy('recommendation.createdAt', 'DESC');

    const [recommendations, total] = await qb.getManyAndCount();

    return {
      data: recommendations,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getStats(query: { seminarId?: string; startDate?: string; endDate?: string }) {
    const qb = recommendationRepository()
      .createQueryBuilder('recommendation')
      .leftJoinAndSelect('recommendation.seminar', 'seminar');

    if (query.seminarId) {
      qb.andWhere('recommendation.seminarId = :seminarId', { seminarId: query.seminarId });
    }

    if (query.startDate) {
      qb.andWhere('recommendation.createdAt >= :startDate', { startDate: query.startDate });
    }

    if (query.endDate) {
      qb.andWhere('recommendation.createdAt <= :endDate', { endDate: query.endDate });
    }

    const recommendations = await qb.getMany();

    const totalClicks = recommendations.reduce((sum, r) => sum + r.clickCount, 0);
    const totalSuccessful = recommendations.reduce((sum, r) => sum + r.successfulReferrals, 0);

    // Top recommended seminars
    const topSeminars = await recommendationRepository()
      .createQueryBuilder('recommendation')
      .select('recommendation.seminarId', 'seminarId')
      .addSelect('seminar.title', 'title')
      .addSelect('SUM(recommendation.clickCount)', 'totalClicks')
      .addSelect('SUM(recommendation.successfulReferrals)', 'totalSuccess')
      .leftJoin('recommendation.seminar', 'seminar')
      .groupBy('recommendation.seminarId')
      .addGroupBy('seminar.title')
      .orderBy('totalClicks', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      totalRecommendations: recommendations.length,
      totalClicks,
      totalSuccessful,
      conversionRate: totalClicks > 0 ? Math.round((totalSuccessful / totalClicks) * 100) : 0,
      topSeminars,
    };
  }

  static async getUserRecommendations(userId: string) {
    const recommendations = await recommendationRepository().find({
      where: { referrerId: userId },
      relations: ['seminar'],
      order: { createdAt: 'DESC' },
    });

    return recommendations;
  }
}
