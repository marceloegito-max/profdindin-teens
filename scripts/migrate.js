const { execSync } = require('child_process');

console.log('🔄 Rodando Prisma Migrate...');

try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✅ Migrations aplicadas com sucesso!');
} catch (error) {
  console.error('❌ Erro ao rodar migrations:', error);
  process.exit(1);
}
