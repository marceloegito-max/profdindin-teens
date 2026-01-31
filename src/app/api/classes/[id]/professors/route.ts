import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/classes/[id]/professors - Adicionar professor à turma
export async function POST(
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
      select: { role: true }
    });

    // Apenas ADMIN pode adicionar professores
    if (user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const body = await req.json();
    const { professorId, isPrimary } = body;
    const classId = params.id;

    if (!professorId) {
      return NextResponse.json(
        { error: 'professorId é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o professor existe e tem o role correto
    const professor = await prisma.user.findUnique({
      where: { id: professorId },
      select: { role: true }
    });

    if (!professor || professor.role !== UserRole.PROFESSOR) {
      return NextResponse.json(
        { error: 'Usuário não é um professor' },
        { status: 400 }
      );
    }

    // Verificar se já existe a vinculação
    const existing = await prisma.professorClass.findUnique({
      where: {
        professorId_classId: {
          professorId,
          classId
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Professor já está vinculado a esta turma' },
        { status: 400 }
      );
    }

    const link = await prisma.professorClass.create({
      data: {
        professorId,
        classId,
        isPrimary: isPrimary || false
      },
      include: {
        professor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ data: link }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao adicionar professor:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar professor', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/classes/[id]/professors - Remover professor da turma
export async function DELETE(
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
      select: { role: true }
    });

    if (user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const professorId = searchParams.get('professorId');
    const classId = params.id;

    if (!professorId) {
      return NextResponse.json(
        { error: 'professorId é obrigatório' },
        { status: 400 }
      );
    }

    await prisma.professorClass.delete({
      where: {
        professorId_classId: {
          professorId,
          classId
        }
      }
    });

    return NextResponse.json({ message: 'Professor removido da turma com sucesso' });
  } catch (error: any) {
    console.error('Erro ao remover professor:', error);
    return NextResponse.json(
      { error: 'Erro ao remover professor', details: error.message },
      { status: 500 }
    );
  }
}
