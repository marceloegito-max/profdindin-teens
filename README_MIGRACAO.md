# 🚀 Migração Vercel → Abacus.AI

**Status**: ✅ Pronto para migração  
**Data**: 31/01/2026

---

## 📋 O que foi feito

Este projeto foi preparado para migrar da **Vercel** para os **servidores da Abacus.AI**.

### Arquivos Criados

1. **`MIGRACAO_ABACUS.md`** - Guia completo de migração (60+ páginas)
2. **`DEPLOY_ABACUS.md`** - Guia rápido de deploy e comandos úteis
3. **`.env.example`** - Template de variáveis de ambiente
4. **`next.config.js`** - Atualizado com output standalone
5. **`scripts/`** - Scripts úteis:
   - `backup-supabase.sh` - Fazer backup do banco Supabase
   - `migrate-from-supabase.ts` - Migrar dados automaticamente
   - `test-connection.sh` - Testar conexão com banco

---

## 🎯 Início Rápido

### 1. Fazer Backup do Supabase (IMPORTANTE!)

```bash
bash scripts/backup-supabase.sh
```

### 2. Clonar Projeto na Abacus

```bash
mkdir -p /home/ubuntu/profdindin-teens
cd /home/ubuntu/profdindin-teens
git clone https://github.com/marceloegito-max/profdindin-teens.git nextjs_space
cd nextjs_space
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar template
cp .env.example .env

# Gerar NEXTAUTH_SECRET
openssl rand -base64 32

# Editar .env com os valores
vim .env
```

### 4. Inicializar Banco (via DeepAgent)

```python
# Via DeepAgent da Abacus
initialize_postgres_db(
    project_path="/home/ubuntu/profdindin-teens"
)
```

### 5. Setup e Teste Local

```bash
# Instalar dependências
yarn install

# Configurar Prisma
yarn prisma generate
yarn prisma db push
yarn prisma db seed

# Testar localmente
yarn dev
```

### 6. Deploy para Produção (via DeepAgent)

```python
# Via DeepAgent da Abacus
deploy_nextjs_project(
    project_path="/home/ubuntu/profdindin-teens",
    hostname="profdindin-teens.abacusai.app"
)
```

---

## 📚 Documentação Completa

- **[MIGRACAO_ABACUS.md](./MIGRACAO_ABACUS.md)** - Guia completo e detalhado
- **[DEPLOY_ABACUS.md](./DEPLOY_ABACUS.md)** - Comandos e troubleshooting

---

## 🔑 Diferenças Principais

| Aspecto | Vercel | Abacus.AI |
|---------|--------|-----------|
| **Banco** | Supabase (externo) | PostgreSQL incluído |
| **Deploy** | Git push automático | Via DeepAgent |
| **Variáveis** | Dashboard Web | Arquivo `.env` |
| **Acesso** | Limitado | SSH via DeepAgent |
| **Custos** | Serverless (variável) | Incluído no plano |

---

## ⚠️ Importante

1. **Fazer backup do Supabase** antes de migrar!
2. **Não commitar o `.env`** com credentials reais
3. **Testar localmente** antes do deploy em produção
4. O arquivo `.env` **não** é commitado (está no `.gitignore`)

---

## 🆘 Suporte

- Documentação: `MIGRACAO_ABACUS.md`
- Comandos úteis: `DEPLOY_ABACUS.md`
- Equipe de desenvolvimento

---

**Versão**: 1.0  
**Status**: ✅ Pronto para uso
