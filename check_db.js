const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('✅ Usuários encontrados:', users.length);
    users.forEach(u => console.log(`  - ${u.email} (${u.role})`));
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
