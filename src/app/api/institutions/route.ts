import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/institutions - Listar instituições
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { role: true }
    });

    // Apenas ADMIN pode listar instituições
    if (user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const institutions = await prisma.educationalInstitution.findMany({
      include: {
        classes: {
          include: {
            _count: {
              select: { teens: true, professors: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ data: institutions });
  } catch (error: any) {
    console.error('Erro ao listar instituições:', error);
    return NextResponse.json(
      { error: 'Erro ao listar instituições', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/institutions - Criar instituição (apenas ADMIN)
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { nome, tipo, cidade, estado } = body;

    if (!nome || !tipo) {
      return NextResponse.json(
        { error: 'Nome e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    const institution = await prisma.educationalInstitution.create({
      data: { nome, tipo, cidade, estado }
    });

    return NextResponse.json({ data: institution }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar instituição:', error);
    return NextResponse.json(
      { error: 'Erro ao criar instituição', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/institutions - Atualizar instituição
export async function PUT(req: NextRequest) {
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

    const body = await req.json();
    const { id, nome, tipo, cidade, estado, active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const institution = await prisma.educationalInstitution.update({
      where: { id },
      data: { nome, tipo, cidade, estado, active }
    });

    return NextResponse.json({ data: institution });
  } catch (error: any) {
    console.error('Erro ao atualizar instituição:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar instituição', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/institutions - Remover instituição
export async function DELETE(req: NextRequest) {
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    await prisma.educationalInstitution.delete({ where: { id } });

    return NextResponse.json({ message: 'Instituição removida com sucesso' });
  } catch (error: any) {
    console.error('Erro ao remover instituição:', error);
    return NextResponse.json(
      { error: 'Erro ao remover instituição', details: error.message },
      { status: 500 }
    );
  }
}
