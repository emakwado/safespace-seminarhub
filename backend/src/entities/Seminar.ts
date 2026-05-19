import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';
import { Registration } from './Registration';
import { Feedback } from './Feedback';
import { Recommendation } from './Recommendation';

export enum SeminarStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum SeminarCategory {
  TECHNOLOGY = 'technology',
  BUSINESS = 'business',
  HEALTH = 'health',
  EDUCATION = 'education',
  ARTS = 'arts',
  SCIENCE = 'science',
  OTHER = 'other',
}

@Entity('seminars')
export class Seminar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 255 })
  venue: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  venueAddress: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'int', default: 0 })
  capacity: number;

  @Column({ type: 'int', default: 0 })
  registeredCount: number;

  @Column({ type: 'int', default: 0 })
  attendedCount: number;

  @Column({
    type: 'enum',
    enum: SeminarStatus,
    default: SeminarStatus.DRAFT,
  })
  status: SeminarStatus;

  @Column({
    type: 'enum',
    enum: SeminarCategory,
    default: SeminarCategory.OTHER,
  })
  category: SeminarCategory;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'simple-json', nullable: true })
  speakers: Array<{
    name: string;
    bio: string;
    avatar?: string;
    title?: string;
    company?: string;
  }>;

  @Column({ type: 'boolean', default: false })
  isOnline: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  onlineLink: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'boolean', default: false })
  requiresApproval: boolean;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column({ type: 'uuid' })
  organizerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Registration, (registration) => registration.seminar)
  registrations: Registration[];

  @OneToMany(() => Feedback, (feedback) => feedback.seminar)
  feedbacks: Feedback[];

  @OneToMany(() => Recommendation, (recommendation) => recommendation.seminar)
  recommendations: Recommendation[];

  get availableSeats(): number {
    return Math.max(0, this.capacity - this.registeredCount);
  }

  get isFull(): boolean {
    return this.registeredCount >= this.capacity && this.capacity > 0;
  }

  get isUpcoming(): boolean {
    return new Date() < new Date(this.startDate);
  }

  get isOngoing(): boolean {
    const now = new Date();
    return now >= new Date(this.startDate) && now <= new Date(this.endDate);
  }

  get isPast(): boolean {
    return new Date() > new Date(this.endDate);
  }
}
