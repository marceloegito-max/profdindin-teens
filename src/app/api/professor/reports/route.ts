import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/professor/reports - Gerar relatórios
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { role: true, id: true }
    });

    if (user?.role !== UserRole.PROFESSOR && user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const teenId = searchParams.get('teenId');

    // Buscar turmas do professor
    const professorClasses = await prisma.professorClass.findMany({
      where: { professorId: user.id },
      select: { classId: true }
    });

    const classIds = professorClasses.map((pc) => pc.classId);

    // Relatório por turma
    if (classId && !teenId) {
      if (!classIds.includes(classId)) {
        return NextResponse.json(
          { error: 'Você não gerencia esta turma' },
          { status: 403 }
        );
      }

      const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
          teens: {
            include: {
              teen: {
                include: {
                  userProgress: true,
                  teenProfile: true
                }
              }
            }
          }
        }
      });

      if (!classData) {
        return NextResponse.json({ error: 'Turma não encontrada' }, { status: 404 });
      }

      // Calcular estatísticas da turma
      const teenIds = classData.teens.map((tc) => tc.teen.id);
      
      const isjfHistory = await Promise.all(
        teenIds.map(async (id) => {
          const latest = await prisma.iSJFHistory.findFirst({
            where: { userId: id },
            orderBy: { createdAt: 'desc' }
          });
          return latest;
        })
      );

      const validISJF = isjfHistory.filter((h) => h !== null);
      const avgISJF = validISJF.length > 0
        ? validISJF.reduce((acc, h) => acc + (h?.indiceISJF || 0), 0) / validISJF.length
        : 0;

      const totalActivities = await prisma.completedActivity.count({
        where: { userId: { in: teenIds } }
      });

      return NextResponse.json({
        data: {
          class: classData,
          stats: {
            totalTeens: teenIds.length,
            avgISJF,
            totalActivities,
            isjfDistribution: validISJF.map((h) => ({
              userId: h?.userId,
              isjf: h?.indiceISJF,
              classificacao: h?.classificacao
            }))
          }
        }
      });
    }

    // Relatório individual
    if (teenId) {
      // Verificar se o teen está em uma das turmas do professor
      const teenClass = await prisma.teenClass.findFirst({
        where: {
          teenId,
          classId: { in: classIds }
        }
      });

      if (!teenClass) {
        return NextResponse.json(
          { error: 'Você não é professor deste aluno' },
          { status: 403 }
        );
      }

      const teen = await prisma.user.findUnique({
        where: { id: teenId },
        include: {
          teenProfile: true,
          userProgress: true,
          completedActivities: {
            include: {
              activity: true
            },
            orderBy: { completedAt: 'desc' }
          }
        }
      });

      const isjfHistory = await prisma.iSJFHistory.findMany({
        where: { userId: teenId },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      return NextResponse.json({
        data: {
          teen,
          isjfHistory,
          totalActivities: teen?.completedActivities.length || 0
        }
      });
    }

    // Relatório geral (todas as turmas)
    const allTeens = await prisma.teenClass.findMany({
      where: { classId: { in: classIds } },
      include: {
        teen: {
          include: {
            userProgress: true
          }
        }
      }
    });

    const totalTeens = allTeens.length;
    const totalXP = allTeens.reduce((acc, tc) => acc + (tc.teen.userProgress?.xp || 0), 0);

    return NextResponse.json({
      data: {
        totalTeens,
        totalClasses: classIds.length,
        avgXP: totalTeens > 0 ? totalXP / totalTeens : 0
      }
    });
  } catch (error: any) {
    console.error('Erro ao gerar relatório:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatório', details: error.message },
      { status: 500 }
    );
  }
}
