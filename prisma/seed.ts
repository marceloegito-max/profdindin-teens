import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o Seed...');

  // --- Ler JSON de atividades ---
  const jsonPath = join(process.cwd(), 'prisma', 'BANCO_ATIVIDADES_TEENS.json');
  const raw = readFileSync(jsonPath, 'utf-8');
  const db = JSON.parse(raw);

  // --- 1) Agentes Estressores ---
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
      update: { description: s.description, icon: s.icon, category: s.category },
      create: s,
    });
  }
  console.log('✅ Agentes estressores criados/atualizados.');

  // --- 2) Atividades ---
  const atividades = (db.atividades || []).map((a: any) => ({
    codigo: a.codigo,
    modulo: a.modulo,
    nome: a.nome,
    objetivo: a.objetivo,
    pontos: a.pontos ?? 0,
    prazoSugerido: a.prazoSugerido ?? a.duracao ?? null,
    prerequisitos: a.prerequisitos ?? [],
    ferramenta: a.ferramenta ?? null,
    criteriosSucesso: a.criteriosSucesso ?? [],
    modelosReferencia: a.modelosReferencia ?? [],
    impactoJornada: a.impactoJornada ?? null,
    tarefas: a.tarefas ?? [],
  }));

  for (const act of atividades) {
    await prisma.activity.upsert({
      where: { codigo: act.codigo },
      update: {
        modulo: act.modulo,
        nome: act.nome,
        objetivo: act.objetivo,
        pontos: act.pontos,
        prazoSugerido: act.prazoSugerido,
        prerequisitos: act.prerequisitos,
        ferramenta: act.ferramenta,
        criteriosSucesso: act.criteriosSucesso,
        modelosReferencia: act.modelosReferencia,
        impactoJornada: act.impactoJornada,
        tarefas: act.tarefas,
      },
      create: act,
    });
  }
  console.log(`✅ ${atividades.length} atividades criadas/atualizadas.`);

  // --- 3) Badges iniciais ---
  const badges = [
    { nome: 'Primeiros Passos', descricao: 'Iniciou a jornada.', icone: '🌱' },
    { nome: 'Mestre do Poupar', descricao: 'Economizou o primeiro real.', icone: '🐷' },
    { nome: 'Antifrágil', descricao: 'Superou um teste de estresse financeiro.', icone: '🛡️' },
  ];

  for (const b of badges) {
    await prisma.badge.upsert({
      where: { nome: b.nome },
      update: b,
      create: b,
    });
  }
  console.log('✅ Badges criadas/atualizadas.');

  console.log('🚀 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
