import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Buscar progresso do usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        userProgress: true,
        userBadges: {
          include: {
            badge: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Buscar todos os badges disponíveis
    const allBadges = await prisma.badge.findMany({
      orderBy: [
        { category: 'asc' },
        { requiredValue: 'asc' },
      ],
    });

    // Mapear badges com status de unlock
    const userBadgeIds = new Set(user.userBadges.map(ub => ub.badgeId));
    const badgesWithProgress = allBadges.map(badge => {
      const unlocked = userBadgeIds.has(badge.id);
      let progress = 0;

      if (!unlocked && user.userProgress) {
        // Calcular progresso baseado no criteria do badge
        const up = user.userProgress;
        
        if (badge.criteria === 'ACTIVITIES_COMPLETED') {
          progress = (up.totalActivitiesCompleted / badge.requiredValue) * 100;
        } else if (badge.criteria === 'STREAK_DAYS') {
          progress = (up.currentStreak / badge.requiredValue) * 100;
        } else if (badge.criteria === 'LEVEL_REACHED') {
          progress = (up.level / badge.requiredValue) * 100;
        } else if (badge.criteria === 'XP_EARNED') {
          progress = (up.xp / badge.requiredValue) * 100;
        }

        progress = Math.min(progress, 100);
      }

      return {
        ...badge,
        unlocked,
        progress: !unlocked ? progress : undefined,
      };
    });

    // Calcular XP necessário para próximo nível
    const currentLevel = user.userProgress?.level || 1;
    const currentXP = user.userProgress?.xp || 0;
    const xpForNextLevel = currentLevel * 1000; // Fórmula simples: nível * 1000

    const userProgress = {
      level: currentLevel,
      currentXP: currentXP % xpForNextLevel,
      xpForNextLevel,
      streakDays: user.userProgress?.currentStreak || 0,
      lastActivityDate: user.userProgress?.lastActiveDate || new Date(),
      totalBadges: allBadges.length,
      unlockedBadges: user.userBadges.length,
    };

    return NextResponse.json({
      badges: badgesWithProgress,
      userProgress,
    });
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar conquistas' },
      { status: 500 }
    );
  }
}
