import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { AuditLog, AuditAction, AuditEntity } from '../entities/AuditLog';
import { logger } from '../config/logger';

interface AuditOptions {
  action: AuditAction;
  entity: AuditEntity;
  getEntityId?: (req: Request) => string | undefined;
  getDescription?: (req: Request) => string;
}

export const auditLog = (options: AuditOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store original json to capture response
    const originalJson = res.json.bind(res);

    res.json = function(body: unknown) {
      // Fire audit log asynchronously (don't block response)
      createAuditLog(req, res, options, body).catch((err) => {
        logger.error('Audit log creation failed:', err);
      });

      return originalJson(body);
    };

    next();
  };
};

async function createAuditLog(
  req: Request,
  res: Response,
  options: AuditOptions,
  _body: unknown
): Promise<void> {
  try {
    const auditLogRepository = AppDataSource.getRepository(AuditLog);

    const auditLog = auditLogRepository.create({
      userId: req.user?.id,
      action: options.action,
      entity: options.entity,
      entityId: options.getEntityId ? options.getEntityId(req) : undefined,
      description: options.getDescription ? options.getDescription(req) : `${options.action} ${options.entity}`,
      metadata: {
        method: req.method,
        path: req.path,
        params: req.params,
        query: req.query,
        statusCode: res.statusCode,
      },
      ipAddress: req.ip || req.socket.remoteAddress || undefined,
      userAgent: req.headers['user-agent'] || undefined,
    });

    await auditLogRepository.save(auditLog);
  } catch (error) {
    logger.error('Failed to create audit log:', error);
  }
}
