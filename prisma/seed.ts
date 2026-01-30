import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o Seed...');

  // 1. Limpar dados para evitar duplicatas
  await prisma.completedActivity.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.stressorAgent.deleteMany({});
  await prisma.badge.deleteMany({});

  // 2. Criar os 12 Agentes Estressores
  const stressores = [
    { name: 'Ansiedade do Agora', description: 'Desejo imediato de consumo sem pensar no amanhã.' },
    { name: 'Pressão do Grupo', description: 'Gastar para se sentir aceito pelos amigos.' },
    { name: 'Medo de Perder (FOMO)', description: 'Medo de ficar de fora de tendências ou eventos.' },
    { name: 'Desejo de Status', description: 'Comprar itens para demonstrar poder ou riqueza.' },
    { name: 'Falta de Limites', description: 'Dificuldade em dizer não para si mesmo.' },
    { name: 'Imediatismo', description: 'Busca por prazer rápido ignorando metas de longo prazo.' },
    { name: 'Comparação Social', description: 'Sentir-se inferior ao ver a vida (editada) dos outros.' },
    { name: 'Publicidade Agressiva', description: 'Cair em gatilhos de marketing e promoções falsas.' },
    { name: 'Desorganização', description: 'Não saber para onde o dinheiro está indo.' },
    { name: 'Insegurança', description: 'Comprar para tentar preencher vazios emocionais.' },
    { name: 'Impulsividade', description: 'Agir sem refletir, especialmente em compras online.' },
    { name: 'Falta de Propósito', description: 'Gastar por gastar, sem ter um sonho ou meta clara.' },
  ];

  for (const s of stressores) {
    await prisma.stressorAgent.create({ data: s });
  }
  console.log('✅ 12 Agentes Estressores criados.');

  // 3. Atividades (Dados do seu JSON)
  const atividades = [
    // Aqui você deve colar a lista de atividades do seu JSON. 
    // Vou colocar as primeiras como exemplo, você pode completar com as 30.
    {
      code: "CK-01",
      module: "checkup",
      title: "O Detector de Glitches Emocionais",
      objective: "Mapear quais sentimentos disparam gastos impulsivos",
      xpReward: 100,
      duration: "3 dias",
      tasks: ["Anotar 3 gastos", "Reflexão 10 min", "Nomear vilão"]
    },
    // ... adicione as outras 29 aqui seguindo o mesmo padrão
  ];

  for (const act of atividades) {
    await prisma.activity.create({ data: act });
  }
  console.log(`✅ ${atividades.length} Atividades criadas.`);

  // 4. Badges
  await prisma.badge.createMany({
    data: [
      { name: 'Primeiros Passos', description: 'Iniciou a jornada.', icon: 'seedling' },
      { name: 'Mestre do Poupar', description: 'Economizou o primeiro real.', icon: 'piggy-bank' },
    ]
  });

  // 5. Admin
  await prisma.user.upsert({
    where: { email: 'marcelo.egito@gmail.com' },
    update: {},
    create: {
      email: 'marcelo.egito@gmail.com',
      name: 'Marcelo Admin',
    },
  });

  console.log('🚀 Seed finalizado!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
