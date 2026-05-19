import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { User } from './User';
import { Seminar } from './Seminar';
import { Attendance } from './Attendance';

export enum RegistrationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  WAITLIST = 'waitlist',
}

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.registrations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index()
  @Column({ type: 'uuid' })
  seminarId: string;

  @ManyToOne(() => Seminar, (seminar) => seminar.registrations)
  @JoinColumn({ name: 'seminarId' })
  seminar: Seminar;

  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.PENDING,
  })
  status: RegistrationStatus;

  @Column({ type: 'varchar', length: 255, unique: true })
  ticketNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  qrCode: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp', nullable: true })
  checkedInAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkedOutAt: Date;

  @Column({ type: 'boolean', default: false })
  emailSent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  emailSentAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Attendance, (attendance) => attendance.registration)
  attendance: Attendance;
}
