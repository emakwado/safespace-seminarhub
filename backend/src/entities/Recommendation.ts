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

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  referrerId: string;

  @ManyToOne(() => User, (user) => user.recommendations)
  @JoinColumn({ name: 'referrerId' })
  referrer: User;

  @Index()
  @Column({ type: 'uuid' })
  seminarId: string;

  @ManyToOne(() => Seminar, (seminar) => seminar.recommendations)
  @JoinColumn({ name: 'seminarId' })
  seminar: Seminar;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referredEmail: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  referralCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referralLink: string;

  @Column({ type: 'int', default: 0 })
  clickCount: number;

  @Column({ type: 'int', default: 0 })
  successfulReferrals: number;

  @Column({ type: 'boolean', default: false })
  emailSent: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
