import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/classes/[id] - Detalhes da turma com lista de alunos
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { role: true, id: true }
    });

    const classId = params.id;

    // Se for PROFESSOR, verifica se gerencia essa turma
    if (user?.role === UserRole.PROFESSOR) {
      const manages = await prisma.professorClass.findUnique({
        where: {
          professorId_classId: {
            professorId: user.id,
            classId
          }
        }
      });

      if (!manages) {
        return NextResponse.json(
          { error: 'Você não gerencia esta turma' },
          { status: 403 }
        );
      }
    }

    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        institution: true,
        professors: {
          include: {
            professor: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        teens: {
          include: {
            teen: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                teenProfile: true,
                userProgress: true
              }
            }
          }
        }
      }
    });

    if (!classData) {
      return NextResponse.json({ error: 'Turma não encontrada' }, { status: 404 });
    }

    // Buscar último ISJF de cada aluno
    const teensWithISJF = await Promise.all(
      classData.teens.map(async (tc) => {
        const latestISJF = await prisma.iSJFHistory.findFirst({
          where: { userId: tc.teen.id },
          orderBy: { createdAt: 'desc' }
        });

        return {
          ...tc.teen,
          latestISJF
        };
      })
    );

    return NextResponse.json({
      data: {
        ...classData,
        teensWithISJF
      }
    });
  } catch (error: any) {
    console.error('Erro ao buscar detalhes da turma:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar detalhes da turma', details: error.message },
      { status: 500 }
    );
  }
}
