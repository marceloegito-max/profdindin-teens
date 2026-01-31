import { PrismaClient, UserRole, ActivityModule, CoreDrive } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando Seed do Professor Dindin Teens...');

  // 1. Limpar dados existentes (Ordem importa devido às FKs)
  console.log('🧹 Limpando tabelas...');
  await prisma.message.deleteMany();
  await prisma.controlAssessment.deleteMany();
  await prisma.controlObjective.deleteMany();
  await prisma.completedActivity.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.stressorAssessment.deleteMany();
  await prisma.stressorAgent.deleteMany();
  await prisma.teenProfile.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.class.deleteMany();
  await prisma.educationalInstitution.deleteMany();

  // 2. Criar Admin Padrão
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Administrador Dindin',
      email: 'admin@profdindin.com.br',
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Admin criado (admin@profdindin.com.br / admin123)');

  // 3. Criar Objetivos de Controle BRAVO360 (Os 22 itens do ISJF)
  const objetivos = [
    { code: "ACC", name: "Autorização e Controle de Acesso", determinant: "HAB", desc: "Minhas contas, meus cartões, minhas senhas e meus dispositivos." },
    { code: "BKP", name: "Armazenamento de informações financeiras", determinant: "REC", desc: "Comprovantes, prints, e-mails do banco, notas de compra." },
    { code: "BS", name: "Essencial", determinant: "GAR", desc: "Extrato da conta, limite do cartão, anotações de gastos." },
    { code: "CD", name: "Capacidade de assumir novas dívidas", determinant: "GAR", desc: "Registro do que entra e sai, acordos com banco/governo." },
    { code: "CI", name: "Confidencialidade e Integridade", determinant: "HAB", desc: "Salário/mesada, senhas de banco, cartão, apps e wi-fi." },
    { code: "COMP", name: "Família, obrigações e consciência", determinant: "HAB", desc: "Parceladinhos, rolês, compras que podem esperar." },
    { code: "CTN", name: "Plano B / Continuidade", determinant: "RI", desc: "Seguros, previdência, reservas e bens com liquidez." },
    { code: "CONTRA", name: "Contratos", determinant: "GAR", desc: "Contratos de empréstimos, financiamentos, seguros, serviços." },
    { code: "APP", name: "Uso de Tecnologia", determinant: "REC", desc: "Apps de controle financeiro, planilhas, alertas." },
    { code: "GI", name: "Orçamento familiar / Gestão", determinant: "HAB", desc: "Rotinas de educação e controle financeiro da casa." },
    { code: "INF", name: "Recursos e Ferramentas", determinant: "REC", desc: "Pasta de documentos, celular, computador, wi-fi." },
    { code: "FAC", name: "Patrimônio Financeiro", determinant: "REC", desc: "Bens conquistados (celular, computador, moto, etc.)." },
    { code: "INV", name: "Investimento e Poupança", determinant: "REC", desc: "Poupança, previdência, investimentos simples." },
    { code: "LE", name: "Aspectos Legais", determinant: "RI", desc: "Leis do consumidor ligadas a crédito e cobrança." },
    { code: "POL", name: "Princípios e valores pessoais", determinant: "HAB", desc: "Minha ética, meus valores e meu jeito de consumir." },
    { code: "PR", name: "Hábitos financeiros", determinant: "HAB", desc: "Registro dos gastos do dia a dia." },
    { code: "QUA", name: "Qualidade do planejamento financeiro", determinant: "RI", desc: "Orçamento, anotações, organização de contas." },
    { code: "RI", name: "Proteção contra imprevistos", determinant: "RI", desc: "Reserva de emergência e cuidados para não gastar tudo." },
    { code: "SEG", name: "Cuidado com informações pessoais", determinant: "HAB", desc: "Dados pessoais (CPF, RG, endereço, documentos)." },
    { code: "SF", name: "Cuidado com saúde e capacidade", determinant: "HAB", desc: "Alimentação, estudo, sono, moradia, saúde física/mental." },
    { code: "SW", name: "Recursos de Tecnologia", determinant: "REC", desc: "Celular, computador, apps, wi-fi." },
    { code: "TL", name: "Canais de Comunicação", determinant: "REC", desc: "Telefone, chat, e-mail para falar com banco/credor." }
  ];

  for (const obj of objetivos) {
    await prisma.controlObjective.create({
      data: {
        code: obj.code,
        name: obj.name,
        description: obj.desc,
        determinant: obj.determinant,
      },
    });
  }
  console.log('✅ 22 Objetivos de Controle criados.');

  // 4. Criar Atividades (Resumo das 30 atividades)
  const atividades = [
    { codigo: "CK-01", modulo: "CHECKUP", nome: "O Detetive de Assinaturas", pontos: 50 },
    { codigo: "CK-02", modulo: "CHECKUP", nome: "Teste de Estresse Financeiro", pontos: 50 },
    { codigo: "CK-03", modulo: "CHECKUP", nome: "Inventário de Impulsos", pontos: 50 },
    { codigo: "CK-04", modulo: "CHECKUP", nome: "Verdades Familiares", pontos: 50 },
    { codigo: "CK-05", modulo: "CHECKUP", nome: "Rastreador de Pequenos Luxos", pontos: 50 },
    { codigo: "CK-06", modulo: "CHECKUP", nome: "O Custo do Tempo", pontos: 50 },
    { codigo: "CK-07", modulo: "CHECKUP", nome: "Mapa de Influência", pontos: 50 },
    { codigo: "CK-08", modulo: "CHECKUP", nome: "Inventário do Tédio", pontos: 50 },
    { codigo: "CK-09", modulo: "CHECKUP", nome: "Desafio do 'Não' Temporário", pontos: 50 },
    { codigo: "CK-10", modulo: "CHECKUP", nome: "Check-up de Fragilidade", pontos: 100 },
    { codigo: "RX-01", modulo: "RAIO_X", nome: "O Espelho do Arquétipo", pontos: 70 },
    { codigo: "RX-02", modulo: "RAIO_X", nome: "O Duelo: Id vs Ego", pontos: 70 },
    { codigo: "RX-03", modulo: "RAIO_X", nome: "Vieses Cognitivos em Ação", pontos: 70 },
    { codigo: "RX-04", modulo: "RAIO_X", nome: "A Regra das 24 Horas", pontos: 70 },
    { codigo: "RX-05", modulo: "RAIO_X", nome: "Genealogia Financeira", pontos: 70 },
    { codigo: "RX-06", modulo: "RAIO_X", nome: "Assertividade Social", pontos: 70 },
    { codigo: "RX-07", modulo: "RAIO_X", nome: "Visualização de Futuro", pontos: 70 },
    { codigo: "RX-08", modulo: "RAIO_X", nome: "Perfil de Risco Real", pontos: 70 },
    { codigo: "RX-09", modulo: "RAIO_X", nome: "Maturidade Cognitiva", pontos: 70 },
    { codigo: "RX-10", modulo: "RAIO_X", nome: "Raio-X Consolidado", pontos: 120 },
    { codigo: "MT-01", modulo: "MAPA_TESOURO", nome: "Contrato Comigo Mesmo", pontos: 100 },
    { codigo: "MT-02", modulo: "MAPA_TESOURO", nome: "Caça à Renda Extra", pontos: 100 },
    { codigo: "MT-03", modulo: "MAPA_TESOURO", nome: "Estratégia Barbell", pontos: 100 },
    { codigo: "MT-04", modulo: "MAPA_TESOURO", nome: "O Poder do Desapego", pontos: 100 },
    { codigo: "MT-05", modulo: "MAPA_TESOURO", nome: "Orçamento dos Sonhos", pontos: 100 },
    { codigo: "MT-06", modulo: "MAPA_TESOURO", nome: "Hacker de Promoções", pontos: 100 },
    { codigo: "MT-07", modulo: "MAPA_TESOURO", nome: "Networking de Valor", pontos: 100 },
    { codigo: "MT-08", modulo: "MAPA_TESOURO", nome: "Semana Grátis", pontos: 100 },
    { codigo: "MT-09", modulo: "MAPA_TESOURO", nome: "Regra 50/30/20 Teens", pontos: 100 },
    { codigo: "MT-10", modulo: "MAPA_TESOURO", nome: "Roadmap de 12 Meses", pontos: 150 }
  ];

  for (const act of atividades) {
    await prisma.activity.create({
      data: {
        code: act.codigo,
        module: act.modulo as ActivityModule,
        name: act.nome,
        objective: 'Objetivo detalhado no manual.',
        points: act.pontos,
        tasks: {},
        tools: {},
        successCriteria: {},
        referenceModels: {},
        impact: 'Alto',
        coreDrives: [CoreDrive.CD2_REALIZACAO],
      },
    });
  }
  console.log('✅ 30 Atividades criadas.');

  // 5. Criar Badges (Níveis 1 a 6)
  const badges = [
    { name: 'Recruta da Jornada', level: 1, icon: 'shield', desc: 'Você acaba de se alistar na jornada financeira.' },
    { name: 'Primeiro Passo na Trilha', level: 2, icon: 'footprints', desc: 'Você abriu sua própria trilha no mapa financeiro.' },
    { name: 'Explorador Disciplinado', level: 3, icon: 'compass', desc: 'Você já desbravou 25% da jornada.' },
    { name: 'Guardião das Moedas', level: 4, icon: 'lock', desc: 'Metade do mapa já é território seguro.' },
    { name: 'Estrategista Financeiro', level: 5, icon: 'map', desc: 'Você domina a maior parte dos desafios.' },
    { name: 'Lendário da Riqueza', level: 6, icon: 'crown', desc: 'Você se tornou uma lenda da jornada financeira.' },
  ];

  for (const b of badges) {
    await prisma.badge.create({
      data: {
        name: b.name,
        level: b.level,
        icon: b.icon,
        description: b.desc,
      },
    });
  }
  console.log('✅ 6 Badges de nível criadas.');

  console.log('✨ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
