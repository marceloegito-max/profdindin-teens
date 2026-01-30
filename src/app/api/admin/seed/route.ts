import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const jsonPath = join(process.cwd(), 'prisma', 'BANCO_ATIVIDADES_TEENS.json');
    const raw = readFileSync(jsonPath, 'utf-8');
    const db = JSON.parse(raw);

    // Agentes estressores
    const stressores = [
      { name: 'Ansiedade do Agora', icon: 'clock', category: 'emocional', description: 'Desejo imediato de consumo sem pensar no amanhã.' },
      { name: 'Pressão do Grupo', icon: 'users', category: 'social', description: 'Gastar para se sentir aceito pelos amigos.' },
      { name: 'Medo de Perder (FOMO)', icon: 'alert-circle', category: 'emocional', description: 'Medo de ficar de fora de tendências ou eventos.' },
      { name: 'Desejo de Status', icon: 'award', category: 'social', description: 'Comprar itens para demonstrar poder ou riqueza.' },
      { name: 'Falta de Limites', icon: 'slash', category: 'comportamental', description: 'Dificuldade em dizer não para si mesmo.' },
      { name: 'Imediatismo', icon: 'zap', category: 'comportamental', description: 'Busca por prazer rápido ignorando metas de longo prazo.' },
      { name: 'Comparação Social', icon: 'eye', category: 'social', description: 'Sentir-se inferior ao ver a vida (editada) dos outros.' },
      { name: 'Publicidade Agressiva', icon: 'megaphone', category: 'externo', description: 'Cair em gatilhos de marketing e promoções falsas.' },
      { name: 'Desorganização', icon: 'shuffle', category: 'comportamental', description: 'Não saber para onde o dinheiro está indo.' },
      { name: 'Insegurança', icon: 'shield-off', category: 'emocional', description: 'Comprar para tentar preencher vazios emocionais.' },
      { name: 'Impulsividade', icon: 'trending-up', category: 'comportamental', description: 'Agir sem refletir, especialmente em compras online.' },
      { name: 'Falta de Propósito', icon: 'compass', category: 'emocional', description: 'Gastar por gastar, sem ter um sonho ou meta clara.' },
    ];

    for (const s of stressores) {
      await prisma.stressorAgent.upsert({
        where: { name: s.name },
        update: {
          description: s.description,
          icon: s.icon,
          category: s.category,
        },
        create: s,
      });
    }

    // Atividades
    for (const a of db.atividades) {
      await prisma.activity.upsert({
        where: { code: a.codigo },
        update: {
          name: a.nome,
          points: a.pontos,
        },
        create: {
          code: a.codigo,
          module: a.modulo,
          name: a.nome,
          objective: a.objetivo,
          tasks: a.tarefas,
          tools: a.ferramenta ?? {},
          successCriteria: a.criteriosSucesso ?? {},
          referenceModels: a.modelosReferencia ?? {},
          impact: a.impactoJornada ?? '',
          points: a.pontos,
          suggestedDuration: a.prazoSugerido ?? '',
          prerequisites: a.prerequisitos ?? [],
          coreDrives: [],
        },
      });
    }

    return NextResponse.json({
      ok: true,
      message: '✅ Seed executado com sucesso',
      atividades: db.atividades.length,
      stressores: stressores.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
