import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';
import { Seminar } from './Seminar';

export enum FeedbackType {
  SEMINAR_RATING = 'seminar_rating',
  SPEAKER_RATING = 'speaker_rating',
  GENERAL_FEEDBACK = 'general_feedback',
  ANONYMOUS_REPORT = 'anonymous_report',
  SUGGESTION = 'suggestion',
}

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.feedbacks)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index()
  @Column({ type: 'uuid' })
  seminarId: string;

  @ManyToOne(() => Seminar, (seminar) => seminar.feedbacks)
  @JoinColumn({ name: 'seminarId' })
  seminar: Seminar;

  @Column({
    type: 'enum',
    enum: FeedbackType,
    default: FeedbackType.GENERAL_FEEDBACK,
  })
  type: FeedbackType;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: true })
  isAnonymous: boolean;

  @Column({ type: 'boolean', default: false })
  isReport: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  speakerName: string;

  @Column({ type: 'boolean', default: false })
  isResolved: boolean;

  @Column({ type: 'text', nullable: true })
  adminResponse: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
