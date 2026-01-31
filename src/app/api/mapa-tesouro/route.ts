import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Objetivo {
  id?: string;
  titulo: string;
  valor: number;
  prazo: number;
  prioridade: string;
  categoria: string;
}

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
    const { objetivos, rendaMensal, gastosFixos, economiaMensal, disponivel }: {
      objetivos: Objetivo[];
      rendaMensal: number;
      gastosFixos: number;
      economiaMensal: number;
      disponivel: number;
    } = body;

    // Salvar objetivos no banco
    // TODO: Criar modelo FinancialGoal no schema.prisma
    // Por enquanto, apenas salvamos os dados financeiros básicos no perfil
    const objetivosSalvos = objetivos.map((objetivo, index) => ({
      id: `temp-${Date.now()}-${index}`,
      ...objetivo,
    }));

    // Atualizar dados financeiros do perfil
    await prisma.teenProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        monthlyIncome: rendaMensal,
        // TODO: Adicionar campo monthlyExpenses ao schema
      },
      update: {
        monthlyIncome: rendaMensal,
        // TODO: Adicionar campo monthlyExpenses ao schema
      },
    });

    // Atualizar progresso do usuário
    const xpGanho = 200;
    await prisma.userProgress.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        xp: xpGanho,
        totalMapasTesouro: 1,
      },
      update: {
        xp: { increment: xpGanho },
        totalMapasTesouro: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      objetivos: objetivosSalvos,
      xpGanho,
      economiaMensal,
      disponivel,
    });
  } catch (error) {
    console.error('Erro ao salvar Mapa do Tesouro:', error);
    return NextResponse.json(
      { error: 'Erro ao processar Mapa do Tesouro' },
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

    // Buscar dados financeiros do perfil
    const perfil = await prisma.teenProfile.findUnique({
      where: { userId: session.user.id },
    });

    // TODO: Buscar objetivos quando o modelo FinancialGoal for criado
    const objetivos: any[] = [];

    return NextResponse.json({
      objetivos,
      perfil,
    });
  } catch (error) {
    console.error('Erro ao buscar Mapa do Tesouro:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar Mapa do Tesouro' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { objetivoId, novoValor } = body;

    // TODO: Implementar quando o modelo FinancialGoal for criado
    return NextResponse.json({
      success: true,
      message: 'Funcionalidade em desenvolvimento',
    });
  } catch (error) {
    console.error('Erro ao atualizar objetivo:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar objetivo' },
      { status: 500 }
    );
  }
}
