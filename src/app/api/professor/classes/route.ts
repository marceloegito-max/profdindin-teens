import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/professor/classes - Turmas do professor
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

    const classes = await prisma.professorClass.findMany({
      where: { professorId: user.id },
      include: {
        class: {
          include: {
            institution: true,
            _count: {
              select: { teens: true }
            },
            teens: {
              include: {
                teen: {
                  select: {
                    id: true,
                    name: true,
                    userProgress: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Buscar média do ISJF de cada turma
    const classesWithStats = await Promise.all(
      classes.map(async (pc) => {
        const teenIds = pc.class.teens.map((tc) => tc.teen.id);
        
        // Buscar último ISJF de cada teen
        const isjfData = await Promise.all(
          teenIds.map(async (teenId) => {
            const latest = await prisma.iSJFHistory.findFirst({
              where: { userId: teenId },
              orderBy: { createdAt: 'desc' },
              select: { indiceISJF: true }
            });
            return latest?.indiceISJF || null;
          })
        );

        const validISJF = isjfData.filter((v): v is number => v !== null);
        const avgISJF = validISJF.length > 0
          ? validISJF.reduce((a, b) => a + b, 0) / validISJF.length
          : null;

        return {
          ...pc,
          avgISJF,
          totalTeens: pc.class.teens.length
        };
      })
    );

    return NextResponse.json({ data: classesWithStats });
  } catch (error: any) {
    console.error('Erro ao buscar turmas do professor:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar turmas', details: error.message },
      { status: 500 }
    );
  }
}
