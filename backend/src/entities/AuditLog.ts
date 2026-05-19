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

export enum AuditAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTER = 'register',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  SCAN = 'scan',
  EXPORT = 'export',
  VIEW = 'view',
  SETTINGS_CHANGE = 'settings_change',
}

export enum AuditEntity {
  USER = 'user',
  SEMINAR = 'seminar',
  REGISTRATION = 'registration',
  ATTENDANCE = 'attendance',
  FEEDBACK = 'feedback',
  RECOMMENDATION = 'recommendation',
  SYSTEM = 'system',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.auditLogs)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({
    type: 'enum',
    enum: AuditEntity,
  })
  entity: AuditEntity;

  @Column({ type: 'uuid', nullable: true })
  entityId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, unknown>;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;
}
