import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/classes - Listar turmas (filtrar por instituição)
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

    const { searchParams } = new URL(req.url);
    const institutionId = searchParams.get('institutionId');

    let classes;

    // Se for PROFESSOR, retorna apenas suas turmas
    if (user?.role === UserRole.PROFESSOR) {
      classes = await prisma.class.findMany({
        where: {
          professors: {
            some: { professorId: user.id }
          },
          ...(institutionId && { institutionId })
        },
        include: {
          institution: true,
          _count: {
            select: { teens: true, professors: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // ADMIN vê todas
      classes = await prisma.class.findMany({
        where: institutionId ? { institutionId } : undefined,
        include: {
          institution: true,
          _count: {
            select: { teens: true, professors: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({ data: classes });
  } catch (error: any) {
    console.error('Erro ao listar turmas:', error);
    return NextResponse.json(
      { error: 'Erro ao listar turmas', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/classes - Criar turma
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

    // Apenas ADMIN e PROFESSOR podem criar turmas
    if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.PROFESSOR) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const body = await req.json();
    const { nome, codigo, descricao, institutionId, anoLetivo, turno } = body;

    if (!nome || !codigo) {
      return NextResponse.json(
        { error: 'Nome e código são obrigatórios' },
        { status: 400 }
      );
    }

    const classData = await prisma.class.create({
      data: {
        nome,
        codigo,
        descricao,
        institutionId,
        anoLetivo,
        turno
      },
      include: { institution: true }
    });

    return NextResponse.json({ data: classData }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar turma:', error);
    return NextResponse.json(
      { error: 'Erro ao criar turma', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/classes - Atualizar turma
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

    if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.PROFESSOR) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const body = await req.json();
    const { id, nome, codigo, descricao, anoLetivo, turno, active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const classData = await prisma.class.update({
      where: { id },
      data: { nome, codigo, descricao, anoLetivo, turno, active }
    });

    return NextResponse.json({ data: classData });
  } catch (error: any) {
    console.error('Erro ao atualizar turma:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar turma', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/classes - Remover turma
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

    await prisma.class.delete({ where: { id } });

    return NextResponse.json({ message: 'Turma removida com sucesso' });
  } catch (error: any) {
    console.error('Erro ao remover turma:', error);
    return NextResponse.json(
      { error: 'Erro ao remover turma', details: error.message },
      { status: 500 }
    );
  }
}
