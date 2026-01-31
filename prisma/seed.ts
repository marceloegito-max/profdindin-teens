import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o Seed...');

  // --- Ler JSON de atividades (assume prisma/BANCO_ATIVIDADES_TEENS.json) ---
  const jsonPath = join(process.cwd(), 'prisma', 'BANCO_ATIVIDADES_TEENS.json');
  const raw = readFileSync(jsonPath, 'utf-8');
  const db = JSON.parse(raw);

  // --- 1) Agentes Estressores (upsert para serem idempotentes) ---
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

  // --- 2) Atividades (upsert por código) ---
  const atividades = (db.atividades || []).map((a: any) => ({
    code: a.codigo,
    module: a.modulo,
    title: a.nome,
    objective: a.objetivo,
    xpReward: a.pontos ?? 0,
    duration: a.prazoSugerido ?? a.duracao ?? null,
    prerequisites: a.prerequisitos ?? [],
    tools: a.ferramenta ?? null,
    successCriteria: a.criteriosSucesso ?? [],
    models: a.modelosReferencia ?? [],
    impact: a.impactoJornada ?? null,
    // Armazenamos tarefas como JSON (array de objetos)
    tasks: a.tarefas ?? [],
  }));

  for (const act of atividades) {
    await prisma.activity.upsert({
      where: { code: act.code },
      update: {
        module: act.module,
        title: act.nome,
        objective: act.objective,
        xpReward: act.xpReward,
        duration: act.duration,
        prerequisites: act.prerequisites,
        tools: act.tools,
        successCriteria: act.successCriteria,
        models: act.models,
        impact: act.impact,
        tasks: act.tasks,
      },
      create: act,
    });
  }
  console.log(`✅ ${atividades.length} atividades criadas/atualizadas.`);

  // --- 3) Badges iniciais (upsert) ---
  const badges = [
    { name: 'Primeiros Passos', description: 'Iniciou a jornada.', icon: 'seedling' },
    { name: 'Mestre do Poupar', description: 'Economizou o primeiro real.', icon: 'piggy-bank' },
    { name: 'Antifrágil', description: 'Superou um teste de estresse financeiro.', icon: 'shield' },
  ];

  for (const b of badges) {
    await prisma.badge.upsert({
      where: { name: b.name },
      update: b,
      create: b,
    });
  }
  console.log('✅ Badges criadas/atualizadas.');

  // --- 4) Usuário Admin (upsert) ---
  await prisma.user.upsert({
    where: { email: 'marcelo.egito@gmail.com' },
    update: { name: 'Marcelo Admin' },
    create: {
      email: 'marcelo.egito@gmail.com',
      name: 'Marcelo Admin',
      // adicione campos obrigatórios do seu schema caso existam (ex: role)
      // role: 'ADMIN',
    },
  });
  console.log('✅ Admin criado/atualizado.');

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
