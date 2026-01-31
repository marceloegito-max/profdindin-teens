import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/responsible/link - Vincular responsável a teen
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { teenId, relacao } = body;

    if (!teenId) {
      return NextResponse.json(
        { error: 'teenId é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o teen existe
    const teen = await prisma.user.findUnique({
      where: { id: teenId },
      select: { role: true, id: true }
    });

    if (!teen || teen.role !== UserRole.TEEN) {
      return NextResponse.json(
        { error: 'Usuário não é um teen' },
        { status: 400 }
      );
    }

    // Verificar se já existe vinculação
    const existing = await prisma.teenResponsible.findUnique({
      where: {
        teenId_responsibleId: {
          teenId,
          responsibleId: user.id
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Vinculação já existe' },
        { status: 400 }
      );
    }

    const link = await prisma.teenResponsible.create({
      data: {
        teenId,
        responsibleId: user.id,
        relacao: relacao || 'responsavel_legal',
        active: true
      },
      include: {
        teen: {
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
    console.error('Erro ao vincular teen:', error);
    return NextResponse.json(
      { error: 'Erro ao vincular teen', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/responsible/link - Desvincular teen
export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const teenId = searchParams.get('teenId');

    if (!teenId) {
      return NextResponse.json(
        { error: 'teenId é obrigatório' },
        { status: 400 }
      );
    }

    await prisma.teenResponsible.delete({
      where: {
        teenId_responsibleId: {
          teenId,
          responsibleId: user.id
        }
      }
    });

    return NextResponse.json({ message: 'Vinculação removida com sucesso' });
  } catch (error: any) {
    console.error('Erro ao desvincular teen:', error);
    return NextResponse.json(
      { error: 'Erro ao desvincular teen', details: error.message },
      { status: 500 }
    );
  }
}
