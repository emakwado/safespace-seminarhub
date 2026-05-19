import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { Registration } from './Registration';
import { Seminar } from './Seminar';
import { User } from './User';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
}

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  registrationId: string;

  @OneToOne(() => Registration, (registration) => registration.attendance)
  @JoinColumn({ name: 'registrationId' })
  registration: Registration;

  @Index()
  @Column({ type: 'uuid' })
  seminarId: string;

  @ManyToOne(() => Seminar, (seminar) => seminar.id)
  @JoinColumn({ name: 'seminarId' })
  seminar: Seminar;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @Column({ type: 'timestamp' })
  checkInTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOutTime: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  scannedBy: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  deviceId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  get duration(): number | null {
    if (!this.checkOutTime) return null;
    return (
      new Date(this.checkOutTime).getTime() - new Date(this.checkInTime).getTime()
    );
  }
}
