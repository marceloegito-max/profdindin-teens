const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyDatabase() {
  console.log('🔍 Verificando dados no banco Supabase...\n');
  
  try {
    const users = await prisma.user.count();
    console.log(`👥 Usuários: ${users}`);
    
    const activities = await prisma.activity.count();
    console.log(`📚 Atividades: ${activities}`);
    
    const badges = await prisma.badge.count();
    console.log(`🏅 Badges: ${badges}`);
    
    const controlObjectives = await prisma.controlObjective.count();
    console.log(`🎯 Objetivos de Controle ISJF: ${controlObjectives}`);
    
    const institutions = await prisma.institution.count();
    console.log(`🏫 Instituições: ${institutions}`);
    
    const classes = await prisma.class.count();
    console.log(`📖 Turmas: ${classes}`);
    
    const dailyMissions = await prisma.dailyMission.count();
    console.log(`🎮 Missões Diárias: ${dailyMissions}`);
    
    console.log('\n✅ Verificação concluída!\n');
    
    // Listar usuários criados
    console.log('📋 Usuários criados:');
    const usersList = await prisma.user.findMany({
      select: { name: true, email: true, role: true }
    });
    usersList.forEach(u => console.log(`   - ${u.name} (${u.email}) - ${u.role}`));
    
  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
