import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/responsible/teens - Teens vinculados ao responsável
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

    if (user?.role !== UserRole.RESPONSIBLE && user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const teens = await prisma.teenResponsible.findMany({
      where: {
        responsibleId: user.id,
        active: true
      },
      include: {
        teen: {
          include: {
            teenProfile: true,
            userProgress: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Buscar último ISJF de cada teen
    const teensWithISJF = await Promise.all(
      teens.map(async (tr) => {
        const latestISJF = await prisma.iSJFHistory.findFirst({
          where: { userId: tr.teen.id },
          orderBy: { createdAt: 'desc' }
        });

        const totalActivities = await prisma.completedActivity.count({
          where: { userId: tr.teen.id }
        });

        return {
          ...tr.teen,
          relacao: tr.relacao,
          latestISJF,
          totalActivities
        };
      })
    );

    return NextResponse.json({ data: teensWithISJF });
  } catch (error: any) {
    console.error('Erro ao buscar teens:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar teens', details: error.message },
      { status: 500 }
    );
  }
}
