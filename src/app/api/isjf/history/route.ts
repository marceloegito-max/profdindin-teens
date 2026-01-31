import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

/**
 * GET /api/isjf/history?userId=xxx&limit=10
 * Retorna o histórico de ISJF do usuário
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get('userId');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : 10;

    // Obter userId (de autenticação ou query)
    const session = await getServerSession();
    const userId = queryUserId || (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório (autenticação ou query)' },
        { status: 401 }
      );
    }

    // Buscar histórico
    const history = await prisma.iSJFHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Contar total
    const total = await prisma.iSJFHistory.count({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      data: history,
      total,
      limit,
    });
  } catch (err: any) {
    console.error('Erro ao buscar histórico ISJF:', err);
    return NextResponse.json(
      { error: 'Erro ao buscar histórico ISJF', details: err.message },
      { status: 500 }
    );
  }
}
