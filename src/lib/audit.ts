import { prisma } from '@/lib/prisma';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'ACCESS'
  | 'EXPORT'
  | 'IMPORT'
  | 'APPROVE'
  | 'REJECT';

export type EntityType =
  | 'USER'
  | 'TEEN'
  | 'PROFESSOR'
  | 'RESPONSIBLE'
  | 'INSTITUTION'
  | 'CLASS'
  | 'ACTIVITY'
  | 'MESSAGE'
  | 'ISJF'
  | 'BADGE'
  | 'VINCULO';

interface CreateAuditLogParams {
  userId: string;
  action: AuditAction;
  entityType: EntityType;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

/**
 * Cria um log de auditoria
 */
export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    const log = await prisma.auditLog.create({
      data: {
        eventType: params.action,
        severity: 'MEDIUM',
        userId: params.userId,
        ipAddress: params.ipAddress || 'unknown',
        resource: params.entityType,
        action: params.entityId ? `${params.action}:${params.entityId}` : params.action,
        details: JSON.stringify(params.details || {}),
        success: true,
      },
    });

    return log;
  } catch (error) {
    console.error('Erro ao criar audit log:', error);
    // Não lançar erro para não quebrar o fluxo principal
  }
}

/**
 * Middleware helper para logar ações automaticamente
 */
export function auditMiddleware(
  action: AuditAction,
  entityType: EntityType
) {
  return async (
    userId: string,
    entityId: string,
    details?: Record<string, any>,
    ipAddress?: string
  ) => {
    await createAuditLog({
      userId,
      action,
      entityType,
      entityId,
      details,
      ipAddress,
    });
  };
}

// Helpers pré-configurados para ações comuns
export const auditHelpers = {
  logLogin: auditMiddleware('LOGIN', 'USER'),
  logLogout: auditMiddleware('LOGOUT', 'USER'),
  logUserCreate: auditMiddleware('CREATE', 'USER'),
  logUserUpdate: auditMiddleware('UPDATE', 'USER'),
  logUserDelete: auditMiddleware('DELETE', 'USER'),
  logInstitutionCreate: auditMiddleware('CREATE', 'INSTITUTION'),
  logInstitutionUpdate: auditMiddleware('UPDATE', 'INSTITUTION'),
  logInstitutionDelete: auditMiddleware('DELETE', 'INSTITUTION'),
  logClassCreate: auditMiddleware('CREATE', 'CLASS'),
  logClassUpdate: auditMiddleware('UPDATE', 'CLASS'),
  logClassDelete: auditMiddleware('DELETE', 'CLASS'),
  logActivityCreate: auditMiddleware('CREATE', 'ACTIVITY'),
  logActivityUpdate: auditMiddleware('UPDATE', 'ACTIVITY'),
  logActivityComplete: async (userId: string, activityId: string, score: number, ipAddress?: string) => {
    await createAuditLog({
      userId,
      action: 'UPDATE',
      entityType: 'ACTIVITY',
      entityId: activityId,
      details: { action: 'complete', score },
      ipAddress,
    });
  },
};
