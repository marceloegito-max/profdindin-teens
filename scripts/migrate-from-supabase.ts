/**
 * Script de Migração: Supabase → Abacus PostgreSQL
 * 
 * Este script copia os dados do banco Supabase para o PostgreSQL da Abacus.AI
 * 
 * IMPORTANTE:
 * 1. Execute ANTES do primeiro deploy em produção
 * 2. Tenha backup do Supabase antes de executar
 * 3. Teste em ambiente de desenvolvimento primeiro
 * 
 * Uso:
 *   npx tsx scripts/migrate-from-supabase.ts
 */

import { PrismaClient } from '@prisma/client';

// Banco de origem (Supabase)
const supabase = new PrismaClient({
  datasources: {
    db: {
      url: process.env.SUPABASE_DATABASE_URL || 'postgresql://postgres.xsdlhzqvcgcovnxchmqe:wVg67IkNudcn1a1J@aws-1-sa-east-1.pooler.supabase.com:5432/postgres'
    }
  },
  log: ['error', 'warn'],
});

// Banco de destino (Abacus)
const abacus = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

/**
 * Migra dados de uma tabela
 */
async function migrateTable<T extends keyof PrismaClient>(
  tableName: T,
  batchSize: number = 100
) {
  console.log(`\n➡️  Migrando tabela: ${String(tableName)}`);
  
  try {
    // @ts-ignore - Tipo genérico do Prisma
    const sourceData = await supabase[tableName].findMany();
    
    if (sourceData.length === 0) {
      console.log(`   ⚠️  Nenhum dado encontrado em ${String(tableName)}`);
      return;
    }

    console.log(`   📄 Encontrados ${sourceData.length} registros`);

    // Inserir em lotes
    for (let i = 0; i < sourceData.length; i += batchSize) {
      const batch = sourceData.slice(i, i + batchSize);
      
      // @ts-ignore
      await abacus[tableName].createMany({
        data: batch,
        skipDuplicates: true, // Pular se já existir
      });

      console.log(`   ✅ Migrados ${Math.min(i + batchSize, sourceData.length)}/${sourceData.length}`);
    }

    console.log(`   ✅ Tabela ${String(tableName)} migrada com sucesso!`);
  } catch (error) {
    console.error(`   ❌ Erro ao migrar ${String(tableName)}:`, error);
    throw error;
  }
}

/**
 * Função principal de migração
 */
async function migrate() {
  console.log('🚀 Iniciando migração Supabase → Abacus PostgreSQL\n');
  console.log('=' .repeat(60));

  try {
    // Testar conexões
    console.log('\n🔌 Testando conexões...');
    await supabase.$connect();
    console.log('   ✅ Conectado ao Supabase');
    
    await abacus.$connect();
    console.log('   ✅ Conectado ao Abacus PostgreSQL');

    // Ordem de migração (respeitar foreign keys)
    const migrationOrder = [
      // 1. Tabelas base (sem dependências)
      'account',
      'session',
      'verificationToken',
      
      // 2. Usuários e instituições
      'user',
      'educationalInstitution',
      
      // 3. Relações de usuários
      'responsible',
      'responsibleTeenLink',
      'teenProfile',
      'professorProfile',
      
      // 4. Estrutura educacional
      'class',
      'classStudent',
      'classProfessor',
      
      // 5. Atividades
      'activity',
      'atividadeProgresso',
      
      // 6. Gamificação
      'badge',
      'userBadge',
      'userProgress',
      'streak',
      'dailyMission',
      'userDailyMission',
      
      // 7. ISJF e Raio-X
      'iSJFHistory',
      'mapaTesouroTest',
      
      // 8. Mensagens
      'message',
      
      // 9. Outros
      'auditLog',
      'newsletterSubscriber',
    ];

    // Migrar cada tabela
    for (const table of migrationOrder) {
      await migrateTable(table as keyof PrismaClient);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Migração concluída com sucesso!');
    console.log('\n📊 Estatísticas:');

    // Contar registros migrados
    const userCount = await abacus.user.count();
    const activityCount = await abacus.activity.count();
    const badgeCount = await abacus.badge.count();

    console.log(`   - Usuários: ${userCount}`);
    console.log(`   - Atividades: ${activityCount}`);
    console.log(`   - Badges: ${badgeCount}`);

    console.log('\n🎯 Próximos passos:');
    console.log('   1. Verificar dados no Prisma Studio: yarn prisma studio');
    console.log('   2. Testar aplicação localmente: yarn dev');
    console.log('   3. Fazer deploy em produção');
    console.log('\n⚠️  Não esqueça de fazer backup do Supabase!');

  } catch (error) {
    console.error('\n❌ Erro durante a migração:', error);
    throw error;
  } finally {
    // Desconectar
    await supabase.$disconnect();
    await abacus.$disconnect();
  }
}

// Executar migração
migrate()
  .catch((error) => {
    console.error('\n🔥 Migração falhou:', error);
    process.exit(1);
  });
