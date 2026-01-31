import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { 
  gerarRecomendacoesTeens,
  gerarRecomendacaoISJF,
  gerarRecomendacaoCheckup,
  type PerfilTeen 
} from '@/lib/motor-recomendacoes';
import { calcularISJF, type RespostaObjetivo } from '@/lib/calculo-isjf';

const prisma = new PrismaClient();

/**
 * POST /api/recomendacoes
 * Gera recomendações personalizadas para o teen
 * 
 * Body:
 * {
 *   userId?: string,
 *   modulo: 'checkup' | 'raio-x' | 'mapa-tesouro',
 *   dados: any
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId: bodyUserId, modulo, dados } = body;

    if (!modulo || !['checkup', 'raio-x', 'mapa-tesouro'].includes(modulo)) {
      return NextResponse.json(
        { error: 'Módulo inválido' },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    const userId = bodyUserId || (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { teenProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const teen: PerfilTeen = {
      idade: user.teenProfile?.age || undefined,
      rendaMensal: user.teenProfile?.monthlyIncome || undefined,
      fonteRenda: user.teenProfile?.incomeSource || undefined,
      metaPrincipal: user.teenProfile?.mainGoal || undefined,
      arquetipo: user.teenProfile?.archetype || undefined,
      perfilRisco: user.teenProfile?.riskProfile || undefined,
      cidade: user.teenProfile?.cidade || undefined,
    };

    let recomendacao;

    if (modulo === 'mapa-tesouro') {
      if (dados?.respostas) {
        const resultadoISJF = calcularISJF(dados.respostas as RespostaObjetivo[]);
        recomendacao = await gerarRecomendacaoISJF(teen, resultadoISJF);
      } else if (dados?.isjf) {
        recomendacao = await gerarRecomendacoesTeens({
          modulo: 'mapa-tesouro',
          teen,
          resultadoISJF: dados.isjf,
        });
      } else {
        return NextResponse.json(
          { error: 'Para mapa-tesouro, forneça "respostas" ou "isjf"' },
          { status: 400 }
        );
      }
    } else if (modulo === 'checkup') {
      if (!dados?.agenteEstressor) {
        return NextResponse.json(
          { error: 'Para checkup, forneça "agenteEstressor"' },
          { status: 400 }
        );
      }
      recomendacao = await gerarRecomendacaoCheckup(teen, dados.agenteEstressor);
    } else {
      recomendacao = await gerarRecomendacoesTeens({
        modulo: 'raio-x',
        teen,
        perfilPsicoFinanceiro: dados?.perfilPsicoFinanceiro,
      });
    }

    return NextResponse.json({
      success: true,
      recomendacao,
    });
  } catch (err: any) {
    console.error('Erro ao gerar recomendações:', err);
    return NextResponse.json(
      { error: 'Erro ao gerar recomendações', details: err.message },
      { status: 500 }
    );
  }
}
