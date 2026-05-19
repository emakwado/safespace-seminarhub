import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';
import { Seminar, SeminarStatus } from '../entities/Seminar';
import { Registration, RegistrationStatus } from '../entities/Registration';
import { Attendance } from '../entities/Attendance';
import { Feedback } from '../entities/Feedback';
import { AuditLog } from '../entities/AuditLog';

const userRepository = () => AppDataSource.getRepository(User);
const seminarRepository = () => AppDataSource.getRepository(Seminar);
const registrationRepository = () => AppDataSource.getRepository(Registration);
const attendanceRepository = () => AppDataSource.getRepository(Attendance);
const feedbackRepository = () => AppDataSource.getRepository(Feedback);
const auditLogRepository = () => AppDataSource.getRepository(AuditLog);

export class AnalyticsService {
  static async getDashboardStats() {
    const totalUsers = await userRepository().count();
    const totalOrganizers = await userRepository().count({
      where: { role: UserRole.ORGANIZER },
    });
    const totalAttendees = await userRepository().count({
      where: { role: UserRole.ATTENDEE },
    });

    const totalSeminars = await seminarRepository().count();
    const publishedSeminars = await seminarRepository().count({
      where: { status: SeminarStatus.PUBLISHED },
    });
    const upcomingSeminars = await seminarRepository()
      .createQueryBuilder('seminar')
      .where('seminar.startDate > NOW()')
      .andWhere('seminar.status = :status', { status: SeminarStatus.PUBLISHED })
      .getCount();

    const totalRegistrations = await registrationRepository().count();
    const approvedRegistrations = await registrationRepository().count({
      where: { status: RegistrationStatus.APPROVED },
    });
    const pendingRegistrations = await registrationRepository().count({
      where: { status: RegistrationStatus.PENDING },
    });

    const totalFeedback = await feedbackRepository().count();
    const totalReports = await feedbackRepository().count({
      where: { isReport: true },
    });

    // Monthly registration trend
    const monthlyRegistrations = await registrationRepository()
      .createQueryBuilder('registration')
      .select("TO_CHAR(registration.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(registration.id)', 'count')
      .groupBy("TO_CHAR(registration.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .limit(12)
      .getRawMany();

    // Recent activity
    const recentActivity = await auditLogRepository()
      .createQueryBuilder('audit')
      .leftJoinAndSelect('audit.user', 'user')
      .orderBy('audit.createdAt', 'DESC')
      .take(10)
      .getMany();

    return {
      users: {
        total: totalUsers,
        organizers: totalOrganizers,
        attendees: totalAttendees,
      },
      seminars: {
        total: totalSeminars,
        published: publishedSeminars,
        upcoming: upcomingSeminars,
      },
      registrations: {
        total: totalRegistrations,
        approved: approvedRegistrations,
        pending: pendingRegistrations,
        approvalRate:
          totalRegistrations > 0
            ? Math.round((approvedRegistrations / totalRegistrations) * 100)
            : 0,
      },
      feedback: {
        total: totalFeedback,
        reports: totalReports,
      },
      monthlyRegistrations,
      recentActivity,
    };
  }

  static async getUserAnalytics() {
    const newUsersThisMonth = await userRepository()
      .createQueryBuilder('user')
      .where("user.createdAt >= DATE_TRUNC('month', NOW())")
      .getCount();

    const usersByRole = await userRepository()
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('user.role')
      .getRawMany();

    const usersByMonth = await userRepository()
      .createQueryBuilder('user')
      .select("TO_CHAR(user.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy("TO_CHAR(user.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .limit(12)
      .getRawMany();

    const activeUsers = await userRepository()
      .createQueryBuilder('user')
      .where('user.lastLoginAt >= NOW() - INTERVAL \u002730 days\u0027')
      .getCount();

    return {
      newUsersThisMonth,
      usersByRole,
      usersByMonth,
      activeUsers,
    };
  }

  static async getSeminarAnalytics() {
    const topSeminars = await seminarRepository()
      .createQueryBuilder('seminar')
      .select('seminar.id', 'id')
      .addSelect('seminar.title', 'title')
      .addSelect('seminar.registeredCount', 'registrations')
      .addSelect('seminar.attendedCount', 'attendance')
      .addSelect('seminar.capacity', 'capacity')
      .orderBy('seminar.registeredCount', 'DESC')
      .limit(10)
      .getRawMany();

    const categoryDistribution = await seminarRepository()
      .createQueryBuilder('seminar')
      .select('seminar.category', 'category')
      .addSelect('COUNT(seminar.id)', 'count')
      .groupBy('seminar.category')
      .getRawMany();

    const seminarsByMonth = await seminarRepository()
      .createQueryBuilder('seminar')
      .select("TO_CHAR(seminar.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(seminar.id)', 'count')
      .groupBy("TO_CHAR(seminar.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .limit(12)
      .getRawMany();

    return {
      topSeminars,
      categoryDistribution,
      seminarsByMonth,
    };
  }

  static async getAttendanceAnalytics() {
    const dailyAttendance = await attendanceRepository()
      .createQueryBuilder('attendance')
      .select("TO_CHAR(attendance.checkInTime, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(attendance.id)', 'count')
      .groupBy("TO_CHAR(attendance.checkInTime, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC')
      .limit(30)
      .getRawMany();

    const attendanceBySeminar = await attendanceRepository()
      .createQueryBuilder('attendance')
      .select('seminar.title', 'seminar')
      .addSelect('COUNT(attendance.id)', 'attendance')
      .leftJoin('attendance.seminar', 'seminar')
      .groupBy('seminar.title')
      .orderBy('attendance', 'DESC')
      .limit(10)
      .getRawMany();

    const averageDuration = await attendanceRepository()
      .createQueryBuilder('attendance')
      .select('AVG(EXTRACT(EPOCH FROM (attendance.checkOutTime - attendance.checkInTime)))', 'avg')
      .where('attendance.checkOutTime IS NOT NULL')
      .getRawOne();

    return {
      dailyAttendance,
      attendanceBySeminar,
      averageDuration: Math.round((parseFloat(averageDuration?.avg || '0') / 60) * 10) / 10, // minutes
    };
  }
}
