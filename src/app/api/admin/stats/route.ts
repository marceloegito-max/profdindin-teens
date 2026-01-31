import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/stats - Estatísticas gerais do sistema (apenas ADMIN)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Buscar estatísticas gerais
    const [
      totalUsers,
      totalTeens,
      totalProfessors,
      totalResponsibles,
      totalInstitutions,
      totalClasses,
      totalActivities,
      completedActivities,
      totalMessages,
      totalISJFTests,
      activeUsersLast7Days,
      activeUsersLast30Days,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'TEEN' } }),
      prisma.user.count({ where: { role: 'PROFESSOR' } }),
      prisma.user.count({ where: { role: 'RESPONSIBLE' } }),
      prisma.educationalInstitution.count(),
      prisma.class.count(),
      prisma.activity.count(),
      prisma.atividadeProgresso.count({ where: { status: 'concluida' } }),
      prisma.message.count(),
      prisma.iSJFHistory.count(),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Taxa de conclusão de atividades
    const completionRate = totalActivities > 0
      ? ((completedActivities / totalActivities) * 100).toFixed(1)
      : '0';

    // Distribuição de ISJF scores (últimos resultados)
    const isjfScores = await prisma.iSJFHistory.findMany({
      select: {
        indiceISJF: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const avgISJFScore = isjfScores.length > 0
      ? (isjfScores.reduce((sum, r) => sum + (r.indiceISJF || 0), 0) / isjfScores.length).toFixed(1)
      : '0';

    // Crescimento mensal de usuários (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyGrowth = await prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        COUNT(*) as count
      FROM "User"
      WHERE "createdAt" >= ${sixMonthsAgo}
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month
    `;

    return NextResponse.json({
      users: {
        total: totalUsers,
        teens: totalTeens,
        professors: totalProfessors,
        responsibles: totalResponsibles,
        activeLastWeek: activeUsersLast7Days,
        activeLastMonth: activeUsersLast30Days,
      },
      institutions: {
        total: totalInstitutions,
      },
      classes: {
        total: totalClasses,
      },
      activities: {
        total: totalActivities,
        completed: completedActivities,
        completionRate: parseFloat(completionRate),
      },
      messages: {
        total: totalMessages,
      },
      isjf: {
        totalTests: totalISJFTests,
        averageScore: parseFloat(avgISJFScore),
      },
      growth: monthlyGrowth.map(g => ({
        month: g.month,
        count: Number(g.count),
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}
