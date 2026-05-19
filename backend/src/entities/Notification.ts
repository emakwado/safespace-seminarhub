import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';

export enum NotificationType {
  SEMINAR_REMINDER = 'seminar_reminder',
  REGISTRATION_CONFIRMED = 'registration_confirmed',
  REGISTRATION_REJECTED = 'registration_rejected',
  SEMINAR_CANCELLED = 'seminar_cancelled',
  SEMINAR_UPDATED = 'seminar_updated',
  NEW_FEEDBACK = 'new_feedback',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'simple-json', nullable: true })
  data: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
