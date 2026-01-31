#!/bin/bash

###############################################################################
# Script de Backup do Supabase
# 
# Cria um backup completo do banco de dados Supabase antes da migração
# 
# Uso:
#   bash scripts/backup-supabase.sh
###############################################################################

set -e  # Parar se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo "====================================="
echo "💾 Backup do Supabase"
echo "====================================="
echo ""

# URL do banco Supabase
SUPABASE_URL="postgresql://postgres.xsdlhzqvcgcovnxchmqe:wVg67IkNudcn1a1J@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"

# Diretório de backups
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

# Nome do arquivo de backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/supabase_backup_$TIMESTAMP.sql"
BACKUP_SCHEMA="$BACKUP_DIR/supabase_schema_$TIMESTAMP.prisma"

log_info "Criando backup do Supabase..."
log_info "Arquivo: $BACKUP_FILE"
echo ""

# Verificar se pg_dump está disponível
if ! command -v pg_dump &> /dev/null; then
    log_error "pg_dump não encontrado!"
    log_info "Instale o PostgreSQL client:"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo "  Mac: brew install postgresql"
    exit 1
fi

# Criar backup SQL completo
log_info "Exportando dados com pg_dump..."
pg_dump "$SUPABASE_URL" > "$BACKUP_FILE" 2>&1

if [ $? -eq 0 ]; then
    log_info "✅ Backup SQL criado com sucesso!"
    log_info "   Tamanho: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    log_error "Falha ao criar backup SQL"
    exit 1
fi

echo ""

# Criar backup do schema via Prisma (se possível)
log_info "Exportando schema com Prisma..."

if command -v npx &> /dev/null; then
    # Salvar DATABASE_URL original
    ORIGINAL_DATABASE_URL=$DATABASE_URL
    
    # Usar URL do Supabase temporariamente
    export DATABASE_URL="$SUPABASE_URL"
    
    # Exportar schema
    npx prisma db pull --schema="$BACKUP_SCHEMA" 2>&1
    
    if [ $? -eq 0 ]; then
        log_info "✅ Schema exportado com sucesso!"
    else
        log_warn "Falha ao exportar schema (não crítico)"
    fi
    
    # Restaurar DATABASE_URL original
    export DATABASE_URL=$ORIGINAL_DATABASE_URL
else
    log_warn "npx não encontrado, pulando export do schema"
fi

echo ""
log_info "====================================="
log_info "✅ Backup concluído com sucesso!"
log_info "====================================="
echo ""
log_info "📁 Arquivos criados:"
echo "  - SQL: $BACKUP_FILE"
if [ -f "$BACKUP_SCHEMA" ]; then
    echo "  - Schema: $BACKUP_SCHEMA"
fi
echo ""
log_info "📊 Estatísticas:"
echo "  - Data: $(date)"
echo "  - Tamanho total: $(du -sh "$BACKUP_DIR" | cut -f1)"
echo ""
log_warn "⚠️  IMPORTANTE:"
echo "  1. Guarde este backup em local seguro"
echo "  2. Teste a restauração antes de deletar o Supabase"
echo "  3. Não commite backups no Git!"
echo ""
log_info "🔄 Para restaurar:"
echo "  psql \"\$DATABASE_URL\" < $BACKUP_FILE"
echo ""
