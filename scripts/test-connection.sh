#!/bin/bash

###############################################################################
# Script de Teste de Conexão
# 
# Testa conexão com o banco de dados PostgreSQL da Abacus
# 
# Uso:
#   bash scripts/test-connection.sh
###############################################################################

set -e

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "====================================="
echo "🔍 Teste de Conexão PostgreSQL"
echo "====================================="
echo ""

# Carregar variáveis de ambiente
if [ -f .env ]; then
    source .env
    log_info ".env carregado"
else
    log_error ".env não encontrado!"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    log_error "DATABASE_URL não definido no .env"
    exit 1
fi

log_info "DATABASE_URL encontrado"
echo ""

# Extrair detalhes da conexão
log_info "Detalhes da conexão:"
echo "$DATABASE_URL" | sed 's/:[^:]*@/:****@/g'
echo ""

# Testar conexão com psql
log_info "Testando conexão com psql..."
if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
    log_info "Conexão bem-sucedida com psql!"
else
    log_error "Falha na conexão com psql"
    log_warn "Verifique se:"
    echo "  1. DATABASE_URL está correto no .env"
    echo "  2. PostgreSQL client está instalado (psql)"
    echo "  3. Banco foi inicializado via initialize_postgres_db"
    exit 1
fi

echo ""

# Testar com Prisma
log_info "Testando conexão com Prisma..."
if npx prisma db pull --force &> /dev/null; then
    log_info "Conexão bem-sucedida com Prisma!"
else
    log_error "Falha na conexão com Prisma"
    exit 1
fi

echo ""

# Ver estatísticas do banco
log_info "Estatísticas do banco:"
psql "$DATABASE_URL" << EOF
\echo ''
\echo 'Tabelas:'
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

\echo ''
\echo 'Tamanho do banco:'
SELECT pg_size_pretty(pg_database_size(current_database())) as size;

\echo ''
\echo 'Número de tabelas:'
SELECT COUNT(*) as num_tables 
FROM information_schema.tables 
WHERE table_schema = 'public';
EOF

echo ""
log_info "====================================="
log_info "✅ Todos os testes passaram!"
log_info "====================================="
echo ""
