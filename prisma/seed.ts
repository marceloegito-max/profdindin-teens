import { PrismaClient, ActivityModule, CoreDrive } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  const jsonPath = join(process.cwd(), 'prisma', 'BANCO_ATIVIDADES_TEENS.json');
  const raw = readFileSync(jsonPath, 'utf-8');
  const db = JSON.parse(raw);

  /* =========================
     1. Stressor Agents
  ========================== */
  const stressores = [
    { name: 'Ansiedade do Agora', icon: 'clock', category: 'emocional', description: 'Desejo imediato de consumo.' },
    { name: 'Pressão do Grupo', icon: 'users', category: 'social', description: 'Gastar para se sentir aceito.' },
    { name: 'FOMO', icon: 'alert-circle', category: 'emocional', description: 'Medo de perder algo.' },
  ];

  for (const s of stressores) {
    await prisma.stressorAgent.upsert({
      where: { name: s.name },
      update: s,
      create: s,
    });
  }

  console.log('✅ StressorAgents criados');

  /* =========================
     2. Activities
  ========================== */
  for (const a of db.atividades) {
    await prisma.activity.upsert({
      where: { code: a.codigo },
      update: {
        module: a.modulo as ActivityModule,
        name: a.nome,
        objective: a.objetivo,
        tasks: a.tarefas,
        tools: a.ferramenta ?? {},
        successCriteria: a.criteriosSucesso ?? [],
        referenceModels: a.modelosReferencia ?? [],
        impact: a.impactoJornada ?? '',
        points: a.pontos ?? 0,
        suggestedDuration: a.prazoSugerido ?? '',
        prerequisites: a.prerequisitos ?? [],
        coreDrives: [],
      },
      create: {
        code: a.codigo,
        module: a.modulo as ActivityModule,
        name: a.nome,
        objective: a.objetivo,
        tasks: a.tarefas,
        tools: a.ferramenta ?? {},
        successCriteria: a.criteriosSucesso ?? [],
        referenceModels: a.modelosReferencia ?? [],
        impact: a.impactoJornada ?? '',
        points: a.pontos ?? 0,
        suggestedDuration: a.prazoSugerido ?? '',
        prerequisites: a.prerequisitos ?? [],
        coreDrives: [],
      },
    });
  }

  console.log('✅ Activities criadas');

  /* =========================
     3. Badges
  ========================== */
  const badges = [
    {
      name: 'Primeiros Passos',
      description: 'Completou a primeira atividade',
      icon: '🌱',
      criteria: 'COMPLETE_ACTIVITIES',
      requiredValue: 1,
    },
  ];

  for (const b of badges) {
    await prisma.badge.upsert({
      where: { name: b.name },
      update: b,
      create: b,
    });
  }

  console.log('✅ Badges criados');
  console.log('🎉 Seed finalizado com sucesso');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
