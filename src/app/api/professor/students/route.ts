import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/professor/students - Alunos do professor
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

    // Buscar todas as turmas do professor
    const professorClasses = await prisma.professorClass.findMany({
      where: { professorId: user.id },
      select: { classId: true }
    });

    const classIds = professorClasses.map((pc) => pc.classId);

    // Buscar teens dessas turmas (ou filtrar por classId específico)
    const teens = await prisma.teenClass.findMany({
      where: {
        classId: classId ? classId : { in: classIds }
      },
      include: {
        teen: {
          include: {
            teenProfile: true,
            userProgress: true
          }
        },
        class: {
          select: {
            id: true,
            nome: true,
            codigo: true
          }
        }
      }
    });

    // Buscar último ISJF de cada teen
    const teensWithISJF = await Promise.all(
      teens.map(async (tc) => {
        const latestISJF = await prisma.iSJFHistory.findFirst({
          where: { userId: tc.teen.id },
          orderBy: { createdAt: 'desc' }
        });

        const totalActivities = await prisma.completedActivity.count({
          where: { userId: tc.teen.id }
        });

        return {
          ...tc.teen,
          class: tc.class,
          latestISJF,
          totalActivities
        };
      })
    );

    return NextResponse.json({ data: teensWithISJF });
  } catch (error: any) {
    console.error('Erro ao buscar alunos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar alunos', details: error.message },
      { status: 500 }
    );
  }
}
