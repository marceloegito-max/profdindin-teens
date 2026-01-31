import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/dashboard
 * Retorna todos os dados necessários para o dashboard Teen
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const userId = session.user.id;

    // Buscar progresso do usuário
    let userProgress = await prisma.userProgress.findUnique({
      where: { userId },
    });

    // Se não existe, criar com valores padrão
    if (!userProgress) {
      userProgress = await prisma.userProgress.create({
        data: {
          userId,
          xp: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          totalActivitiesCompleted: 0,
          totalCheckups: 0,
          totalRaioX: 0,
          totalMapasTesouro: 0,
        },
      });
    }

    // Buscar último ISJF
    const latestISJF = await prisma.iSJFHistory.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Buscar atividades completadas recentemente
    const recentActivities = await prisma.completedActivity.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 5,
      include: {
        activity: true,
      },
    });

    // Buscar badges conquistados recentemente
    const recentBadges = await prisma.userBadge.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
      take: 3,
      include: {
        badge: true,
      },
    });

    // Calcular missões diárias (baseado no progresso atual)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activitiesToday = await prisma.completedActivity.count({
      where: {
        userId,
        completedAt: {
          gte: today,
        },
      },
    });

    // XP ganho hoje
    const completedActivitiesToday = await prisma.completedActivity.findMany({
      where: {
        userId,
        completedAt: {
          gte: today,
        },
      },
      select: {
        pointsEarned: true,
      },
    });

    const xpToday = completedActivitiesToday.reduce((sum, activity) => sum + (activity.pointsEarned || 0), 0);

    const dailyMissions = [
      {
        id: 1,
        title: 'Complete uma atividade',
        progress: Math.min(activitiesToday, 1),
        target: 1,
        reward: 50,
        icon: '✅',
        completed: activitiesToday >= 1,
      },
      {
        id: 2,
        title: 'Ganhe 100 XP',
        progress: Math.min(xpToday, 100),
        target: 100,
        reward: 75,
        icon: '⭐',
        completed: xpToday >= 100,
      },
      {
        id: 3,
        title: 'Mantenha o streak',
        progress: userProgress.currentStreak,
        target: Math.max(userProgress.currentStreak + 1, 7),
        reward: 100,
        icon: '🔥',
        completed: false,
      },
    ];

    // Calcular XP para próximo nível
    const xpForNextLevel = userProgress.level * 500;

    return NextResponse.json({
      success: true,
      data: {
        userProgress: {
          xp: userProgress.xp,
          level: userProgress.level,
          currentStreak: userProgress.currentStreak,
          longestStreak: userProgress.longestStreak,
          totalActivitiesCompleted: userProgress.totalActivitiesCompleted,
          xpForNextLevel,
        },
        latestISJF: latestISJF
          ? {
              indiceISJF: latestISJF.indiceISJF,
              classificacao: latestISJF.classificacao,
              createdAt: latestISJF.createdAt,
            }
          : null,
        dailyMissions,
        recentActivities: recentActivities.map((ca) => ({
          id: ca.id,
          activityName: ca.activity.title,
          completedAt: ca.completedAt,
          pointsEarned: ca.pointsEarned,
        })),
        recentBadges: recentBadges.map((ub) => ({
          id: ub.id,
          badgeName: ub.badge.name,
          badgeIcon: ub.badge.icon,
          earnedAt: ub.earnedAt,
        })),
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do dashboard', details: error.message },
      { status: 500 }
    );
  }
}
