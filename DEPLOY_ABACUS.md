# 🚀 Guia Rápido de Deploy na Abacus.AI

**Projeto**: DinDin Teens  
**Ambiente**: Abacus.AI  
**Última Atualização**: 31/01/2026

---

## 🛠️ Setup Inicial (Primeira Vez)

### 1. Criar Estrutura do Projeto

```bash
# Criar diretório raiz
mkdir -p /home/ubuntu/profdindin-teens
cd /home/ubuntu/profdindin-teens

# Clonar repositório
git clone https://github.com/marceloegito-max/profdindin-teens.git nextjs_space
cd nextjs_space
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar template
cp .env.example .env

# Gerar NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET gerado: $NEXTAUTH_SECRET"

# Editar .env manualmente
vim .env
```

**Mínimo necessário no `.env`**:

```bash
NEXTAUTH_SECRET='cole-o-secret-gerado-aqui'
NEXTAUTH_URL='http://localhost:3000'
NODE_ENV='development'
```

### 3. Inicializar Banco de Dados

**Via DeepAgent** (recomendado):

```python
# O DeepAgent executará:
initialize_postgres_db(
    project_path="/home/ubuntu/profdindin-teens"
)
```

Isso atualizará automaticamente o `.env` com o `DATABASE_URL`.

### 4. Instalar Dependências

```bash
cd /home/ubuntu/profdindin-teens/nextjs_space

# Instalar com Yarn
yarn install

# Gerar Prisma Client
yarn prisma generate

# Aplicar schema no banco
yarn prisma db push

# Popular dados iniciais
yarn prisma db seed
```

### 5. Testar Localmente

```bash
# Iniciar servidor de desenvolvimento
yarn dev

# Abrir em http://localhost:3000
```

**Credenciais de teste** (criadas pelo seed):
```
Teen: lucas@teste.com / teen123
Professor: prof@teste.com / prof123
Responsável: resp@teste.com / resp123
Admin: admin@teste.com / admin123
```

---

## 📦 Deploy para Produção

### Pré-Deploy Checklist

```bash
# 1. Verificar testes locais
yarn dev  # Testar manualmente

# 2. Build local
NODE_OPTIONS="--max-old-space-size=6144" yarn build

# 3. Verificar standalone
ls -la .next/standalone/

# 4. Atualizar .env para produção
vim .env
```

**Ajustar no `.env`**:

```bash
NODE_ENV='production'
NEXTAUTH_URL='https://profdindin-teens.abacusai.app'  # ou domínio customizado
```

### Deploy via DeepAgent

```python
# Via interface do DeepAgent
deploy_nextjs_project(
    project_path="/home/ubuntu/profdindin-teens",
    hostname="profdindin-teens.abacusai.app"  # opcional
)
```

### Verificar Deploy

```bash
# Status do servidor
pm2 status profdindin-teens

# Ver logs
pm2 logs profdindin-teens --lines 50

# Métricas em tempo real
pm2 monit
```

### Testar Produção

```bash
# Testar API
curl https://profdindin-teens.abacusai.app/api/dashboard

# Testar homepage
curl https://profdindin-teens.abacusai.app
```

---

## 🔄 Atualizações de Código

### Atualizar de Development

```bash
# 1. Entrar no projeto
cd /home/ubuntu/profdindin-teens/nextjs_space

# 2. Puxar últimas mudanças
git pull origin main

# 3. Instalar novas dependências (se houver)
yarn install

# 4. Atualizar Prisma (se schema mudou)
yarn prisma generate
yarn prisma db push

# 5. Testar localmente
yarn dev

# 6. Se OK, fazer deploy
# Via DeepAgent: deploy_nextjs_project(...)
```

### Atualizar Schema do Banco

```bash
# Se o prisma/schema.prisma mudou:

# 1. Gerar migração
yarn prisma migrate dev --name descricao_da_mudanca

# 2. Aplicar em produção
yarn prisma migrate deploy

# Ou usar db push (mais simples, mas sem histórico)
yarn prisma db push
```

