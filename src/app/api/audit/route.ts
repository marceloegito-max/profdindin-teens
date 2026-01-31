import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { applyRateLimit, rateLimiters, getIdentifier } from '@/lib/rate-limit';

/**
 * GET /api/audit - Listar logs de auditoria (apenas ADMIN)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Apenas ADMINs podem ver logs de auditoria
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Apply rate limiting
    const rateLimitResponse = applyRateLimit(
      request,
      rateLimiters.standard,
      getIdentifier(request, session.user.id)
    );
    if (rateLimitResponse) return rateLimitResponse;

    // Parâmetros de paginação
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const entityType = searchParams.get('entityType');

    // Construir filtros
    const where: any = {};
    if (action) where.action = action;
    if (userId) where.userId = userId;
    if (entityType) where.resource = entityType;

    // Buscar logs
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar logs de auditoria:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar logs de auditoria' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/audit - Criar log de auditoria
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { action, entityType, entityId, details, ipAddress } = body;

    // Validar campos obrigatórios
    if (!action || !entityType) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: action, entityType' },
        { status: 400 }
      );
    }

    // Obter IP
    const ip = ipAddress || request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown';

    // Criar log de auditoria
    const log = await prisma.auditLog.create({
      data: {
        eventType: action,
        severity: 'MEDIUM',
        userId: session.user.id,
        ipAddress: ip,
        resource: entityType,
        action: entityId ? `${action}:${entityId}` : action,
        details: JSON.stringify(details || {}),
        success: true,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar log de auditoria:', error);
    return NextResponse.json(
      { error: 'Erro ao criar log de auditoria' },
      { status: 500 }
    );
  }
}
