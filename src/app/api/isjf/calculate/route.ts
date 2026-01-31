import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calcularISJF, type RespostaObjetivo } from '@/lib/calculo-isjf';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

/**
 * POST /api/isjf/calculate
 * Calcula o ISJF completo a partir das 22 respostas do Mapa do Tesouro
 * 
 * Body:
 * {
 *   userId?: string,  // Opcional se autenticado
 *   respostas: RespostaObjetivo[]  // Array com 22 respostas
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId: bodyUserId, respostas } = body;

    // Validar respostas
    if (!respostas || !Array.isArray(respostas)) {
      return NextResponse.json(
        { error: 'Campo "respostas" é obrigatório e deve ser um array' },
        { status: 400 }
      );
    }

    if (respostas.length !== 22) {
      return NextResponse.json(
        { error: `Esperado 22 respostas, recebido ${respostas.length}` },
        { status: 400 }
      );
    }

    // Obter userId (de autenticação ou body)
    const session = await getServerSession();
    const userId = bodyUserId || (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório (autenticação ou body)' },
        { status: 401 }
      );
    }

    // 🚀 CALCULAR ISJF COMPLETO
    const resultado = calcularISJF(respostas as RespostaObjetivo[]);

    // Salvar no histórico
    const history = await prisma.iSJFHistory.create({
      data: {
        userId,
        indiceISJF: resultado.isjf,
        classificacao: resultado.classificacao,
        determinantes: {
          GAR: resultado.determinantes.GAR,
          HAB: resultado.determinantes.HAB,
          REC: resultado.determinantes.REC,
          RI: resultado.determinantes.RI,
          OP: resultado.determinantes.OP,
          UTIL: resultado.determinantes.UTIL,
        },
        variaveis: {
          M1: resultado.variaveis.M1,
          M2: resultado.variaveis.M2,
          M3: resultado.variaveis.M3,
          M4: resultado.variaveis.M4,
        },
        objetivos: resultado.objetivos.map(obj => ({
          id: obj.id,
          sigla: obj.sigla,
          ier: obj.ier,
          irb360: obj.irb360,
          tipo: obj.tipo,
        })),
      },
    });

    // Atualizar JornadaFinanceira com último ISJF
    await prisma.jornadaFinanceira.upsert({
      where: { userId },
      update: {
        ultimoISJF: resultado.isjf,
        classificacaoAtual: resultado.classificacao,
        ultimaAtualizacao: new Date(),
      },
      create: {
        userId,
        ultimoISJF: resultado.isjf,
        classificacaoAtual: resultado.classificacao,
      },
    });

    return NextResponse.json({
      success: true,
      isjf: resultado.isjf,
      classificacao: resultado.classificacao,
      determinantes: resultado.determinantes,
      variaveis: resultado.variaveis,
      restrictores: resultado.restrictores.map(r => ({
        id: r.id,
        sigla: r.sigla,
        assunto: r.assunto,
        ier: r.ier,
      })),
      facilitadores: resultado.facilitadores.map(f => ({
        id: f.id,
        sigla: f.sigla,
        assunto: f.assunto,
        ier: f.ier,
      })),
      historyId: history.id,
    });
  } catch (err: any) {
    console.error('Erro ao calcular ISJF:', err);
    return NextResponse.json(
      { error: 'Erro ao calcular ISJF', details: err.message },
      { status: 500 }
    );
  }
}
