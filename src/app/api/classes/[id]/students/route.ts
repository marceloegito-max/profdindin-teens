import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/classes/[id]/students - Adicionar teen à turma
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

    // ADMIN ou PROFESSOR podem adicionar alunos
    if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.PROFESSOR) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const body = await req.json();
    const { teenId } = body;
    const classId = params.id;

    if (!teenId) {
      return NextResponse.json(
        { error: 'teenId é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o teen existe e tem o role correto
    const teen = await prisma.user.findUnique({
      where: { id: teenId },
      select: { role: true }
    });

    if (!teen || teen.role !== UserRole.TEEN) {
      return NextResponse.json(
        { error: 'Usuário não é um aluno' },
        { status: 400 }
      );
    }

    // Verificar se já existe a vinculação
    const existing = await prisma.teenClass.findUnique({
      where: {
        teenId_classId: {
          teenId,
          classId
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Aluno já está vinculado a esta turma' },
        { status: 400 }
      );
    }

    const link = await prisma.teenClass.create({
      data: {
        teenId,
        classId
      },
      include: {
        teen: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json({ data: link }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao adicionar aluno:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar aluno', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/classes/[id]/students - Remover teen da turma
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

    if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.PROFESSOR) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const teenId = searchParams.get('teenId');
    const classId = params.id;

    if (!teenId) {
      return NextResponse.json(
        { error: 'teenId é obrigatório' },
        { status: 400 }
      );
    }

    await prisma.teenClass.delete({
      where: {
        teenId_classId: {
          teenId,
          classId
        }
      }
    });

    return NextResponse.json({ message: 'Aluno removido da turma com sucesso' });
  } catch (error: any) {
    console.error('Erro ao remover aluno:', error);
    return NextResponse.json(
      { error: 'Erro ao remover aluno', details: error.message },
      { status: 500 }
    );
  }
}
