import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { User, UserRole, UserStatus } from '../entities/User';
import { Seminar, SeminarStatus, SeminarCategory } from '../entities/Seminar';
import { hashPassword } from '../utils/password';
import { logger } from '../config/logger';

const seedDatabase = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected for seeding');

    const userRepository = AppDataSource.getRepository(User);
    const seminarRepository = AppDataSource.getRepository(Seminar);

    // Check if already seeded
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      logger.info('Database already seeded, skipping...');
      process.exit(0);
    }

    // Create Super Admin
    const superAdmin = userRepository.create({
      email: 'admin@safespace.com',
      password: await hashPassword('Admin@123'),
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    });
    await userRepository.save(superAdmin);

    // Create Organizer
    const organizer = userRepository.create({
      email: 'organizer@safespace.com',
      password: await hashPassword('Organizer@123'),
      firstName: 'Jane',
      lastName: 'Organizer',
      role: UserRole.ORGANIZER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    });
    await userRepository.save(organizer);

    // Create Attendee
    const attendee = userRepository.create({
      email: 'attendee@safespace.com',
      password: await hashPassword('Attendee@123'),
      firstName: 'John',
      lastName: 'Attendee',
      role: UserRole.ATTENDEE,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    });
    await userRepository.save(attendee);

    // Create sample seminars
    const now = new Date();
    const seminars = [
      {
        title: 'Introduction to AI and Machine Learning',
        slug: 'introduction-to-ai-and-machine-learning',
        description: 'A comprehensive introduction to artificial intelligence and machine learning concepts. Learn about neural networks, deep learning, and practical applications.',
        shortDescription: 'Learn the fundamentals of AI and ML with hands-on examples.',
        venue: 'Tech Hub Auditorium',
        venueAddress: '123 Innovation Drive, Silicon Valley, CA 94025',
        startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        capacity: 100,
        registeredCount: 0,
        attendedCount: 0,
        status: SeminarStatus.PUBLISHED,
        category: SeminarCategory.TECHNOLOGY,
        tags: ['AI', 'Machine Learning', 'Deep Learning', 'Python'],
        speakers: [
          {
            name: 'Dr. Sarah Chen',
            bio: 'AI Research Lead at TechCorp with 15 years of experience in machine learning.',
            title: 'Senior AI Researcher',
            company: 'TechCorp',
          },
          {
            name: 'Prof. Michael Ross',
            bio: 'Professor of Computer Science at Stanford University.',
            title: 'Professor',
            company: 'Stanford University',
          },
        ],
        isOnline: false,
        price: 0,
        requiresApproval: false,
        organizerId: organizer.id,
      },
      {
        title: 'Modern Web Development with Next.js',
        slug: 'modern-web-development-with-nextjs',
        description: 'Master Next.js 14 with App Router, Server Components, and modern React patterns. Build production-ready applications.',
        shortDescription: 'Build modern web apps with Next.js 14 and React 18.',
        venue: 'Virtual Event',
        venueAddress: 'Online',
        startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        capacity: 500,
        registeredCount: 0,
        attendedCount: 0,
        status: SeminarStatus.PUBLISHED,
        category: SeminarCategory.TECHNOLOGY,
        tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
        speakers: [
          {
            name: 'Alex Johnson',
            bio: 'Senior Frontend Engineer and open-source contributor.',
            title: 'Senior Engineer',
            company: 'Vercel',
          },
        ],
        isOnline: true,
        onlineLink: 'https://meet.safespace.com/nextjs-workshop',
        price: 0,
        requiresApproval: false,
        organizerId: organizer.id,
      },
      {
        title: 'Mental Health in the Workplace',
        slug: 'mental-health-in-the-workplace',
        description: 'An important seminar on maintaining mental wellness, managing stress, and creating supportive work environments.',
        shortDescription: 'Essential strategies for mental wellness at work.',
        venue: 'Wellness Center',
        venueAddress: '456 Health Avenue, San Francisco, CA 94102',
        startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        capacity: 50,
        registeredCount: 0,
        attendedCount: 0,
        status: SeminarStatus.PUBLISHED,
        category: SeminarCategory.HEALTH,
        tags: ['Mental Health', 'Wellness', 'Workplace', 'Self-Care'],
        speakers: [
          {
            name: 'Dr. Emily Watson',
            bio: 'Licensed Clinical Psychologist specializing in workplace mental health.',
            title: 'Clinical Psychologist',
            company: 'Mindful Wellness Institute',
          },
        ],
        isOnline: false,
        price: 0,
        requiresApproval: true,
        organizerId: organizer.id,
      },
      {
        title: 'Business Strategy for Startups',
        slug: 'business-strategy-for-startups',
        description: 'Learn proven strategies for building and scaling successful startups. From idea validation to product-market fit.',
        shortDescription: 'Strategic frameworks for startup success.',
        venue: 'Innovation Lab',
        venueAddress: '789 Startup Blvd, Austin, TX 78701',
        startDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
        capacity: 80,
        registeredCount: 0,
        attendedCount: 0,
        status: SeminarStatus.DRAFT,
        category: SeminarCategory.BUSINESS,
        tags: ['Startup', 'Business Strategy', 'Entrepreneurship', 'Growth'],
        speakers: [
          {
            name: 'Mark Stevens',
            bio: 'Serial entrepreneur and angel investor with 5 successful exits.',
            title: 'Founder & CEO',
            company: 'Startup Ventures',
          },
        ],
        isOnline: false,
        price: 49.99,
        requiresApproval: false,
        organizerId: organizer.id,
      },
    ];

    for (const seminarData of seminars) {
      const seminar = seminarRepository.create(seminarData);
      await seminarRepository.save(seminar);
    }

    logger.info('✅ Database seeded successfully');
    logger.info('Default accounts:');
    logger.info('  Super Admin: admin@safespace.com / Admin@123');
    logger.info('  Organizer:   organizer@safespace.com / Organizer@123');
    logger.info('  Attendee:    attendee@safespace.com / Attendee@123');

    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

// seedDatabase();