---

## 🔍 Monitoramento

### Logs em Tempo Real

```bash
# Ver logs do servidor
pm2 logs profdindin-teens

# Filtrar apenas erros
pm2 logs profdindin-teens --err

# Ver últimas 100 linhas
pm2 logs profdindin-teens --lines 100
```

### Status e Métricas

```bash
# Status geral
pm2 status

# Métricas (CPU, memória)
pm2 monit

# Informações detalhadas
pm2 info profdindin-teens
```

### Reiniciar Servidor

```bash
# Restart normal
pm2 restart profdindin-teens

# Restart com reload (zero-downtime)
pm2 reload profdindin-teens

# Hard restart (matar e reiniciar)
pm2 delete profdindin-teens
# Depois fazer novo deploy
```

---

## 🐛 Troubleshooting Rápido

### Servidor não inicia

```bash
# Verificar logs de erro
pm2 logs profdindin-teens --err --lines 50

# Verificar porta em uso
lsof -i :3000

# Matar processo na porta
kill -9 $(lsof -t -i:3000)

# Reiniciar
pm2 restart profdindin-teens
```

### Erro de banco de dados

```bash
# Testar conexão
psql "$DATABASE_URL" -c "SELECT 1;"

# Verificar se Prisma Client está gerado
ls -la node_modules/.prisma/client/

# Regenerar se necessário
yarn prisma generate
```

### Build falha

```bash
# Limpar cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstalar dependências
rm -rf node_modules
yarn install

# Tentar build novamente
NODE_OPTIONS="--max-old-space-size=6144" yarn build
```

### Página 404 em produção

```bash
# Verificar se .next/standalone foi criado
ls -la .next/standalone/

# Verificar se arquivos estáticos foram copiados
ls -la .next/standalone/.next/static/
ls -la .next/standalone/public/

# Se faltando, copiar manualmente:
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Reiniciar
pm2 restart profdindin-teens
```

---

## 📚 Comandos Úteis

### Banco de Dados

```bash
# Conectar ao banco
psql "$DATABASE_URL"

# Ver tabelas
psql "$DATABASE_URL" -c "\dt"

# Contar registros de uma tabela
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM users;"

# Backup
pg_dump "$DATABASE_URL" > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar
psql "$DATABASE_URL" < backup_20260131_120000.sql
```

### Git

```bash
# Ver status
git status

# Puxar últimas mudanças
git pull origin main

# Ver histórico
git log --oneline -10

# Voltar para commit específico
git checkout <commit_id>

# Criar nova branch
git checkout -b feature/nova-funcionalidade
```

### Prisma

```bash
# Gerar Client
yarn prisma generate

# Aplicar schema
yarn prisma db push

# Ver dados no Prisma Studio
yarn prisma studio

# Criar migração
yarn prisma migrate dev --name nome_da_migracao

# Aplicar migrações pendentes
yarn prisma migrate deploy

# Resetar banco (CUIDADO!)
yarn prisma migrate reset
```

### Node/Yarn

```bash
# Verificar versão do Node
node --version

# Verificar versão do Yarn
yarn --version

# Limpar cache do Yarn
yarn cache clean

# Atualizar dependências
yarn upgrade-interactive

# Verificar dependências desatualizadas
yarn outdated
```

---

## 📌 Links Úteis

- **Produção**: https://profdindin-teens.abacusai.app
- **Repositório**: https://github.com/marceloegito-max/profdindin-teens
- **Documentação**: `MIGRACAO_ABACUS.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **PM2 Docs**: https://pm2.keymetrics.io/docs/

---

## 🆘 Suporte

Se precisar de ajuda:

1. Verificar logs: `pm2 logs profdindin-teens`
2. Verificar documentação: `MIGRACAO_ABACUS.md`
3. Contatar equipe de desenvolvimento
4. Suporte Abacus.AI: https://docs.abacus.ai

---

**Criado**: 31/01/2026  
**Versão**: 1.0  
**Status**: ✅ Pronto para uso
