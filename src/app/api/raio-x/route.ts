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
    const { respostas, arquetipoDominante, pontuacoes } = body;

    // Mapear arquétipo para o enum do Prisma
    const arquetipoMap: Record<string, string> = {
      GASTADOR: 'GASTADOR',
      POUPADOR: 'POUPADOR',
      EQUILIBRADO: 'EQUILIBRADO',
      INVESTIDOR: 'INVESTIDOR',
    };

    // Atualizar perfil do teen
    await prisma.teenProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        archetype: arquetipoMap[arquetipoDominante] as any,
      },
      update: {
        archetype: arquetipoMap[arquetipoDominante] as any,
      },
    });

    // Gerar recomendação personalizada
    // TODO: Implementar integração com motor de recomendações IA
    const recomendacao = {
      perfilPsicoFinanceiro: `Você tem um perfil ${arquetipoDominante}, o que significa que você tem tendências únicas na sua relação com dinheiro. Continue explorando atividades para desenvolver seus pontos fortes e trabalhar suas áreas de melhoria.`,
    };

    // Atualizar progresso do usuário
    const xpGanho = 150;
    await prisma.userProgress.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        xp: xpGanho,
        totalRaioX: 1,
      },
      update: {
        xp: { increment: xpGanho },
        totalRaioX: { increment: 1 },
      },
    });

    // Buscar atividades sugeridas
    const atividadesSugeridas = await prisma.activity.findMany({
      where: {
        module: 'RAIO_X',
      },
      take: 3,
    });

    return NextResponse.json({
      success: true,
      arquetipoDominante,
      recomendacao,
      xpGanho,
      atividadesSugeridas,
    });
  } catch (error) {
    console.error('Erro ao salvar Raio-X:', error);
    return NextResponse.json(
      { error: 'Erro ao processar Raio-X' },
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

    // Buscar perfil do teen
    const perfil = await prisma.teenProfile.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      perfil,
    });
  } catch (error) {
    console.error('Erro ao buscar Raio-X:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar Raio-X' },
      { status: 500 }
    );
  }
}
