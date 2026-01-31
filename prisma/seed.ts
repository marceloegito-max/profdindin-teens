import { PrismaClient, UserRole, ActivityModule, CoreDrive, MissionType, IncomeSource, Archetype, RiskProfile } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando Seed do Dindin Teens - FASE 1 COMPLETA');

  // ==================== 1. LIMPAR DADOS ====================
  console.log('\n🧹 Limpando tabelas...');
  await prisma.iSJFHistory.deleteMany();
  await prisma.controlAssessment.deleteMany();
  await prisma.controlObjective.deleteMany();
  await prisma.completedMission.deleteMany();
  await prisma.dailyMission.deleteMany();
  await prisma.completedActivity.deleteMany();
  await prisma.atividadeProgresso.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.stressorAssessment.deleteMany();
  await prisma.stressorAgent.deleteMany();
  await prisma.eventoJornada.deleteMany();
  await prisma.jornadaFinanceira.deleteMany();
  await prisma.mapaTesouroTest.deleteMany();
  await prisma.raioXTest.deleteMany();
  await prisma.checkupTest.deleteMany();
  await prisma.notificacao.deleteMany();
  await prisma.message.deleteMany();
  await prisma.teenResponsible.deleteMany();
  await prisma.teenClass.deleteMany();
  await prisma.professorClass.deleteMany();
  await prisma.class.deleteMany();
  await prisma.educationalInstitution.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.teenProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Tabelas limpas com sucesso!');

  // ==================== 2. CRIAR USUÁRIOS ====================
  console.log('\n👥 Criando usuários...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Administrador Dindin',
      email: 'admin@dindinteens.com.br',
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
      consentimentoLGPD: true,
      dataConsentimento: new Date(),
    },
  });
  console.log('✅ Admin criado (admin@dindinteens.com.br / admin123)');

  // Teen de teste
  const teenPassword = await bcrypt.hash('teen123', 10);
  const teenUser = await prisma.user.create({
    data: {
      name: 'Lucas Silva',
      email: 'lucas@teste.com',
      passwordHash: teenPassword,
      role: UserRole.TEEN,
      consentimentoLGPD: true,
      dataConsentimento: new Date(),
      teenProfile: {
        create: {
          age: 16,
          incomeSource: IncomeSource.MESADA,
          monthlyIncome: 300,
          mainGoal: 'Comprar um notebook gamer',
          archetype: Archetype.EQUILIBRADO,
          riskProfile: RiskProfile.MODERADO,
          hasSavings: true,
          cidade: 'São Paulo',
          escola: 'Colégio Teste',
          serieAno: '2º Ano EM',
        },
      },
      userProgress: {
        create: {
          xp: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
        },
      },
      jornadaFinanceira: {
        create: {
          statusGeral: 'iniciando',
          progressoGeral: 0,
        },
      },
    },
  });
  console.log('✅ Teen de teste criado (lucas@teste.com / teen123)');

  // Professor de teste
  const profPassword = await bcrypt.hash('prof123', 10);
  const professorUser = await prisma.user.create({
    data: {
      name: 'Prof. Maria Santos',
      email: 'maria@escola.com',
      passwordHash: profPassword,
      role: UserRole.PROFESSOR,
      consentimentoLGPD: true,
      dataConsentimento: new Date(),
    },
  });
  console.log('✅ Professor de teste criado (maria@escola.com / prof123)');

  // Responsável de teste
  const respPassword = await bcrypt.hash('resp123', 10);
  const responsibleUser = await prisma.user.create({
    data: {
      name: 'Ana Silva (Mãe)',
      email: 'ana@teste.com',
      passwordHash: respPassword,
      role: UserRole.RESPONSIBLE,
      consentimentoLGPD: true,
      dataConsentimento: new Date(),
    },
  });
  console.log('✅ Responsável de teste criado (ana@teste.com / resp123)');

  // Vincular responsável ao teen
  await prisma.teenResponsible.create({
    data: {
      teenId: teenUser.id,
      responsibleId: responsibleUser.id,
      relacao: 'mae',
      active: true,
    },
  });
  console.log('✅ Responsável vinculado ao teen');

  // ==================== 3. CRIAR OBJETIVOS DE CONTROLE (22 ISJF) ====================
  console.log('\n🎯 Criando 22 Objetivos de Controle ISJF (BRAVO360)...');
  
  const objetivos = [
    { codigo: "BS", nome: "Essencial (Budget Saving)", categoria: "GAR", peso: 0.33, ordem: 1, 
      descricao: "Controle básico do essencial: extrato da conta, limite do cartão, registro de gastos diários",
      descricaoTeen: "Conhecer quanto tem na conta, quanto pode gastar no cartão e anotar os gastos do dia a dia 💸" },
    
    { codigo: "CONTRA", nome: "Contratos", categoria: "GAR", peso: 0.33, ordem: 2,
      descricao: "Gestão de contratos financeiros: empréstimos, financiamentos, seguros, assinaturas",
      descricaoTeen: "Ter controle sobre parcelamentos, assinaturas de streaming, planos de celular etc 📄" },
    
    { codigo: "CD", nome: "Capacidade de Dívida", categoria: "GAR", peso: 0.34, ordem: 3,
      descricao: "Capacidade de assumir novas dívidas com base em comprometimento de renda",
      descricaoTeen: "Saber se pode parcelar algo novo sem explodir o orçamento 💳" },
    
    { codigo: "COMP", nome: "Compliance (Consciência)", categoria: "HAB", peso: 0.125, ordem: 4,
      descricao: "Consciência sobre obrigações familiares e prioridades financeiras",
      descricaoTeen: "Entender o que é prioridade (mesada, lanche, transporte) e o que pode esperar 🤔" },
    
    { codigo: "GI", nome: "Gestão Interna", categoria: "HAB", peso: 0.125, ordem: 5,
      descricao: "Rotinas de educação financeira e controle de orçamento familiar",
      descricaoTeen: "Ter uma rotina de controlar gastos, tipo anotar tudo num app ou caderno 📓" },
    
    { codigo: "PR", nome: "Processos e Rotinas", categoria: "HAB", peso: 0.125, ordem: 6,
      descricao: "Hábitos financeiros diários: registro de gastos, revisão de contas",
      descricaoTeen: "Criar o hábito de olhar os gastos todo dia, tipo checklist ✅" },
    
    { codigo: "SEG", nome: "Segurança da Informação", categoria: "HAB", peso: 0.125, ordem: 7,
      descricao: "Proteção de dados pessoais e documentos importantes (CPF, RG, senhas)",
      descricaoTeen: "Não compartilhar CPF, senha do banco, ter cuidado com golpes 🔐" },
    
    { codigo: "CI", nome: "Confidencialidade e Integridade", categoria: "HAB", peso: 0.125, ordem: 8,
      descricao: "Confidencialidade de senhas bancárias, cartões e aplicativos",
      descricaoTeen: "Senhas fortes, não emprestar cartão, não cair em phishing 🛡️" },
    
    { codigo: "ACC", nome: "Acesso e Autorização", categoria: "HAB", peso: 0.125, ordem: 9,
      descricao: "Controle de acesso a contas, cartões e dispositivos financeiros",
      descricaoTeen: "Só você pode acessar seu banco/pix. Não deixar senha salva em celular de amigo 📱" },
    
    { codigo: "POL", nome: "Políticas Pessoais", categoria: "HAB", peso: 0.125, ordem: 10,
      descricao: "Princípios e valores pessoais relacionados ao consumo",
      descricaoTeen: "Seus valores: comprar de marcas éticas, evitar impulsos, ser consciente 🌱" },
    
    { codigo: "SF", nome: "Saúde Física e Mental", categoria: "HAB", peso: 0.125, ordem: 11,
      descricao: "Cuidados com saúde que impactam capacidade financeira",
      descricaoTeen: "Dormir bem, comer direito, estudar. Saúde é investimento! 💪" },
    
    { codigo: "INV", nome: "Investimentos", categoria: "REC", peso: 0.25, ordem: 12,
      descricao: "Poupança, investimentos simples e construção de patrimônio",
      descricaoTeen: "Guardar grana na poupança, investir em algo que rende (Tesouro, CDB) 💰" },
    
    { codigo: "INF", nome: "Infraestrutura", categoria: "REC", peso: 0.25, ordem: 13,
      descricao: "Recursos físicos: pasta de documentos, dispositivos, conectividade",
      descricaoTeen: "Ter celular funcional, wi-fi, computador pra estudar e controlar finanças 💻" },
    
    { codigo: "APP", nome: "Aplicações e Ferramentas", categoria: "REC", peso: 0.25, ordem: 14,
      descricao: "Uso de apps e planilhas para controle financeiro",
      descricaoTeen: "Apps tipo GuiaBolso, Mobills, planilhas do Google 📊" },
    
    { codigo: "SW", nome: "Software e Tecnologia", categoria: "REC", peso: 0.125, ordem: 15,
      descricao: "Recursos tecnológicos para gestão financeira",
      descricaoTeen: "Apps do banco, calculadoras, lembretes de vencimento 📲" },
    
    { codigo: "BKP", nome: "Backup de Informações", categoria: "REC", peso: 0.125, ordem: 16,
      descricao: "Armazenamento de comprovantes, prints, notas fiscais",
      descricaoTeen: "Salvar prints de pix, comprovantes, fotos de nota fiscal 📸" },
    
    { codigo: "LE", nome: "Legal (Aspectos Legais)", categoria: "RI", peso: 0.25, ordem: 17,
      descricao: "Conhecimento sobre leis de consumo, crédito e cobrança",
      descricaoTeen: "Conhecer direitos: devolução em 7 dias, cancelamento de assinatura 📜" },
    
    { codigo: "RC", nome: "Risco de Crédito", categoria: "RI", peso: 0.25, ordem: 18,
      descricao: "Gestão de crédito e endividamento sustentável",
      descricaoTeen: "Não parcelar demais, evitar juros rotativos, usar crédito com sabedoria ⚠️" },
    
    { codigo: "QUA", nome: "Qualidade do Planejamento", categoria: "RI", peso: 0.25, ordem: 19,
      descricao: "Qualidade e organização do orçamento e planejamento financeiro",
      descricaoTeen: "Planejar gastos do mês, ter orçamento organizado, metas claras 📅" },
    
    { codigo: "CTN", nome: "Continuidade (Plano B)", categoria: "RI", peso: 0.25, ordem: 20,
      descricao: "Plano B: reserva de emergência, seguros, previdência",
      descricaoTeen: "Ter uma reserva pra imprevistos (celular quebrou, remédio caro) 🆘" },
    
    { codigo: "FAC", nome: "Facilities (Patrimônio)", categoria: "REC", peso: 0.125, ordem: 21,
      descricao: "Patrimônio financeiro: bens conquistados e recursos disponíveis",
      descricaoTeen: "Seus bens: celular, computador, bike, coisas que você conquistou 🏆" },
    
    { codigo: "TL", nome: "Telecom (Canais)", categoria: "REC", peso: 0.125, ordem: 22,
      descricao: "Canais de comunicação com instituições financeiras",
      descricaoTeen: "Ter telefone/e-mail do banco, saber como falar com atendimento 📞" },
  ];

  for (const obj of objetivos) {
    await prisma.controlObjective.create({
      data: {
        codigo: obj.codigo,
        nome: obj.nome,
        descricao: obj.descricao,
        categoria: obj.categoria,
        peso: obj.peso,
        ordem: obj.ordem,
        descricaoTeen: obj.descricaoTeen,
        exemplosTeen: [],
      },
    });
  }
  console.log('✅ 22 Objetivos de Controle ISJF criados com sucesso!');

  // ==================== 4. CRIAR ATIVIDADES ====================
  console.log('\n📚 Criando 30 Atividades do Banco de Atividades Teens...');
  
  // Ler arquivo JSON de atividades
  const atividadesPath = path.join(__dirname, 'BANCO_ATIVIDADES_TEENS.json');
  const atividadesData = JSON.parse(fs.readFileSync(atividadesPath, 'utf-8'));
  
  for (const ativ of atividadesData.atividades) {
    const moduleMap: { [key: string]: ActivityModule } = {
      'checkup': ActivityModule.CHECKUP,
      'raio_x': ActivityModule.RAIO_X,
      'mapa_tesouro': ActivityModule.MAPA_TESOURO,
    };

    await prisma.activity.create({
      data: {
        code: ativ.codigo,
        module: moduleMap[ativ.modulo] || ActivityModule.CHECKUP,
        name: ativ.nome,
        objective: ativ.objetivo,
        tasks: ativ.tarefas || [],
        tools: { ferramenta: ativ.ferramenta || 'Não especificado' },
        successCriteria: ativ.criteriosSucesso || [],
        referenceModels: ativ.modelosReferencia || [],
        impact: ativ.impactoJornada || 'Médio',
        points: ativ.pontos || 50,
        suggestedDuration: ativ.prazoSugerido || '7 dias',
        prerequisites: ativ.prerequisitos || [],
        coreDrives: [CoreDrive.DEVELOPMENT], // Padrão, pode ser customizado
        linguagemTeen: true,
        exemplosTeen: [],
      },
    });
  }
  console.log(`✅ ${atividadesData.atividades.length} Atividades criadas com linguagem teen!`);

  // ==================== 5. CRIAR BADGES (GAMIFICAÇÃO) ====================
  console.log('\n🏅 Criando Badges de Gamificação...');
  
  const badges = [
    { name: '🛡️ Recruta da Jornada', desc: 'Primeiro passo na jornada financeira', coreDrive: CoreDrive.EPIC_MEANING, required: 0 },
    { name: '👣 Explorador Iniciante', desc: 'Completou sua primeira atividade', coreDrive: CoreDrive.DEVELOPMENT, required: 1 },
    { name: '🔥 Sequência de Fogo', desc: 'Manteve streak de 7 dias', coreDrive: CoreDrive.AVOIDANCE, required: 7 },
    { name: '📊 Mestre dos Dados', desc: 'Completou 10 atividades', coreDrive: CoreDrive.OWNERSHIP, required: 10 },
    { name: '💎 Guardião do Tesouro', desc: 'Completou o Mapa do Tesouro', coreDrive: CoreDrive.EPIC_MEANING, required: 1 },
    { name: '🧠 Raio-X Mental', desc: 'Completou todas as atividades do Raio-X', coreDrive: CoreDrive.EMPOWERMENT, required: 10 },
    { name: '🎯 Check-up Master', desc: 'Completou todas as atividades do Check-up', coreDrive: CoreDrive.DEVELOPMENT, required: 10 },
    { name: '👑 Lenda Financeira', desc: 'Completou todas as 30 atividades', coreDrive: CoreDrive.EPIC_MEANING, required: 30 },
    { name: '🌟 XP Hunter', desc: 'Alcançou 1000 XP', coreDrive: CoreDrive.DEVELOPMENT, required: 1000 },
    { name: '🚀 Nível 5', desc: 'Chegou ao nível 5', coreDrive: CoreDrive.DEVELOPMENT, required: 5 },
  ];

  for (const badge of badges) {
    await prisma.badge.create({
      data: {
        name: badge.name,
        description: badge.desc,
        icon: badge.name.split(' ')[0], // Emoji como ícone
        criteria: badge.desc,
        requiredValue: badge.required,
        coreDrive: badge.coreDrive,
      },
    });
  }
  console.log('✅ 10 Badges criadas com Core Drives!');

  // ==================== 6. CRIAR AGENTES ESTRESSORES ====================
  console.log('\n😰 Criando Agentes Estressores...');
  
  const stressors = [
    { name: 'Dívidas Acumuladas', desc: 'Parcelas atrasadas, cartão estourado', category: 'financeiro', icon: '💳' },
    { name: 'Falta de Controle', desc: 'Não saber pra onde vai o dinheiro', category: 'organizacao', icon: '🌀' },
    { name: 'Pressão Social', desc: 'FOMO, comparação com amigos', category: 'social', icon: '📱' },
    { name: 'Impulsos de Compra', desc: 'Compras não planejadas, gatilhos emocionais', category: 'comportamental', icon: '🛍️' },
    { name: 'Falta de Renda', desc: 'Mesada insuficiente, sem trabalho', category: 'financeiro', icon: '💸' },
    { name: 'Gastos Invisíveis', desc: 'Assinaturas esquecidas, micro-gastos', category: 'organizacao', icon: '👻' },
    { name: 'Falta de Objetivos', desc: 'Sem meta clara para guardar dinheiro', category: 'planejamento', icon: '🎯' },
    { name: 'Influência Negativa', desc: 'Amigos que incentivam gastos', category: 'social', icon: '👥' },
  ];

  for (const stressor of stressors) {
    await prisma.stressorAgent.create({
      data: {
        name: stressor.name,
        description: stressor.desc,
        icon: stressor.icon,
        category: stressor.category,
        exemplosTeen: [],
        dicasTeen: [],
      },
    });
  }
  console.log('✅ 8 Agentes Estressores criados!');

  // ==================== 7. CRIAR MISSÕES DIÁRIAS ====================
  console.log('\n🎮 Criando Missões Diárias...');
  
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const missions = [
    { title: 'Complete uma Atividade', desc: 'Finalize qualquer atividade hoje', type: MissionType.COMPLETE_ACTIVITIES, target: 1, reward: 50, icon: '✅' },
    { title: 'Ganhe 100 XP', desc: 'Acumule 100 pontos de experiência', type: MissionType.EARN_XP, target: 100, reward: 75, icon: '⭐' },
    { title: 'Mantenha o Streak', desc: 'Entre no app por 3 dias seguidos', type: MissionType.MAINTAIN_STREAK, target: 3, reward: 100, icon: '🔥' },
  ];

  for (const mission of missions) {
    await prisma.dailyMission.create({
      data: {
        title: mission.title,
        description: mission.desc,
        type: mission.type,
        target: mission.target,
        reward: mission.reward,
        icon: mission.icon,
        validUntil: tomorrow,
      },
    });
  }
  console.log('✅ 3 Missões Diárias criadas!');

  // ==================== 8. CRIAR INSTITUIÇÃO E TURMA DE TESTE ====================
  console.log('\n🏫 Criando Instituição e Turma de Teste...');
  
  const institution = await prisma.educationalInstitution.create({
    data: {
      nome: 'Escola Estadual Prof. Dindin',
      tipo: 'escola',
      cidade: 'São Paulo',
      estado: 'SP',
      active: true,
    },
  });

  const turma = await prisma.class.create({
    data: {
      institutionId: institution.id,
      nome: '2º Ano A - Manhã',
      codigo: '2A-2025',
      descricao: 'Turma de educação financeira',
      anoLetivo: '2025',
      turno: 'manha',
      active: true,
    },
  });

  await prisma.professorClass.create({
    data: {
      professorId: professorUser.id,
      classId: turma.id,
      isPrimary: true,
    },
  });

  await prisma.teenClass.create({
    data: {
      teenId: teenUser.id,
      classId: turma.id,
      enrolled: true,
    },
  });

  console.log('✅ Instituição e Turma criadas, professor e teen vinculados!');

  // ==================== SUMÁRIO ====================
  console.log('\n✨ ========================================');
  console.log('✨ SEED COMPLETO - FASE 1 FINALIZADA!');
  console.log('✨ ========================================\n');
  
  console.log('📊 Resumo do que foi criado:');
  console.log(`   👥 4 Usuários (Admin, Teen, Professor, Responsável)`);
  console.log(`   🎯 22 Objetivos de Controle ISJF (BRAVO360)`);
  console.log(`   📚 30 Atividades (Checkup, Raio-X, Mapa Tesouro)`);
  console.log(`   🏅 10 Badges de Gamificação`);
  console.log(`   😰 8 Agentes Estressores`);
  console.log(`   🎮 3 Missões Diárias`);
  console.log(`   🏫 1 Instituição + 1 Turma`);
  
  console.log('\n🔑 Credenciais de Acesso:');
  console.log('   Admin:       admin@dindinteens.com.br / admin123');
  console.log('   Teen:        lucas@teste.com / teen123');
  console.log('   Professor:   maria@escola.com / prof123');
  console.log('   Responsável: ana@teste.com / resp123');
  
  console.log('\n🚀 Próximos passos:');
  console.log('   1. Sprint 1.3: Implementar Motor ISJF (cálculo dos 22 objetivos)');
  console.log('   2. Sprint 1.4: Implementar Motor de Recomendações (IA)');
  console.log('   3. Testar APIs e validar funcionalidades');
  
  console.log('\n✅ Seed concluído com sucesso! 🎉\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
