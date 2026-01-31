import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { respostas, agentesIdentificados } = body;

    // Salvar respostas do Check-up
    const checkupData = {
      userId: session.user.id,
      respostas: respostas,
      agentesIdentificados: agentesIdentificados,
      completedAt: new Date(),
    };

    // Salvar estressores no banco
    // Nota: Por enquanto, salvamos no CheckupTest ao invés de StressorAssessment
    // pois o modelo atual precisa de stressorId (referência a StressorAgent)
    // TODO: Criar StressorAgents primeiro e depois vincular aqui

    // Atualizar progresso do usuário
    const xpGanho = 100;
    await prisma.userProgress.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        xp: xpGanho,
        totalCheckups: 1,
      },
      update: {
        xp: { increment: xpGanho },
        totalCheckups: { increment: 1 },
      },
    });

    // Buscar atividades sugeridas baseadas nos estressores
    const atividadesSugeridas = await prisma.activity.findMany({
      where: {
        module: 'CHECKUP',
      },
      take: 3,
    });

    return NextResponse.json({
      success: true,
      agentesIdentificados,
      xpGanho,
      atividadesSugeridas,
    });
  } catch (error) {
    console.error('Erro ao salvar Check-up:', error);
    return NextResponse.json(
      { error: 'Erro ao processar Check-up' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar últimos estressores do usuário
    const estressores = await prisma.stressorAssessment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      estressores,
    });
  } catch (error) {
    console.error('Erro ao buscar Check-up:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar Check-up' },
      { status: 500 }
    );
  }
}
