import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de produção...');

  // Criar apenas usuário admin para produção
  const hashedPassword = await bcrypt.hash('Admin@2024!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dindinteens.com.br' },
    update: {},
    create: {
      email: 'admin@dindinteens.com.br',
      name: 'Administrador',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin criado:', admin.email);

  // Criar badges padrão
  const badges = [
    {
      name: 'Primeiro Passo',
      description: 'Complete sua primeira atividade',
      icon: 'Award',
      category: 'learning',
      criteria: 'ACTIVITIES_COMPLETED',
      requiredValue: 1,
      xpReward: 50,
    },
    {
      name: 'Dedicado',
      description: 'Complete 10 atividades',
      icon: 'Trophy',
      category: 'learning',
      criteria: 'ACTIVITIES_COMPLETED',
      requiredValue: 10,
      xpReward: 200,
    },
    {
      name: 'Mestre Financeiro',
      description: 'Complete 50 atividades',
      icon: 'Star',
      category: 'learning',
      criteria: 'ACTIVITIES_COMPLETED',
      requiredValue: 50,
      xpReward: 1000,
    },
    {
      name: 'Streak de Fogo',
      description: 'Mantenha 7 dias de sequência',
      icon: 'Flame',
      category: 'streak',
      criteria: 'STREAK_DAYS',
      requiredValue: 7,
      xpReward: 300,
    },
    {
      name: 'Nível 10',
      description: 'Alcance o nível 10',
      icon: 'TrendingUp',
      category: 'achievement',
      criteria: 'LEVEL_REACHED',
      requiredValue: 10,
      xpReward: 500,
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }

  console.log('✅ Badges criados');
  console.log('🌱 Seed de produção concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
